import { Material, ModelConfiguration, PriceBreakdown, PricingConfig, STLGeometryData } from '../../types';

export class PricingEngineService {
  /**
   * Slicer Estimation: Computes realistic print weight (grams) and print duration (minutes)
   */
  public static estimatePrintMetrics(
    geometry: STLGeometryData,
    config: ModelConfiguration,
    material: Material
  ): {
    weightGrams: number;
    printTimeMinutes: number;
    shellWeightGrams: number;
    infillWeightGrams: number;
    supportWeightGrams: number;
    layerCount: number;
  } {
    // Scaling factor applied to dimensions & volume
    const scaleFactor = (config.scalePercentage || 100) / 100;
    const scaledVolumeCm3 = (geometry.volumeCm3 || (geometry.dimensions.x * geometry.dimensions.y * geometry.dimensions.z * 0.0004)) * Math.pow(scaleFactor, 3);
    const scaledSurfaceAreaCm2 = (geometry.surfaceAreaMm2 / 100) * Math.pow(scaleFactor, 2);
    const scaledHeightMm = geometry.dimensions.z * scaleFactor;

    // Shell perimeter estimation (approx 3 walls = 1.2mm shell thickness)
    const shellThicknessCm = 0.12;
    const estimatedShellVolumeCm3 = Math.min(scaledVolumeCm3 * 0.9, scaledSurfaceAreaCm2 * shellThicknessCm);
    
    // Core infill volume
    const coreVolumeCm3 = Math.max(0, scaledVolumeCm3 - estimatedShellVolumeCm3);
    const infillRatio = Math.max(0.05, Math.min(1.0, (config.infillPercentage || 20) / 100));
    const effectiveInfillVolumeCm3 = coreVolumeCm3 * infillRatio;

    // Support structure volume estimation
    let supportMultiplier = 0;
    switch (config.supportType) {
      case 'AUTO':
        supportMultiplier = 0.08; // ~8% additional material
        break;
      case 'TREE':
        supportMultiplier = 0.05; // ~5% organic tree supports
        break;
      case 'FULL':
        supportMultiplier = 0.18; // ~18% dense scaffolding
        break;
      case 'NONE':
      default:
        supportMultiplier = 0.0;
        break;
    }
    const supportVolumeCm3 = scaledVolumeCm3 * supportMultiplier;

    // Weights calculation via density
    const density = material.density || 1.24; // g/cm³
    const shellWeightGrams = estimatedShellVolumeCm3 * density;
    const infillWeightGrams = effectiveInfillVolumeCm3 * density;
    const supportWeightGrams = supportVolumeCm3 * density;
    const totalWeightGrams = Math.max(2, Math.round((shellWeightGrams + infillWeightGrams + supportWeightGrams) * 10) / 10);

    // Print Time Estimation
    const layerHeight = config.layerHeightMm || 0.20;
    const layerCount = Math.max(1, Math.round(scaledHeightMm / layerHeight));

    let qualitySpeedFactor = 1.0;
    switch (config.qualityTier) {
      case 'DRAFT':
        qualitySpeedFactor = 1.35; // Fast
        break;
      case 'STANDARD':
        qualitySpeedFactor = 1.0;
        break;
      case 'HIGH_DETAIL':
        qualitySpeedFactor = 0.72;
        break;
      case 'ULTRA':
        qualitySpeedFactor = 0.48; // Ultra slow & detailed
        break;
    }

    // Baseline calculation: layer transition overhead + extrusion deposition speed
    const baseMinutes = (layerCount * 0.42 + totalWeightGrams * 2.1) / qualitySpeedFactor;
    // Add setup warming/calibration time (approx 8 mins)
    const printTimeMinutes = Math.max(12, Math.round(baseMinutes + 8));

    return {
      weightGrams: totalWeightGrams,
      printTimeMinutes,
      shellWeightGrams: Math.round(shellWeightGrams * 10) / 10,
      infillWeightGrams: Math.round(infillWeightGrams * 10) / 10,
      supportWeightGrams: Math.round(supportWeightGrams * 10) / 10,
      layerCount,
    };
  }

  /**
   * Authoritative dynamic pricing engine
   */
  public static calculatePrice(
    geometry: STLGeometryData,
    config: ModelConfiguration,
    material: Material,
    pricingConfig: PricingConfig,
    currency = 'GHS'
  ): PriceBreakdown {
    const { weightGrams, printTimeMinutes, supportWeightGrams } = this.estimatePrintMetrics(
      geometry,
      config,
      material
    );

    const pricePerGram = material.pricePerGram || 0.50;
    const materialCost = weightGrams * pricePerGram;

    const printHours = printTimeMinutes / 60;
    const machineCost = printHours * (pricingConfig.machineHourlyRateGHS || 6.50);

    const setupFee = pricingConfig.setupFeeGHS || 5.00;
    const supportFee = supportWeightGrams * (pricingConfig.supportFeePerGramGHS || 0.40);

    // Subtotal before rush/markup
    let baseUnitSubtotal = materialCost + machineCost + setupFee + supportFee;

    // Apply global markup
    if (pricingConfig.globalMarkupPercent > 0) {
      baseUnitSubtotal *= 1 + pricingConfig.globalMarkupPercent / 100;
    }

    // Rush fee
    let rushFee = 0;
    if (config.rushProduction) {
      rushFee = baseUnitSubtotal * ((pricingConfig.rushMultiplier || 1.5) - 1);
    }

    let unitTotal = baseUnitSubtotal + rushFee;
    let minimumOrderApplied = false;

    // Check minimum order price threshold per item
    if (unitTotal < (pricingConfig.minimumOrderGHS || 15.00)) {
      unitTotal = pricingConfig.minimumOrderGHS || 15.00;
      minimumOrderApplied = true;
    }

    const quantity = config.quantity || 1;
    const total = Math.round(unitTotal * quantity * 100) / 100;

    return {
      materialCost: Math.round(materialCost * quantity * 100) / 100,
      machineCost: Math.round(machineCost * quantity * 100) / 100,
      setupFee: Math.round(setupFee * quantity * 100) / 100,
      supportFee: Math.round(supportFee * quantity * 100) / 100,
      rushFee: Math.round(rushFee * quantity * 100) / 100,
      deliveryFee: 0,
      discount: 0,
      subtotal: Math.round(baseUnitSubtotal * quantity * 100) / 100,
      total,
      minimumOrderApplied,
      estimatedWeightGrams: Math.round(weightGrams * quantity * 10) / 10,
      estimatedPrintTimeMinutes: Math.round(printTimeMinutes * quantity),
      currency,
    };
  }

  /**
   * Currency formatter helper
   */
  public static formatPrice(amountGHS: number, currency: 'GHS' | 'USD' | 'EUR' = 'GHS'): string {
    const exchangeRates = {
      GHS: 1.0,
      USD: 0.068, // 1 GHS ≈ 0.068 USD
      EUR: 0.063, // 1 GHS ≈ 0.063 EUR
    };

    const converted = amountGHS * (exchangeRates[currency] || 1.0);

    switch (currency) {
      case 'USD':
        return `$${converted.toFixed(2)}`;
      case 'EUR':
        return `€${converted.toFixed(2)}`;
      case 'GHS':
      default:
        return `GHS ${converted.toFixed(2)}`;
    }
  }

  /**
   * Format print time into human readable string
   */
  public static formatTime(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
  }
}

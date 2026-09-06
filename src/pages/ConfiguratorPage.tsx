import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { STLViewer3D } from '../components/3d/STLViewer3D';
import { STLUploader } from '../components/3d/STLUploader';
import { DimensionControls } from '../components/configurator/DimensionControls';
import { PrintConfigPanel } from '../components/configurator/PrintConfigPanel';
import { PricingTelemetryCard } from '../components/configurator/PricingTelemetryCard';
import { QuoteSummaryModal } from '../components/configurator/QuoteSummaryModal';
import { PartSelectorBar } from '../components/configurator/PartSelectorBar';
import { PricingEngineService } from '../services/pricing/pricingEngine';
import { AssemblyPart, CartItem, ModelConfiguration, STLModel } from '../types';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  FileCode,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Truck,
  ShoppingCart,
  Upload,
} from 'lucide-react';
import * as THREE from 'three';
import { STLParserService } from '../services/3d/stlParser';
import { ProceduralModelService } from '../services/3d/proceduralModels';

export const ConfiguratorPage: React.FC = () => {
  const {
    activeModel,
    activeModelList,
    setActiveModelList,
    activeModelIndex,
    setActiveModelIndex,
    activeConfig,
    setActiveConfig,
    materials,
    pricingConfig,
    addToCart,
    formatPrice,
    loadModelsIntoConfigurator,
    addModelToConfigurator,
    removeModelFromConfigurator,
    resetConfigurator,
    setActivePage,
  } = useApp();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Per-part configurations map
  const [partConfigs, setPartConfigs] = useState<Record<string, ModelConfiguration>>({});

  // Sync current active part configuration
  useEffect(() => {
    if (activeModel) {
      if (partConfigs[activeModel.id]) {
        setActiveConfig(partConfigs[activeModel.id]);
      } else {
        setPartConfigs((prev) => ({
          ...prev,
          [activeModel.id]: activeConfig,
        }));
      }
    }
  }, [activeModel?.id]);

  // Handle configuration changes for current active part
  const handleConfigChange = (newValues: Partial<ModelConfiguration>) => {
    setActiveConfig((prev) => {
      const updated = { ...prev, ...newValues };
      if (activeModel) {
        setPartConfigs((p) => ({
          ...p,
          [activeModel.id]: updated,
        }));
      }
      return updated;
    });
  };

  // Selected Material for active model
  const selectedMaterial = useMemo(() => {
    return (
      materials.find((m) => m.id === activeConfig.materialId) ||
      materials.find((m) => m.active) ||
      materials[0]
    );
  }, [materials, activeConfig.materialId]);

  // Re-generate geometry from fileBuffer if activeModel has buffer
  const threeGeometry = useMemo(() => {
    if (!activeModel) return null;
    if (activeModel.fileBuffer && activeModel.fileBuffer.byteLength > 0) {
      try {
        const { geometry } = STLParserService.parse(activeModel.fileBuffer);
        return geometry;
      } catch (err) {
        console.warn('Could not parse threeGeometry from buffer, using geometric fallback:', err);
      }
    }
    // Fallback: Generate 3D geometry matching model dimensions so canvas NEVER renders blank!
    try {
      const dims = activeModel.geometry?.dimensions || { x: 80, y: 80, z: 40 };
      const safeX = Math.max(10, dims.x || 80);
      const safeY = Math.max(10, dims.y || 80);
      const safeZ = Math.max(5, dims.z || 40);
      const fallbackGeo = new THREE.BoxGeometry(safeX, safeZ, safeY);
      fallbackGeo.center();
      fallbackGeo.translate(0, safeZ / 2, 0);
      fallbackGeo.computeVertexNormals();
      return fallbackGeo;
    } catch {
      const safeGeo = new THREE.BoxGeometry(60, 40, 60);
      safeGeo.center();
      safeGeo.translate(0, 20, 0);
      return safeGeo;
    }
  }, [activeModel?.id, activeModel?.fileBuffer]);

  // Calculate price breakdowns for all parts in the assembly
  const allPartsBreakdowns = useMemo(() => {
    return activeModelList.map((model) => {
      const cfg = partConfigs[model.id] || activeConfig;
      const mat =
        materials.find((m) => m.id === cfg.materialId) ||
        materials.find((m) => m.active) ||
        materials[0];

      const breakdown = PricingEngineService.calculatePrice(
        model.geometry,
        cfg,
        mat,
        pricingConfig
      );

      return {
        model,
        config: cfg,
        material: mat,
        breakdown,
      };
    });
  }, [activeModelList, partConfigs, activeConfig, materials, pricingConfig]);

  // Consolidated assembly price breakdown
  const assemblyPriceBreakdown = useMemo(() => {
    if (allPartsBreakdowns.length === 0) {
      return {
        materialCost: 0,
        machineCost: 0,
        setupFee: 0,
        supportFee: 0,
        rushFee: 0,
        deliveryFee: 0,
        discount: 0,
        subtotal: 0,
        total: 0,
        minimumOrderApplied: false,
        estimatedWeightGrams: 0,
        estimatedPrintTimeMinutes: 0,
        currency: 'GHS',
      };
    }

    if (allPartsBreakdowns.length === 1) {
      return allPartsBreakdowns[0].breakdown;
    }

    let totalMaterialCost = 0;
    let totalMachineCost = 0;
    let totalSupportFee = 0;
    let totalWeightGrams = 0;
    let totalPrintTimeMinutes = 0;
    const quantity = activeConfig.quantity || 1;

    allPartsBreakdowns.forEach((item) => {
      totalMaterialCost += item.breakdown.materialCost;
      totalMachineCost += item.breakdown.machineCost;
      totalSupportFee += item.breakdown.supportFee;
      totalWeightGrams += item.breakdown.estimatedWeightGrams;
      totalPrintTimeMinutes += item.breakdown.estimatedPrintTimeMinutes;
    });

    const setupFee = pricingConfig.setupFeeGHS;
    let subtotal = (totalMaterialCost + totalMachineCost + setupFee + totalSupportFee) * quantity;
    let rushFee = 0;
    if (activeConfig.rushProduction) {
      rushFee = subtotal * (pricingConfig.rushMultiplier - 1);
      subtotal += rushFee;
    }

    let total = subtotal;
    let minimumOrderApplied = false;
    if (total < pricingConfig.minimumOrderGHS) {
      total = pricingConfig.minimumOrderGHS;
      minimumOrderApplied = true;
    }

    return {
      materialCost: Math.round(totalMaterialCost * 100) / 100,
      machineCost: Math.round(totalMachineCost * 100) / 100,
      setupFee: Math.round(setupFee * 100) / 100,
      supportFee: Math.round(totalSupportFee * 100) / 100,
      rushFee: Math.round(rushFee * 100) / 100,
      deliveryFee: 0,
      discount: 0,
      subtotal: Math.round(subtotal * 100) / 100,
      total: Math.round(total * 100) / 100,
      minimumOrderApplied,
      estimatedWeightGrams: Math.round(totalWeightGrams * 10) / 10,
      estimatedPrintTimeMinutes: Math.round(totalPrintTimeMinutes),
      currency: 'GHS',
    };
  }, [allPartsBreakdowns, activeConfig.quantity, activeConfig.rushProduction, pricingConfig]);

  const handleModelsLoaded = (models: STLModel[]) => {
    loadModelsIntoConfigurator(models);
  };

  const handleAddFiles = (newModels: STLModel[]) => {
    newModels.forEach((m) => addModelToConfigurator(m));
  };

  const handleRemovePart = (index: number) => {
    removeModelFromConfigurator(index);
  };

  const handleAddToCart = () => {
    if (!activeModel || activeModelList.length === 0) return;

    // Trigger celebratory micro confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E10600', '#FF2B20', '#FFFFFF', '#111111'],
    });

    const isMultiPart = activeModelList.length > 1;

    const parts: AssemblyPart[] = allPartsBreakdowns.map((item) => ({
      id: `part-${item.model.id}`,
      model: item.model,
      configuration: item.config,
      priceBreakdown: item.breakdown,
    }));

    const selectedColor =
      selectedMaterial.colors.find((c) => c.id === activeConfig.colorId) ||
      selectedMaterial.colors[0];

    const title = isMultiPart
      ? `Multi-Part 3D Assembly (${activeModelList.length} Parts)`
      : activeModel.filename;

    const subtitle = isMultiPart
      ? `${activeModelList.map((m) => m.filename.replace(/\.stl$/i, '')).join(' + ')} • ${selectedMaterial.name}`
      : `${selectedMaterial.name} • ${selectedColor.name} • ${activeConfig.infillPercentage}% Infill • ${activeConfig.layerHeightMm}mm`;

    const cartItem: CartItem = {
      id: `cart-stl-${Date.now()}`,
      type: 'CUSTOM_STL',
      title,
      subtitle,
      model: activeModel,
      configuration: { ...activeConfig },
      parts: isMultiPart ? parts : undefined,
      quantity: activeConfig.quantity || 1,
      unitPrice: assemblyPriceBreakdown.total / (activeConfig.quantity || 1),
      totalPrice: assemblyPriceBreakdown.total,
      priceBreakdown: assemblyPriceBreakdown,
      addedAt: new Date().toISOString(),
    };

    addToCart(cartItem);
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    setActivePage('checkout');
  };

  const partWeights = allPartsBreakdowns.map((p) => p.breakdown.estimatedWeightGrams);

  const partsList = allPartsBreakdowns.map((p) => ({
    name: p.model.filename,
    weightGrams: p.breakdown.estimatedWeightGrams,
    materialName: p.material.name,
  }));

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [modelDisplayName, setModelDisplayName] = useState(activeModel?.filename || 'Custom_Part.stl');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (activeModel) {
      setModelDisplayName(activeModel.filename);
    } else {
      setModelDisplayName('Upload STL Model');
    }
  }, [activeModel]);

  const [isDragging, setIsDragging] = useState(false);

  const handleLoadSample = (sampleKey: string, filename: string) => {
    try {
      const geom = ProceduralModelService.generateGeometry(sampleKey);
      const buffer = ProceduralModelService.geometryToBinarySTL(geom);
      const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

      const model: STLModel = {
        id: `model-sample-${Date.now()}`,
        filename: filename,
        fileSize: buffer.byteLength,
        fileBuffer: buffer,
        geometry: data,
        createdAt: new Date().toISOString(),
      };

      loadModelsIntoConfigurator([model]);
    } catch (err) {
      console.error('Error loading sample model:', err);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const addedModels: STLModel[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

        addedModels.push({
          id: `model-${Date.now()}-${i}`,
          filename: file.name,
          fileSize: file.size,
          fileBuffer: buffer,
          geometry: data,
          createdAt: new Date().toISOString(),
        });
      }
      if (addedModels.length > 0) {
        if (!activeModel || activeModelList.length === 0) {
          loadModelsIntoConfigurator(addedModels);
        } else {
          handleAddFiles(addedModels);
        }
      }
    } catch (err: any) {
      console.error('Failed to parse STL file:', err);
      alert('Could not parse STL model: ' + (err?.message || 'Invalid format'));
    }
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files, value: '' }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileInput(fakeEvent);
    }
  };

  const dimX = Math.round((activeModel?.geometry.dimensions.x || 120) * (activeConfig.scaleX / 100));
  const dimY = Math.round((activeModel?.geometry.dimensions.y || 80) * (activeConfig.scaleY / 100));
  const dimZ = Math.round((activeModel?.geometry.dimensions.z || 45) * (activeConfig.scaleZ / 100));

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6 animate-slide-up">
      {/* Multi-Part Selector Bar if more than 1 model */}
      {activeModelList.length > 1 && (
        <PartSelectorBar
          models={activeModelList}
          activeIndex={activeModelIndex}
          onSelectIndex={(idx) => setActiveModelIndex(idx)}
          onAddFiles={handleAddFiles}
          onRemoveIndex={handleRemovePart}
          partWeights={partWeights}
          totalWeightGrams={assemblyPriceBreakdown.estimatedWeightGrams}
        />
      )}

      {/* Main Studio Grid: Left 3D Canvas & Bottom Cards / Right Configure Print Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Viewport & 3 Data Cards) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main 3D Viewport / Upload Box matching Mockup 2 */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A0A0A] border border-neutral-900 min-h-[480px] sm:min-h-[520px] shadow-2xl">
            {!activeModel ? (
              /* Red Dashed Upload Box matching Mockup 2 */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full min-h-[480px] sm:min-h-[520px] p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-2 border-brand-red bg-brand-red/10'
                    : 'border-2 border-dashed border-red-600/50 bg-[#0e0e0e]'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800/40 text-brand-red flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-950/50">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5 font-display tracking-tight">
                  Upload STL 3D Model
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
                  Drag and drop your single or multi-part .STL file here, or click below to browse from your device.
                </p>
                <label className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-red-glow transition-all mb-8">
                  <span>Select STL File</span>
                  <input
                    type="file"
                    accept=".stl"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>

                {/* Instant 1-Click Sample Testing */}
                <div className="pt-6 border-t border-neutral-800/80 w-full max-w-md space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Quick Test Samples:
                    </span>
                    <span>1-Click Load</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <button
                      type="button"
                      onClick={() => handleLoadSample('lion-emblem', 'Lion_Den_Emblem.stl')}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-brand-red/60 transition-all text-left group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-brand-red transition-colors truncate">
                        Lion Head
                      </div>
                      <div className="text-[9px] text-neutral-500 font-mono">Sculpture</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('planetary-gear', 'Planetary_Gearbox.stl')}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-brand-red/60 transition-all text-left group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-brand-red transition-colors truncate">
                        Planetary Gear
                      </div>
                      <div className="text-[9px] text-neutral-500 font-mono">Mechanism</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('lattice-cube', 'Lattice_Stress_Cube.stl')}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-brand-red/60 transition-all text-left group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-brand-red transition-colors truncate">
                        Lattice Cube
                      </div>
                      <div className="text-[9px] text-neutral-500 font-mono">Benchmark</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Interactive 3D Canvas */
              <div className="w-full h-full relative">
                <STLViewer3D
                  geometry={threeGeometry}
                  geometryData={activeModel.geometry}
                  config={activeConfig}
                  material={selectedMaterial}
                  height="520px"
                  interactive={true}
                  showControls={true}
                  extraHeaderLeft={
                    activeModelList.length > 1 ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-brand-red/40 text-xs font-mono text-white shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                        <span className="text-brand-red font-bold">
                          Part {activeModelIndex + 1}/{activeModelList.length}:
                        </span>
                        <span className="truncate max-w-[120px]">{activeModel.filename}</span>
                      </div>
                    ) : undefined
                  }
                  extraHeaderRight={
                    <div className="flex items-center gap-1.5">
                      <label className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5 shadow-lg">
                        <Upload className="w-3.5 h-3.5 text-brand-red" />
                        <span>Add Part</span>
                        <input
                          type="file"
                          accept=".stl"
                          multiple
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={resetConfigurator}
                        className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-800 text-xs text-neutral-400 hover:text-white transition-colors shadow-lg"
                      >
                        Reset
                      </button>
                    </div>
                  }
                />
              </div>
            )}
          </div>

          {/* 3 Bottom Cards matching Mockup 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. MODEL NAME */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 block">
                MODEL NAME
              </span>
              <div className="flex items-center justify-between">
                {isRenaming ? (
                  <input
                    type="text"
                    value={modelDisplayName}
                    onChange={(e) => setModelDisplayName(e.target.value)}
                    onBlur={() => setIsRenaming(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsRenaming(false)}
                    autoFocus
                    className="bg-black border border-neutral-700 rounded px-2 py-0.5 text-xs text-white font-bold w-full"
                  />
                ) : (
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {modelDisplayName}
                  </span>
                )}
                <button
                  onClick={() => setIsRenaming(!isRenaming)}
                  className="text-brand-red text-xs font-medium hover:underline ml-2"
                >
                  {isRenaming ? 'Done' : 'Rename'}
                </button>
              </div>
            </div>

            {/* 2. DIMENSIONS (MM) */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 block">
                DIMENSIONS ({unitSystem === 'metric' ? 'MM' : 'IN'})
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="number"
                  value={unitSystem === 'metric' ? dimX : Math.round(dimX / 25.4)}
                  readOnly
                  className="bg-black border border-neutral-800 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
                  title="X Dimension"
                />
                <input
                  type="number"
                  value={unitSystem === 'metric' ? dimY : Math.round(dimY / 25.4)}
                  readOnly
                  className="bg-black border border-neutral-800 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
                  title="Y Dimension"
                />
                <input
                  type="number"
                  value={unitSystem === 'metric' ? dimZ : Math.round(dimZ / 25.4)}
                  readOnly
                  className="bg-black border border-neutral-800 rounded px-1.5 py-1 text-xs text-center text-white font-mono"
                  title="Z Dimension"
                />
              </div>
            </div>

            {/* 3. UNIT SYSTEM */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 block">
                UNIT SYSTEM
              </span>
              <div className="flex bg-black border border-neutral-800 rounded p-0.5">
                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                    unitSystem === 'metric'
                      ? 'bg-brand-red text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-colors ${
                    unitSystem === 'imperial'
                      ? 'bg-brand-red text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: "Configure Print" Panel matching Mockup 2 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#121212] border border-[#1E1E1E] p-6 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">Configure Print</h2>

            {/* MATERIAL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider">
                  MATERIAL
                </span>
                <button
                  onClick={() => setActivePage('materials')}
                  className="text-brand-red hover:underline text-xs"
                >
                  Material Guide
                </button>
              </div>
              <select
                value={activeConfig.materialId}
                onChange={(e) => handleConfigChange({ materialId: e.target.value })}
                className="w-full px-3 py-3 rounded-lg bg-black border border-neutral-800 text-sm text-white focus:border-brand-red outline-none cursor-pointer"
              >
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name} ({mat.colors[0]?.name || 'Matte Black'})
                  </option>
                ))}
              </select>
            </div>

            {/* LAYER HEIGHT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider">
                  LAYER HEIGHT
                </span>
                <span className="text-brand-red font-mono font-bold text-xs">
                  {activeConfig.layerHeightMm.toFixed(2)} mm
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.28"
                step="0.01"
                value={activeConfig.layerHeightMm}
                onChange={(e) =>
                  handleConfigChange({ layerHeightMm: parseFloat(e.target.value) })
                }
                className="w-full accent-brand-red h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 uppercase font-semibold">
                <span>DRAFT (0.28)</span>
                <span>STANDARD</span>
                <span>FINE</span>
                <span>ULTRA (0.05)</span>
              </div>
            </div>

            {/* INFILL DENSITY */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-400 uppercase tracking-wider">
                  INFILL DENSITY
                </span>
                <span className="text-brand-red font-mono font-bold text-xs">
                  {activeConfig.infillPercentage}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 40, 80].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleConfigChange({ infillPercentage: val })}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      activeConfig.infillPercentage === val
                        ? 'bg-brand-red/15 border border-brand-red text-white font-bold'
                        : 'bg-black border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                QUANTITY
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-black border border-neutral-800 rounded-lg px-3 py-1.5 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleConfigChange({ quantity: Math.max(1, activeConfig.quantity - 1) })
                    }
                    className="text-neutral-400 hover:text-white text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white font-mono">
                    {activeConfig.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleConfigChange({ quantity: activeConfig.quantity + 1 })
                    }
                    className="text-neutral-400 hover:text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-500">
                  Batch discounts apply over 10 units
                </span>
              </div>
            </div>

            {/* PRICE BREAKDOWN */}
            <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Printing Cost</span>
                <span className="text-white font-semibold font-mono">
                  {formatPrice(assemblyPriceBreakdown.machineCost || 24.5)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>
                  Material ({assemblyPriceBreakdown.estimatedWeightGrams.toFixed(1)}g)
                </span>
                <span className="text-white font-semibold font-mono">
                  {formatPrice(assemblyPriceBreakdown.materialCost || 4.8)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
            </div>

            {/* TOTAL PRICE */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Total Price</div>
                <div className="text-[9px] text-neutral-500 uppercase tracking-wider">
                  INC. VAT WHERE APPLICABLE
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-red font-mono">
                {formatPrice(assemblyPriceBreakdown.total || 29.3)}
              </div>
            </div>

            {/* ADD TO ORDER */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-red-glow transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Order</span>
            </button>
          </div>

          {/* PRIORITY PRODUCTION AVAILABLE BANNER matching Mockup 2 */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-950/50 border border-red-900/40 text-brand-red flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Priority Production Available
              </div>
              <div className="text-[11px] text-neutral-400">
                Ships in 24 hours for +$15.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

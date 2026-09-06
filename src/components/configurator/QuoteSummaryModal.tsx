import React from 'react';
import { Material, ModelConfiguration, PriceBreakdown, STLGeometryData, STLModel } from '../../types';
import { PricingEngineService } from '../../services/pricing/pricingEngine';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  FileCode,
  Layers,
  Printer,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Timer,
  X,
} from 'lucide-react';

interface QuoteSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: STLModel;
  geometry: STLGeometryData;
  config: ModelConfiguration;
  material: Material;
  priceBreakdown: PriceBreakdown;
  onAddToCart: () => void;
  onDirectCheckout: () => void;
  formatPrice: (amountGHS: number) => string;
  allModels?: STLModel[];
}

export const QuoteSummaryModal: React.FC<QuoteSummaryModalProps> = ({
  isOpen,
  onClose,
  model,
  geometry,
  config,
  material,
  priceBreakdown,
  onAddToCart,
  onDirectCheckout,
  formatPrice,
  allModels = [],
}) => {
  if (!isOpen) return null;

  const scaleFactor = (config.scalePercentage || 100) / 100;
  const currentDims = {
    x: (geometry.dimensions.x * scaleFactor).toFixed(1),
    y: (geometry.dimensions.y * scaleFactor).toFixed(1),
    z: (geometry.dimensions.z * scaleFactor).toFixed(1),
  };

  const selectedColor =
    material.colors.find((c) => c.id === config.colorId) || material.colors[0];

  const isAssembly = allModels.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pb-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 animate-slide-up space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-brand-card text-brand-textMuted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-brand-border pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-card border border-brand-red/40 flex items-center justify-center text-brand-red">
            {isAssembly ? <Boxes className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-brand-red font-semibold">
              Your Quote
            </span>
            <h2 className="text-lg font-bold font-display uppercase tracking-wider text-white">
              {isAssembly
                ? `${allModels.length}-Part Print Summary`
                : 'Print Summary'}
            </h2>
          </div>
        </div>

        {/* Model & Configuration Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* File & Geometry */}
          <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2.5">
            <div className="text-[11px] font-sans text-brand-red font-semibold uppercase">
              {isAssembly ? 'Active Part' : 'Model Details'}
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-brand-textDim">Source File:</span>
                <span className="text-white font-semibold truncate max-w-[150px]" title={model.filename}>
                  {model.filename}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Dimensions:</span>
                <span className="text-white">
                  {currentDims.x} × {currentDims.y} × {currentDims.z} mm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Scale Factor:</span>
                <span className="text-white">{config.scalePercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Triangles:</span>
                <span className="text-white">{geometry.triangleCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Slicer Settings */}
          <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2.5">
            <div className="text-[11px] font-sans text-brand-red font-semibold uppercase">
              Settings
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-brand-textDim">Material:</span>
                <span className="text-white font-semibold">{material.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Color:</span>
                <span className="text-white flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedColor?.hex }}
                  />
                  {selectedColor?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Infill:</span>
                <span className="text-white">{config.infillPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Layer Height:</span>
                <span className="text-white">{config.layerHeightMm} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textDim">Supports:</span>
                <span className="text-white">{config.supportType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Part Assembly List (if > 1 part) */}
        {isAssembly && (
          <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2 text-xs font-mono">
            <div className="text-[11px] font-bold uppercase text-brand-red flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" />
              <span>All Assembly Parts In This Print ({allModels.length})</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {allModels.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center text-brand-textMuted border-b border-white/5 pb-1">
                  <span className="text-white">Part {idx + 1}: {m.filename}</span>
                  <span className="text-brand-textDim">
                    {m.geometry.dimensions.x.toFixed(0)}×{m.geometry.dimensions.y.toFixed(0)}×{m.geometry.dimensions.z.toFixed(0)} mm • ~{Math.round(m.geometry.volumeCm3 * 1.24 * 0.45)}g
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Telemetry Summary Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-brand-card border border-brand-border text-center font-mono">
          <div>
            <span className="text-[10px] text-brand-textDim block">
              {isAssembly ? 'Total Assembly Mass' : 'Total Weight'}
            </span>
            <span className="text-sm font-bold text-white">
              {priceBreakdown.estimatedWeightGrams} g
            </span>
          </div>
          <div className="border-x border-brand-border">
            <span className="text-[10px] text-brand-textDim block">Print Time</span>
            <span className="text-sm font-bold text-white">
              {PricingEngineService.formatTime(priceBreakdown.estimatedPrintTimeMinutes)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-brand-textDim block">Quantity</span>
            <span className="text-sm font-bold text-white">{config.quantity} {isAssembly ? 'Set(s)' : 'Unit(s)'}</span>
          </div>
        </div>

        {/* Itemized Price Breakdown */}
        <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2 text-xs font-mono">
          <div className="flex justify-between text-brand-textMuted">
            <span>Material Extrusion Cost:</span>
            <span className="text-white">{formatPrice(priceBreakdown.materialCost)}</span>
          </div>
          <div className="flex justify-between text-brand-textMuted">
            <span>Machine Slicing & Operation:</span>
            <span className="text-white">{formatPrice(priceBreakdown.machineCost)}</span>
          </div>
          <div className="flex justify-between text-brand-textMuted">
            <span>Bed Leveling & Setup Fee:</span>
            <span className="text-white">{formatPrice(priceBreakdown.setupFee)}</span>
          </div>
          {priceBreakdown.supportFee > 0 && (
            <div className="flex justify-between text-brand-textMuted">
              <span>Support Structures:</span>
              <span className="text-white">{formatPrice(priceBreakdown.supportFee)}</span>
            </div>
          )}
          {priceBreakdown.rushFee > 0 && (
            <div className="flex justify-between text-brand-redBright">
              <span>Priority 24h Queue:</span>
              <span>{formatPrice(priceBreakdown.rushFee)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-brand-border flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Total:</span>
            <span className="text-2xl font-extrabold text-brand-redBright">
              {formatPrice(priceBreakdown.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onAddToCart();
              onClose();
            }}
            className="py-3.5 rounded-xl bg-brand-surface hover:bg-brand-cardHover border border-brand-border text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-brand-red" />
            <span>Add to Cart & Keep Browsing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDirectCheckout();
              onClose();
            }}
            className="py-3.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-red-glow transition-all"
          >
            <span>Direct Checkout Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

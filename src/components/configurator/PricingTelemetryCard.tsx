import React, { useState } from 'react';
import { Material, ModelConfiguration, PriceBreakdown, STLGeometryData } from '../../types';
import { PricingEngineService } from '../../services/pricing/pricingEngine';
import {
  AlertCircle,
  ArrowRight,
  Boxes,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

interface PricingTelemetryCardProps {
  geometry: STLGeometryData;
  config: ModelConfiguration;
  material: Material;
  priceBreakdown: PriceBreakdown;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onOpenQuoteSummary: () => void;
  formatPrice: (amountGHS: number) => string;
  partsCount?: number;
  partsList?: { name: string; weightGrams: number; materialName: string }[];
}

export const PricingTelemetryCard: React.FC<PricingTelemetryCardProps> = ({
  geometry,
  config,
  material,
  priceBreakdown,
  onQuantityChange,
  onAddToCart,
  onOpenQuoteSummary,
  formatPrice,
  partsCount = 1,
  partsList = [],
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Red Glow Gradient */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Live Quotation Engine
          </span>
          <h3 className="text-base font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
            <span>{partsCount > 1 ? `Assembly Quote (${partsCount} Parts)` : 'Print Summary'}</span>
          </h3>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/40 text-[10px] font-mono text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Real-Time Slicer</span>
        </div>
      </div>

      {/* Multi-Part Assembly Parts Breakdown (if partsCount > 1) */}
      {partsCount > 1 && partsList.length > 0 && (
        <div className="p-3 rounded-xl bg-brand-surface/80 border border-brand-border/80 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-brand-red flex items-center gap-1">
            <Boxes className="w-3 h-3" />
            <span>Assembly Parts In This Job</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            {partsList.map((part, i) => (
              <div key={i} className="flex justify-between items-center text-brand-textMuted">
                <span className="truncate max-w-[170px] text-white">
                  Part {i + 1}: {part.name}
                </span>
                <span className="text-brand-textDim text-[11px]">
                  ~{part.weightGrams}g ({part.materialName.split(' ')[0]})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Telemetry Badges */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-brand-surface border border-brand-border text-center">
        {/* Material */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-brand-textDim block">
            {partsCount > 1 ? 'Primary Material' : 'Material'}
          </span>
          <span className="text-xs font-bold text-white font-mono">{material.code}</span>
        </div>

        {/* Estimated Weight */}
        <div className="space-y-0.5 border-x border-brand-border/60">
          <span className="text-[10px] font-mono text-brand-textDim flex items-center justify-center gap-1">
            <Scale className="w-2.5 h-2.5 text-brand-red" /> {partsCount > 1 ? 'Total Mass' : 'Weight'}
          </span>
          <span className="text-xs font-bold text-white font-mono">
            {priceBreakdown.estimatedWeightGrams} g
          </span>
        </div>

        {/* Print Time */}
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-brand-textDim flex items-center justify-center gap-1">
            <Clock className="w-2.5 h-2.5 text-brand-red" /> Duration
          </span>
          <span className="text-xs font-bold text-white font-mono">
            {PricingEngineService.formatTime(priceBreakdown.estimatedPrintTimeMinutes)}
          </span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-brand-surface border border-brand-border">
        <span className="text-xs font-medium text-brand-textMuted">
          {partsCount > 1 ? 'Assembly Sets' : 'Print Quantity'}
        </span>
        <div className="flex items-center gap-2 border border-brand-border rounded-lg bg-brand-card p-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, config.quantity - 1))}
            className="p-1 text-brand-textMuted hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-mono font-bold text-white min-w-[2rem] text-center">
            {config.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(config.quantity + 1)}
            className="p-1 text-brand-textMuted hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Itemized Price Breakdown (Expandable) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-xs font-mono text-brand-textDim hover:text-white transition-colors"
        >
          <span>Itemized Cost Breakdown</span>
          {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showBreakdown && (
          <div className="p-3.5 rounded-xl bg-brand-surface/70 border border-brand-border/80 text-xs font-mono space-y-2 animate-slide-up">
            <div className="flex justify-between text-brand-textMuted">
              <span>Thermopolymer Filament ({material.code}):</span>
              <span className="text-white">{formatPrice(priceBreakdown.materialCost)}</span>
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Additive Machine Runtime:</span>
              <span className="text-white">{formatPrice(priceBreakdown.machineCost)}</span>
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Platform Setup & Calibration:</span>
              <span className="text-white">{formatPrice(priceBreakdown.setupFee)}</span>
            </div>
            {priceBreakdown.supportFee > 0 && (
              <div className="flex justify-between text-brand-textMuted">
                <span>Support Material & Dissolving:</span>
                <span className="text-white">{formatPrice(priceBreakdown.supportFee)}</span>
              </div>
            )}
            {priceBreakdown.rushFee > 0 && (
              <div className="flex justify-between text-brand-redBright">
                <span>Priority 24h Rush Queue:</span>
                <span>{formatPrice(priceBreakdown.rushFee)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimum Order Price Alert */}
      {priceBreakdown.minimumOrderApplied && (
        <div className="p-2.5 rounded-lg bg-brand-red/10 border border-brand-red/30 text-[11px] font-mono text-brand-redBright flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Minimum studio order threshold applied.</span>
        </div>
      )}

      {/* Prominent Live Price Display */}
      <div className="pt-2 border-t border-brand-border flex items-end justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-textDim block">
            {partsCount > 1 ? 'Total Assembly Price' : 'Estimated Total'}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatPrice(priceBreakdown.total)}
          </span>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 pb-1">
          ✓ Includes Slicing & QC
        </span>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-red-glow transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{partsCount > 1 ? 'Add Multi-Part Assembly to Cart' : 'Add Print to Cart'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenQuoteSummary}
          className="w-full py-2.5 rounded-xl bg-brand-surface hover:bg-brand-cardHover border border-brand-border text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Inspect Full Technical Quote Sheet</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-red" />
        </button>
      </div>
    </div>
  );
};

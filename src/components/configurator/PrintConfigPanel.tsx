import React from 'react';
import { Material, ModelConfiguration, QualityTier, SupportType } from '../../types';
import {
  Check,
  Cpu,
  Flame,
  HelpCircle,
  Layers,
  Palette,
  Shield,
  Zap,
} from 'lucide-react';

interface PrintConfigPanelProps {
  materials: Material[];
  selectedMaterial: Material;
  config: ModelConfiguration;
  onChange: (newConfig: Partial<ModelConfiguration>) => void;
  formatPrice: (amountGHS: number) => string;
}

export const PrintConfigPanel: React.FC<PrintConfigPanelProps> = ({
  materials,
  selectedMaterial,
  config,
  onChange,
  formatPrice,
}) => {
  const infillOptions = [
    { value: 10, label: '10%', desc: 'Lightweight / Display' },
    { value: 20, label: '20%', desc: 'Standard / Recommended' },
    { value: 30, label: '30%', desc: 'Sturdy Desktop' },
    { value: 50, label: '50%', desc: 'Heavy Mechanical' },
    { value: 75, label: '75%', desc: 'High Load Bearing' },
    { value: 100, label: '100%', desc: 'Solid Infill' },
  ];

  const layerOptions = [
    { value: 0.12, label: '0.12 mm', tier: 'Ultra Fine', desc: 'Miniatures & crisp text' },
    { value: 0.16, label: '0.16 mm', tier: 'High Detail', desc: 'Smooth curved surfaces' },
    { value: 0.20, label: '0.20 mm', tier: 'Standard', desc: 'Optimal speed & quality' },
    { value: 0.28, label: '0.28 mm', tier: 'Draft Speed', desc: 'Rapid prototyping' },
  ];

  const supportOptions: { value: SupportType; label: string; desc: string }[] = [
    { value: 'NONE', label: 'No Supports', desc: 'For self-supporting 45° overhangs' },
    { value: 'AUTO', label: 'Auto Normal', desc: 'Slicer-generated base supports' },
    { value: 'TREE', label: 'Tree / Organic', desc: 'Easy breakaway, clean surface' },
    { value: 'FULL', label: 'Full Scaffold', desc: 'Heavy support for complex bridges' },
  ];

  const qualityOptions: { value: QualityTier; label: string; speed: string }[] = [
    { value: 'DRAFT', label: 'Draft', speed: '1.35x Speed' },
    { value: 'STANDARD', label: 'Standard', speed: 'Balanced' },
    { value: 'HIGH_DETAIL', label: 'High Detail', speed: '0.7x Speed' },
    { value: 'ULTRA', label: 'Ultra', speed: '0.5x Speed' },
  ];

  const handleMaterialChange = (mat: Material) => {
    const firstColor = mat.colors.find((c) => c.available)?.id || mat.colors[0]?.id || 'c-default';
    onChange({
      materialId: mat.id,
      colorId: firstColor,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Material Selection */}
      <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-red" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              1. Select Engineering Material
            </h3>
          </div>
          <span className="text-[11px] font-mono text-brand-textDim">
            {materials.filter((m) => m.active).length} Thermopolymers Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {materials
            .filter((m) => m.active)
            .map((mat) => {
              const isSelected = selectedMaterial.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => handleMaterialChange(mat)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-red/10 border-brand-red shadow-red-glow'
                      : 'bg-brand-surface border-brand-border hover:border-brand-borderLight'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{mat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-red" />}
                      </div>
                      <span className="text-[10px] font-mono text-brand-textDim">
                        Density: {mat.density} g/cm³ • Finish: {mat.finish}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-brand-redBright">
                        {formatPrice(mat.pricePerGram)}
                        <span className="text-[10px] text-brand-textDim"> / g</span>
                      </span>
                    </div>
                  </div>

                  {/* Rating mini telemetry bars */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-brand-border/40 text-[9px] font-mono text-brand-textDim">
                    <div>
                      <span>Strength: </span>
                      <span className="text-white font-bold">{mat.strengthRating}/10</span>
                    </div>
                    <div>
                      <span>Flex: </span>
                      <span className="text-white font-bold">{mat.flexibilityRating}/10</span>
                    </div>
                    <div>
                      <span>Heat: </span>
                      <span className="text-white font-bold">{mat.heatResistanceRating}/10</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. Color Swatches */}
      <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-red" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              2. Choose Filament Color
            </h3>
          </div>
          <span className="text-[11px] font-mono text-brand-textDim">
            Selected:{' '}
            <strong className="text-white">
              {selectedMaterial.colors.find((c) => c.id === config.colorId)?.name || 'Default'}
            </strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {selectedMaterial.colors.map((color) => {
            const isSelected = config.colorId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onChange({ colorId: color.id })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-brand-surface border-brand-red text-white shadow-red-glow'
                    : 'bg-brand-surface/60 border-brand-border text-brand-textDim hover:text-white'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Infill Density */}
      <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-red" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              3. Internal Infill Density
            </h3>
          </div>
          <span className="text-[11px] font-mono text-brand-redBright font-bold">
            {config.infillPercentage}% Infill
          </span>
        </div>

        <p className="text-[11px] text-brand-textDim">
          Higher infill increases structural durability and mass. 20% is ideal for most applications.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {infillOptions.map((opt) => {
            const isSelected = config.infillPercentage === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ infillPercentage: opt.value })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-brand-red/15 border-brand-red text-white font-bold'
                    : 'bg-brand-surface border-brand-border text-brand-textMuted hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold">{opt.label}</div>
                <div className="text-[10px] text-brand-textDim truncate">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Layer Height & Supports in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer Height */}
        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              4. Layer Height (Z Resolution)
            </span>
          </div>

          <div className="space-y-1.5">
            {layerOptions.map((opt) => {
              const isSelected = config.layerHeightMm === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ layerHeightMm: opt.value })}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-surface border-brand-red text-white font-bold'
                      : 'bg-brand-surface/40 border-brand-border text-brand-textDim hover:text-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono">{opt.label}</span>
                    <span className="text-[10px] text-brand-textDim block">{opt.tier}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-red" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Supports */}
        <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              5. Support Overhangs
            </span>
          </div>

          <div className="space-y-1.5">
            {supportOptions.map((opt) => {
              const isSelected = config.supportType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ supportType: opt.value })}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-surface border-brand-red text-white font-bold'
                      : 'bg-brand-surface/40 border-brand-border text-brand-textDim hover:text-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono">{opt.label}</span>
                    <span className="text-[10px] text-brand-textDim block">{opt.desc}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-red" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Production Speed / Rush Turnaround Option */}
      <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-surface border border-brand-red/40 text-brand-red">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Express Priority Print Queue (24h Turnaround)</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-brand-red/20 text-brand-red border border-brand-red/30">
                +50%
              </span>
            </div>
            <p className="text-[11px] text-brand-textDim">
              Fast-track slicing and allocate priority print bed slot immediately.
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          checked={config.rushProduction}
          onChange={(e) => onChange({ rushProduction: e.target.checked })}
          className="w-5 h-5 accent-brand-red rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

import React from 'react';
import { ModelConfiguration, STLGeometryData } from '../../types';
import { Lock, Maximize, RotateCcw, Unlock } from 'lucide-react';

interface DimensionControlsProps {
  geometry: STLGeometryData;
  config: ModelConfiguration;
  onChange: (newConfig: Partial<ModelConfiguration>) => void;
  maxPrinterDims?: { x: number; y: number; z: number };
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  geometry,
  config,
  onChange,
  maxPrinterDims = { x: 300, y: 300, z: 400 },
}) => {
  const origX = geometry.originalDimensions?.x || geometry.dimensions.x;
  const origY = geometry.originalDimensions?.y || geometry.dimensions.y;
  const origZ = geometry.originalDimensions?.z || geometry.dimensions.z;

  const currentScale = config.scalePercentage || 100;
  const currentX = Math.round((origX * currentScale) / 100 * 10) / 10;
  const currentY = Math.round((origY * currentScale) / 100 * 10) / 10;
  const currentZ = Math.round((origZ * currentScale) / 100 * 10) / 10;

  const handleScalePreset = (percent: number) => {
    onChange({
      scalePercentage: percent,
      scaleX: Math.round((origX * percent) / 100 * 10) / 10,
      scaleY: Math.round((origY * percent) / 100 * 10) / 10,
      scaleZ: Math.round((origZ * percent) / 100 * 10) / 10,
    });
  };

  const handleAxisChange = (axis: 'x' | 'y' | 'z', newMm: number) => {
    if (newMm <= 0 || isNaN(newMm)) return;

    if (config.lockAspectRatio) {
      let baseOrig = origX;
      if (axis === 'y') baseOrig = origY;
      if (axis === 'z') baseOrig = origZ;

      const newScalePercent = Math.round((newMm / baseOrig) * 100);
      handleScalePreset(Math.max(10, Math.min(500, newScalePercent)));
    } else {
      // Non-proportional
      const newScaleX = axis === 'x' ? newMm : currentX;
      const newScaleY = axis === 'y' ? newMm : currentY;
      const newScaleZ = axis === 'z' ? newMm : currentZ;

      // Approximate avg scale percentage
      const avgScale = Math.round(
        ((newScaleX / origX + newScaleY / origY + newScaleZ / origZ) / 3) * 100
      );

      onChange({
        scalePercentage: avgScale,
        scaleX: newScaleX,
        scaleY: newScaleY,
        scaleZ: newScaleZ,
      });
    }
  };

  const isExceeding =
    currentX > maxPrinterDims.x || currentY > maxPrinterDims.y || currentZ > maxPrinterDims.z;

  return (
    <div className="p-5 rounded-2xl bg-brand-card border border-brand-border space-y-4">
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Maximize className="w-4 h-4 text-brand-red" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Confirm / Scale Dimensions
          </h3>
        </div>

        <button
          type="button"
          onClick={() => handleScalePreset(100)}
          className="text-[11px] font-mono text-brand-textDim hover:text-brand-red flex items-center gap-1 transition-colors"
          title="Reset to original 100% CAD size"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset (100%)</span>
        </button>
      </div>

      {/* XYZ Input Form */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Width (X) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textDim">
            <span className="text-brand-red font-bold">X (Width)</span>
            <span>Orig: {origX.toFixed(0)}mm</span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={currentX}
              onChange={(e) => handleAxisChange('x', parseFloat(e.target.value))}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-red"
            />
            <span className="absolute right-2.5 top-2.5 text-[10px] font-mono text-brand-textDim">
              mm
            </span>
          </div>
        </div>

        {/* Depth (Y) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textDim">
            <span className="text-brand-red font-bold">Y (Depth)</span>
            <span>Orig: {origY.toFixed(0)}mm</span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={currentY}
              onChange={(e) => handleAxisChange('y', parseFloat(e.target.value))}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-red"
            />
            <span className="absolute right-2.5 top-2.5 text-[10px] font-mono text-brand-textDim">
              mm
            </span>
          </div>
        </div>

        {/* Height (Z) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textDim">
            <span className="text-brand-red font-bold">Z (Height)</span>
            <span>Orig: {origZ.toFixed(0)}mm</span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="1"
              value={currentZ}
              onChange={(e) => handleAxisChange('z', parseFloat(e.target.value))}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-red"
            />
            <span className="absolute right-2.5 top-2.5 text-[10px] font-mono text-brand-textDim">
              mm
            </span>
          </div>
        </div>
      </div>

      {/* Lock Aspect Ratio & Scale Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Lock Ratio Switch */}
        <button
          type="button"
          onClick={() => onChange({ lockAspectRatio: !config.lockAspectRatio })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            config.lockAspectRatio
              ? 'bg-brand-red/10 border-brand-red text-brand-red font-bold'
              : 'bg-brand-surface border-brand-border text-brand-textDim hover:text-white'
          }`}
        >
          {config.lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>Lock Aspect Ratio</span>
        </button>

        {/* Scale Presets */}
        <div className="flex items-center gap-1 bg-brand-surface p-1 rounded-lg border border-brand-border">
          {[50, 75, 100, 125, 150, 200].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleScalePreset(pct)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                currentScale === pct
                  ? 'bg-brand-red text-white font-bold'
                  : 'text-brand-textDim hover:text-white'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Max Dimensions Warning */}
      {isExceeding && (
        <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/50 text-[11px] text-amber-200">
          ⚠️ Current scaled dimensions exceed standard build envelope ({maxPrinterDims.x} × {maxPrinterDims.y} × {maxPrinterDims.z} mm).
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  CheckCircle2,
  Layers,
  Plus,
  Save,
  Sliders,
  Sparkles,
  Trash2,
} from 'lucide-react';

export const AdminPrintSettings: React.FC = () => {
  const [infillList, setInfillList] = useState([
    { value: 10, label: '10% Infill', desc: 'Display & Lightweight', enabled: true },
    { value: 20, label: '20% Infill', desc: 'Standard Recommended', enabled: true },
    { value: 30, label: '30% Infill', desc: 'Sturdy Everyday', enabled: true },
    { value: 50, label: '50% Infill', desc: 'Heavy Mechanical', enabled: true },
    { value: 75, label: '75% Infill', desc: 'High Stress Load', enabled: true },
    { value: 100, label: '100% Solid', desc: 'Solid Block Extrusion', enabled: true },
  ]);

  const [layerHeights, setLayerHeights] = useState([
    { height: 0.12, name: 'Ultra Fine (0.12 mm)', tier: 'Miniatures & crisp detail', enabled: true },
    { height: 0.16, name: 'High Detail (0.16 mm)', tier: 'Smooth curves', enabled: true },
    { height: 0.20, name: 'Standard (0.20 mm)', tier: 'Optimal balance', enabled: true },
    { height: 0.28, name: 'Draft Fast (0.28 mm)', tier: 'Rapid prototyping', enabled: true },
  ]);

  const [qualityTiers, setQualityTiers] = useState([
    { code: 'DRAFT', name: 'Draft Speed', speed: '1.35x Speed', enabled: true },
    { code: 'STANDARD', name: 'Standard Quality', speed: '1.0x Speed', enabled: true },
    { code: 'HIGH_DETAIL', name: 'High Precision', speed: '0.72x Speed', enabled: true },
    { code: 'ULTRA', name: 'Ultra Detail', speed: '0.48x Speed', enabled: true },
  ]);

  const [savedMessage, setSavedMessage] = useState(false);

  const toggleInfill = (val: number) => {
    setInfillList((prev) =>
      prev.map((i) => (i.value === val ? { ...i, enabled: !i.enabled } : i))
    );
  };

  const toggleLayer = (h: number) => {
    setLayerHeights((prev) =>
      prev.map((l) => (l.height === h ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Slicer Parameters
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Customer Print Settings Controls
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Toggle which infill presets, layer heights, and quality tiers are presented on the customer quotation configurator.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Active Parameters</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Print settings rules updated successfully!</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Infill Presets */}
        <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Layers className="w-4 h-4 text-brand-red" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              1. Infill Density Presets
            </h3>
          </div>

          <div className="space-y-2.5">
            {infillList.map((inf) => (
              <div
                key={inf.value}
                className="p-3.5 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-white font-bold">{inf.label}</div>
                  <div className="text-[10px] text-brand-textDim">{inf.desc}</div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleInfill(inf.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    inf.enabled
                      ? 'bg-brand-red text-white'
                      : 'bg-brand-card border border-brand-border text-brand-textDim'
                  }`}
                >
                  {inf.enabled ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Layer Height Presets */}
        <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <Sliders className="w-4 h-4 text-brand-red" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              2. Layer Height (Z Resolution)
            </h3>
          </div>

          <div className="space-y-2.5">
            {layerHeights.map((lay) => (
              <div
                key={lay.height}
                className="p-3.5 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="text-white font-bold">{lay.name}</div>
                  <div className="text-[10px] text-brand-textDim">{lay.tier}</div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleLayer(lay.height)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    lay.enabled
                      ? 'bg-brand-red text-white'
                      : 'bg-brand-card border border-brand-border text-brand-textDim'
                  }`}
                >
                  {lay.enabled ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

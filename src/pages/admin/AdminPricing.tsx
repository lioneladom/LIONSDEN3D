import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PricingConfig } from '../../types';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Calculator,
  Check,
  CheckCircle2,
  DollarSign,
  Layers,
  Percent,
  RefreshCw,
  Save,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';

export const AdminPricing: React.FC = () => {
  const {
    pricingConfig,
    updatePricingConfig,
    materials,
    updateMaterial,
    formatPrice,
  } = useApp();

  // Local form states
  const [configForm, setConfigForm] = useState<PricingConfig>({ ...pricingConfig });
  const [materialRates, setMaterialRates] = useState<Record<string, number>>(() => {
    const rates: Record<string, number> = {};
    materials.forEach((m) => {
      rates[m.id] = m.pricePerGram;
    });
    return rates;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Simulation test calculator state
  const [simWeightGrams, setSimWeightGrams] = useState(84);
  const [simPrintHours, setSimPrintHours] = useState(4.5);
  const [simMaterialId, setSimMaterialId] = useState('pla');
  const [simRush, setSimRush] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update global pricing config
    updatePricingConfig(configForm);

    // 2. Update each material's pricePerGram
    materials.forEach((m) => {
      if (materialRates[m.id] !== undefined) {
        updateMaterial({
          ...m,
          pricePerGram: materialRates[m.id],
        });
      }
    });

    setSavedSuccess(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#E10600', '#FFFFFF'],
    });

    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Calculate sandbox simulation price with currently entered rates
  const currentSimMatRate = materialRates[simMaterialId] || 0.5;
  const simMatCost = simWeightGrams * currentSimMatRate;
  const simMachineCost = simPrintHours * configForm.machineHourlyRateGHS;
  const simSetup = configForm.setupFeeGHS;
  let simBase = simMatCost + simMachineCost + simSetup;
  if (configForm.globalMarkupPercent > 0) {
    simBase *= 1 + configForm.globalMarkupPercent / 100;
  }
  const simRushFee = simRush ? simBase * (configForm.rushMultiplier - 1) : 0;
  let simTotal = simBase + simRushFee;
  const simMinApplied = simTotal < configForm.minimumOrderGHS;
  if (simMinApplied) simTotal = configForm.minimumOrderGHS;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Real-Time Engine Rules
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Pricing Configuration Engine
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Modifications applied here immediately update the customer-facing STL live quotation formulas.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save & Sync Quotation Engine</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Pricing rules synchronized successfully! All customer STL quotations now reflect these new rates.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editable Rates Form */}
        <form onSubmit={handleSaveAll} className="lg:col-span-8 space-y-6">
          {/* 1. Material Extrusion Rates Per Gram */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <Layers className="w-4 h-4 text-brand-red" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                1. Thermopolymer Rates Per Gram (GHS / g)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((mat) => (
                <div key={mat.id} className="p-3.5 rounded-xl bg-brand-surface border border-brand-border space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{mat.name}</span>
                    <span className="text-[10px] font-mono text-brand-textDim">{mat.density} g/cm³</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-brand-red font-bold">
                      GHS
                    </span>
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      value={materialRates[mat.id] || mat.pricePerGram}
                      onChange={(e) =>
                        setMaterialRates({
                          ...materialRates,
                          [mat.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-brand-card border border-brand-border rounded-lg pl-12 pr-4 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Machine Runtime & Platform Fees */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <DollarSign className="w-4 h-4 text-brand-red" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                2. Operational & Platform Surcharges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">
                  Setup & Bed Leveling Fee (GHS)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={configForm.setupFeeGHS}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, setupFeeGHS: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">
                  Printer Hourly Machine Rate (GHS / hr)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={configForm.machineHourlyRateGHS}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      machineHourlyRateGHS: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">
                  Support Material Surcharge (GHS / g)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={configForm.supportFeePerGramGHS}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      supportFeePerGramGHS: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">
                  Minimum Order Price Clamp (GHS)
                </label>
                <input
                  type="number"
                  step="1"
                  value={configForm.minimumOrderGHS}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      minimumOrderGHS: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Rates & Express Rush Multipliers */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <Truck className="w-4 h-4 text-brand-red" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                3. Fulfillment & Priority Turnaround
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">Accra Courier (GHS)</label>
                <input
                  type="number"
                  value={configForm.deliveryAccraGHS}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      deliveryAccraGHS: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-3 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">Kumasi Dispatch (GHS)</label>
                <input
                  type="number"
                  value={configForm.deliveryKumasiGHS}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      deliveryKumasiGHS: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-3 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-brand-textMuted font-mono">Rush Multiplier (e.g. 1.5x)</label>
                <input
                  type="number"
                  step="0.1"
                  value={configForm.rushMultiplier}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      rushMultiplier: parseFloat(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-3 py-2 font-mono font-bold text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Live Quotation Sandbox Simulator */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-brand-surface border border-brand-red/40 space-y-5 shadow-red-glow">
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-brand-red" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Live Quotation Sandbox
                </h3>
              </div>
              <span className="text-[10px] font-mono text-brand-red">Real-Time Simulation</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-brand-textDim">Select Material:</span>
                <select
                  value={simMaterialId}
                  onChange={(e) => setSimMaterialId(e.target.value)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-1.5 text-white"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (GHS {materialRates[m.id] || m.pricePerGram}/g)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-brand-textDim">Model Print Weight (g):</span>
                <input
                  type="number"
                  value={simWeightGrams}
                  onChange={(e) => setSimWeightGrams(parseFloat(e.target.value) || 0)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-brand-textDim">Estimated Print Time (Hours):</span>
                <input
                  type="number"
                  step="0.5"
                  value={simPrintHours}
                  onChange={(e) => setSimPrintHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-1.5 text-white font-bold"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-brand-textDim">24h Priority Rush:</span>
                <input
                  type="checkbox"
                  checked={simRush}
                  onChange={(e) => setSimRush(e.target.checked)}
                  className="w-4 h-4 accent-brand-red cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Simulation Output */}
            <div className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-brand-textDim">
                <span>Material:</span>
                <span className="text-white">{formatPrice(simMatCost)}</span>
              </div>
              <div className="flex justify-between text-brand-textDim">
                <span>Machine:</span>
                <span className="text-white">{formatPrice(simMachineCost)}</span>
              </div>
              <div className="flex justify-between text-brand-textDim">
                <span>Setup Fee:</span>
                <span className="text-white">{formatPrice(simSetup)}</span>
              </div>
              {simRush && (
                <div className="flex justify-between text-brand-redBright">
                  <span>Rush Surcharge:</span>
                  <span>{formatPrice(simRushFee)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-brand-border flex items-baseline justify-between">
                <span className="text-brand-textMuted uppercase font-bold">Simulated Price:</span>
                <span className="text-2xl font-bold font-mono text-brand-redBright">
                  {formatPrice(simTotal)}
                </span>
              </div>
              {simMinApplied && (
                <div className="text-[10px] text-amber-400">
                  (Minimum order clamp of GHS {configForm.minimumOrderGHS} applied)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

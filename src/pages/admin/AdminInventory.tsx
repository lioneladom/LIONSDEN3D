import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  Scale,
  Warehouse,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminInventory: React.FC = () => {
  const { inventory, restockFilament, formatPrice } = useApp();
  const [selectedRestockItem, setSelectedRestockItem] = useState<InventoryItem | null>(null);
  const [gramsToAdd, setGramsToAdd] = useState(1000); // 1kg standard spool

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestockItem) return;

    restockFilament(selectedRestockItem.id, gramsToAdd);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#E10600', '#FFFFFF'],
    });
    setSelectedRestockItem(null);
  };

  const totalFilamentKg = (
    inventory.reduce((sum, item) => sum + item.quantityGrams, 0) / 1000
  ).toFixed(2);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Material Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Filament & Spool Inventory
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Track real-time filament stock levels in grams, receive low-stock alerts, and restock spools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-xs font-mono">
            <span className="text-brand-textDim">Total In Stock: </span>
            <span className="text-white font-bold">{totalFilamentKg} kg</span>
          </div>
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => {
          const isLow = item.status === 'LOW_STOCK';
          const isCritical = item.status === 'CRITICAL';
          const kgRemaining = (item.quantityGrams / 1000).toFixed(2);

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-brand-card border transition-all space-y-4 shadow-xl flex flex-col justify-between ${
                isCritical
                  ? 'border-brand-red/80 shadow-red-glow'
                  : isLow
                  ? 'border-amber-500/60'
                  : 'border-brand-border'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {item.materialName} {item.colorName}
                      </h3>
                      <span className="text-[10px] font-mono text-brand-textDim">
                        Low Threshold: {item.lowStockThresholdGrams}g
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      isCritical
                        ? 'bg-red-950/60 text-red-400 border border-red-800 animate-pulse'
                        : isLow
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Stock Level Bar */}
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-textDim">Quantity Remaining:</span>
                    <span className="text-white font-bold">{item.quantityGrams} g ({kgRemaining} kg)</span>
                  </div>
                  <div className="w-full bg-brand-surface rounded-full h-2 overflow-hidden border border-brand-border">
                    <div
                      className={`h-full rounded-full ${
                        isCritical ? 'bg-brand-red' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.quantityGrams / 5000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] font-mono text-brand-textDim flex justify-between pt-1">
                  <span>Standard Spool Cost:</span>
                  <span className="text-white">{formatPrice(item.spoolCostGHS)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRestockItem(item)}
                className="w-full py-2.5 rounded-xl bg-brand-surface hover:bg-brand-red text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Restock Filament Spool</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {selectedRestockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedRestockItem(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
          />

          <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-slide-up space-y-6">
            <button
              onClick={() => setSelectedRestockItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-brand-card text-brand-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-brand-red font-bold">
                Restock Spool
              </span>
              <h3 className="text-lg font-bold text-white">
                {selectedRestockItem.materialName} ({selectedRestockItem.colorName})
              </h3>
            </div>

            <form onSubmit={handleRestock} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-brand-textDim block font-sans">Grams to Add to Inventory</label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2500].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGramsToAdd(g)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        gramsToAdd === g
                          ? 'bg-brand-red text-white'
                          : 'bg-brand-card border-brand-border text-brand-textDim'
                      }`}
                    >
                      +{g} g ({g / 1000} kg)
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-brand-textDim block font-sans">Custom Quantity (Grams)</label>
                <input
                  type="number"
                  step="100"
                  value={gramsToAdd}
                  onChange={(e) => setGramsToAdd(parseInt(e.target.value) || 0)}
                  className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white font-bold text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRestockItem(null)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-brand-textDim hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold uppercase tracking-wider shadow-red-glow"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

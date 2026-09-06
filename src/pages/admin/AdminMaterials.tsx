import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Material } from '../../types';
import {
  Check,
  Cpu,
  Layers,
  Palette,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

export const AdminMaterials: React.FC = () => {
  const { materials, updateMaterial, addMaterial, deleteMaterial, formatPrice } = useApp();
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#E10600');

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    if (isCreating) {
      addMaterial(editingMaterial);
    } else {
      updateMaterial(editingMaterial);
    }
    setEditingMaterial(null);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    const newMat: Material = {
      id: `mat-${Date.now()}`,
      name: 'Nylon PA12 (Engineering Grade)',
      code: 'PA12',
      description: 'Ultra high-tensile industrial polyamide with extreme abrasion resistance and thermal tolerance.',
      density: 1.15,
      pricePerGram: 1.40,
      strengthRating: 9,
      flexibilityRating: 5,
      heatResistanceRating: 9,
      detailRating: 8,
      finish: 'Matte',
      recommendedFor: ['Gears & Bushings', 'End-Use Robotics', 'High Wear Parts'],
      active: true,
      colors: [
        { id: 'c-nylon-black', name: 'Charcoal Black', hex: '#1C1917', available: true },
        { id: 'c-nylon-white', name: 'Natural White', hex: '#F5F5F4', available: true },
      ],
    };
    setEditingMaterial(newMat);
    setIsCreating(true);
  };

  const handleAddColor = () => {
    if (!editingMaterial || !newColorName) return;
    const newColor = {
      id: `c-${Date.now()}`,
      name: newColorName,
      hex: newColorHex,
      available: true,
    };
    setEditingMaterial({
      ...editingMaterial,
      colors: [...editingMaterial.colors, newColor],
    });
    setNewColorName('');
  };

  const handleRemoveColor = (colorId: string) => {
    if (!editingMaterial) return;
    setEditingMaterial({
      ...editingMaterial,
      colors: editingMaterial.colors.filter((c) => c.id !== colorId),
    });
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Raw Material Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Materials & Color Swatches
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Configure thermopolymer densities, prices per gram, and associated filament spools available to customers.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-brand-red">
                    {mat.code}
                  </span>
                  <h3 className="text-base font-bold text-white">{mat.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateMaterial({
                        ...mat,
                        active: !mat.active,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                      mat.active
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                        : 'bg-brand-surface text-brand-textDim border border-brand-border'
                    }`}
                  >
                    {mat.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-brand-textDim line-clamp-2 leading-relaxed font-sans">
                {mat.description}
              </p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-brand-surface border border-brand-border text-xs font-mono">
                <div>
                  <span className="text-[10px] text-brand-textDim block">Rate:</span>
                  <span className="font-bold text-brand-redBright">
                    {formatPrice(mat.pricePerGram)} / g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-textDim block">Density:</span>
                  <span className="font-bold text-white">{mat.density} g/cm³</span>
                </div>
              </div>

              {/* Swatches */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-brand-textDim">
                  Colors ({mat.colors.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mat.colors.map((c) => (
                    <span
                      key={c.id}
                      title={c.name}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingMaterial({ ...mat });
                  setIsCreating(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-cardHover border border-brand-border text-white text-xs font-mono"
              >
                Edit Parameters
              </button>

              <button
                onClick={() => deleteMaterial(mat.id)}
                className="p-1.5 text-brand-textDim hover:text-brand-red transition-colors"
                title="Delete Material"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Material Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setEditingMaterial(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
          />

          <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-slide-up space-y-6 my-8">
            <button
              onClick={() => setEditingMaterial(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-brand-card text-brand-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
              {isCreating ? 'Create Engineering Material' : `Edit ${editingMaterial.name}`}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Material Name</label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.name}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, name: e.target.value })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Material Code</label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.code}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, code: e.target.value })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">
                    Density (g/cm³) (e.g. PLA=1.24)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingMaterial.density}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        density: parseFloat(e.target.value) || 1.2,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">
                    Price Per Gram (GHS / g)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={editingMaterial.pricePerGram}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        pricePerGram: parseFloat(e.target.value) || 0.5,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-brand-textMuted block font-sans">Material Description</label>
                <textarea
                  rows={3}
                  value={editingMaterial.description}
                  onChange={(e) =>
                    setEditingMaterial({ ...editingMaterial, description: e.target.value })
                  }
                  className="w-full bg-brand-card border border-brand-border rounded-xl p-3 text-white font-sans"
                />
              </div>

              {/* Color Swatch Manager */}
              <div className="space-y-3 pt-2 border-t border-brand-border">
                <span className="font-bold text-white uppercase block">Color Swatches</span>
                <div className="flex flex-wrap gap-2">
                  {editingMaterial.colors.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-xs"
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span className="text-white">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(c.id)}
                        className="text-brand-textDim hover:text-brand-red ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Color Sub-form */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-brand-card border border-brand-border p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New color name (e.g. Cobalt Blue)"
                    className="flex-1 bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-white font-sans text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 rounded-xl bg-brand-surface hover:bg-brand-card border border-brand-border text-white text-xs font-bold"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-5 py-2.5 rounded-xl bg-brand-card text-brand-textMuted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold uppercase tracking-wider shadow-red-glow"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

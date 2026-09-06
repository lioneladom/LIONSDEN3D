import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES } from '../../data/mockData';
import {
  Check,
  Edit,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  X,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, formatPrice } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreating) {
      addProduct(editingProduct);
    } else {
      updateProduct(editingProduct);
    }
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: 'Geometric Cyber Tabletop Planter',
      slug: 'geometric-cyber-tabletop-planter',
      description: 'Futuristic faceted desktop succulent pot with hidden drainage tray and magnetic base.',
      category: 'desk',
      price: 55.0,
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      ],
      rating: 5.0,
      reviewCount: 4,
      inStock: true,
      stockCount: 15,
      dimensions: '85 × 85 × 75 mm',
      material: 'PETG / PLA',
      estimatedPrintTime: '3h 40m',
      featured: false,
    };
    setEditingProduct(newProd);
    setIsCreating(true);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Catalog Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Marketplace Store Products
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Manage pre-designed 3D products, unit pricing, inventory quantities, and category placements.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Store Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-brand-red text-white">
                  {p.category}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-brand-card/90 border border-brand-border text-white">
                  Stock: {p.stockCount}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{p.name}</h3>
                <p className="text-xs text-brand-textDim line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-brand-surface border border-brand-border text-xs font-mono">
                <div>
                  <span className="text-[10px] text-brand-textDim block">Retail Price:</span>
                  <span className="font-bold text-brand-redBright">{formatPrice(p.price)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-textDim block">Print Time:</span>
                  <span className="text-white">{p.estimatedPrintTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-brand-border flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingProduct({ ...p });
                  setIsCreating(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-cardHover border border-brand-border text-white text-xs font-mono"
              >
                Edit Product
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="p-1.5 text-brand-textDim hover:text-brand-red transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
          />

          <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-slide-up space-y-6 my-8">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-brand-card text-brand-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
              {isCreating ? 'Create Marketplace Product' : `Edit ${editingProduct.name}`}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-brand-textMuted block font-sans">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white font-sans text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white"
                  >
                    {PRODUCT_CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Retail Price (GHS)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Available Stock Count</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockCount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-brand-textMuted block font-sans">Dimensions (e.g. 95 × 80 × 22 mm)</label>
                  <input
                    type="text"
                    value={editingProduct.dimensions}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                    }
                    className="w-full bg-brand-card border border-brand-border rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-brand-textMuted block font-sans">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-brand-card border border-brand-border rounded-xl p-3 text-white font-sans"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-brand-textDim hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold uppercase tracking-wider shadow-red-glow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

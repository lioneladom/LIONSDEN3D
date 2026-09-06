import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Product3DViewer } from '../components/3d/Product3DViewer';
import {
  ArrowRight,
  Box,
  Eye,
  ShoppingCart,
  Sparkles,
  X,
  Sliders,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Flame,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShopProductItem extends Product {
  modelKey?: string;
  badgeText?: string;
}

export const ShopPage: React.FC = () => {
  const { addToCart, setActivePage, formatPrice } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewModalProduct, setPreviewModalProduct] = useState<ShopProductItem | null>(null);
  const [specsModalProduct, setSpecsModalProduct] = useState<ShopProductItem | null>(null);

  // Lock body scroll and listen for Escape key when any modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewModalProduct(null);
        setSpecsModalProduct(null);
      }
    };
    if (previewModalProduct || specsModalProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewModalProduct, specsModalProduct]);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'models', label: 'Cool STL Files' },
    { id: 'materials', label: 'Filaments' },
    { id: 'hardware', label: 'Hardware' },
  ];

  const shopProducts: ShopProductItem[] = [
    {
      id: 'prod-sig-lion',
      name: 'Signature Lion Emblem',
      slug: 'signature-lion-emblem',
      description: 'Faceted geometric lion sculpture optimized for high-detail desktop resin and FDM 3D printing.',
      category: 'models',
      price: 45.00,
      images: ['/images/signature-lion.jpg'],
      modelKey: 'lion-emblem',
      badgeText: 'BEST SELLER',
      rating: 5.0,
      reviewCount: 42,
      inStock: true,
      stockCount: 15,
      dimensions: '95 × 80 × 22 mm',
      material: 'SLA Resin / PLA',
      estimatedPrintTime: '3h 45m',
      featured: true,
    },
    {
      id: 'prod-planetary-gear',
      name: 'Planetary Gear Mechanism',
      slug: 'planetary-gear-mechanism',
      description: 'Print-in-place functional dual-helical gear assembly with ultra-smooth rotation and zero backlash.',
      category: 'models',
      price: 24.00,
      images: ['/images/planetary-gear.jpg'],
      modelKey: 'helical-gear',
      badgeText: 'FUNCTIONAL',
      rating: 4.9,
      reviewCount: 28,
      inStock: true,
      stockCount: 20,
      dimensions: '75 × 75 × 35 mm',
      material: 'Industrial PETG',
      estimatedPrintTime: '4h 10m',
      featured: true,
    },
    {
      id: 'prod-skyline-tower',
      name: 'Skyline Series: I Architectural Tower',
      slug: 'skyline-series-i',
      description: 'Parametric spiral skyscraper model featuring intricate cantilevered terraces and fine structural columns.',
      category: 'models',
      price: 89.00,
      images: ['/images/skyline-tower.jpg'],
      modelKey: 'headphone-stand',
      badgeText: 'ARCHITECTURAL',
      rating: 4.8,
      reviewCount: 19,
      inStock: true,
      stockCount: 8,
      dimensions: '120 × 110 × 240 mm',
      material: 'White Matte PLA',
      estimatedPrintTime: '11h 20m',
      featured: false,
    },
    {
      id: 'prod-sample-lattice',
      name: 'Material Sample Lattice Block',
      slug: 'material-sample-lattice',
      description: 'Calibrated gyroid micro-lattice test specimen designed to benchmark retraction, bridging, and tensile elasticity.',
      category: 'models',
      price: 15.00,
      images: ['/images/sample-lattice.jpg'],
      modelKey: 'drone-arm',
      rating: 4.9,
      reviewCount: 34,
      inStock: true,
      stockCount: 50,
      dimensions: '40 × 40 × 40 mm',
      material: 'Calibrated Test Matrix',
      estimatedPrintTime: '1h 30m',
      featured: false,
    },
    {
      id: 'prod-pro-carbon-spool',
      name: 'Pro Carbon PLA – 1kg',
      slug: 'pro-carbon-pla-1kg',
      description: 'High-modulus polymer matrix reinforced with 15% chopped aerospace carbon fiber strands. Matte stealth finish.',
      category: 'materials',
      price: 38.99,
      images: ['/images/pro-carbon-spool.jpg'],
      badgeText: 'PREMIUM FILAMENT',
      rating: 5.0,
      reviewCount: 65,
      inStock: true,
      stockCount: 35,
      dimensions: '1.75mm • 1000g',
      material: 'Carbon Fiber PLA',
      estimatedPrintTime: 'Ready to ship',
      featured: true,
    },
    {
      id: 'prod-nozzle-pack',
      name: 'Hardened Steel Nozzle Pack (3-Pack)',
      slug: 'hardened-steel-nozzle-pack',
      description: 'Wear-resistant M6 extruder nozzles (0.4mm, 0.6mm, 0.8mm) engineered for abrasive carbon fiber and glow filaments.',
      category: 'hardware',
      price: 29.99,
      images: ['/images/nozzle-pack.jpg'],
      badgeText: 'HARDWARE',
      rating: 4.9,
      reviewCount: 22,
      inStock: true,
      stockCount: 18,
      dimensions: '0.4 / 0.6 / 0.8 mm',
      material: 'Hardened Tool Steel',
      estimatedPrintTime: 'Ready to ship',
      featured: false,
    },
    {
      id: 'prod-guardian-dragon',
      name: 'Low-Poly Guardian Dragon',
      slug: 'low-poly-guardian-dragon',
      description: 'Faceted tabletop creature figurine with sharp edge geometry that accentuates ambient studio rim reflections.',
      category: 'models',
      price: 35.00,
      images: ['/images/resin-bust.jpg'],
      modelKey: 'lowpoly-dragon',
      badgeText: 'POPULAR STL',
      rating: 4.9,
      reviewCount: 51,
      inStock: true,
      stockCount: 12,
      dimensions: '110 × 85 × 95 mm',
      material: 'Silk PLA / Resin',
      estimatedPrintTime: '6h 15m',
      featured: true,
    },
    {
      id: 'prod-flex-handle',
      name: 'Flex-Tech Impact Grip Handle',
      slug: 'flex-tech-grip',
      description: 'Ergonomic vibration-dampening tactile grip with internal compliant shock-absorption ribs.',
      category: 'models',
      price: 18.00,
      images: ['/images/flex-rubber.jpg'],
      modelKey: 'drone-arm',
      rating: 4.8,
      reviewCount: 16,
      inStock: true,
      stockCount: 25,
      dimensions: '115 × 32 × 32 mm',
      material: 'TPU 95A Flexible',
      estimatedPrintTime: '2h 45m',
      featured: false,
    },
  ];

  const filteredProducts = shopProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleQuickAdd = (product: ShopProductItem) => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#E10600', '#FF2B20', '#FFFFFF'],
    });

    addToCart({
      id: `cart-prod-${product.id}-${Date.now()}`,
      type: 'PRODUCT',
      title: product.name,
      subtitle: `${product.material} • Ready to ship`,
      product: product,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
      addedAt: new Date().toISOString(),
    });
  };

  const [bulkEmail, setBulkEmail] = useState('');
  const [bulkSent, setBulkSent] = useState(false);

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-12 animate-slide-up text-white">
      {/* Header & Category Pills matching Mockup 3 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Precision Shop
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
            Curated 3D printable STL files, precision mechanical assemblies, and production-grade filaments.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (4 columns) with Dual Action Buttons (Preview 3D + Add to Cart) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-[#121212] border border-[#1E1E1E] hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1 duration-300"
          >
            <div className="space-y-3">
              {/* Product Image with Hover Zoom */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-neutral-900">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.badgeText && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-brand-red text-white uppercase tracking-wider shadow">
                    {p.badgeText}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <h3 className="text-sm font-bold text-white group-hover:text-brand-red transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <span className="text-sm font-bold text-brand-red font-mono shrink-0">
                  ${p.price.toFixed(2)}
                </span>
              </div>

              {/* Specs & Material */}
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                <span className="truncate">{p.material}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            {/* Dual Action Buttons: Preview 3D & Add to Cart */}
            <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-[#1C1C1C]">
              {p.modelKey ? (
                <button
                  type="button"
                  onClick={() => setPreviewModalProduct(p)}
                  className="py-2.5 px-2 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#282828] hover:border-neutral-600 text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  title="Inspect STL in 3D"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-red" />
                  <span>Preview 3D</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSpecsModalProduct(p)}
                  className="py-2.5 px-2 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#282828] hover:border-neutral-600 text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  title="View Technical Specifications"
                >
                  <Sliders className="w-3.5 h-3.5 text-brand-red" />
                  <span>Specs</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleQuickAdd(p)}
                className="py-2.5 px-2 rounded-xl bg-neutral-900 hover:bg-brand-red border border-neutral-800 hover:border-brand-red text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3D STL Interactive Preview Modal (Portaled to document.body to ensure exact dead-center positioning in viewport) */}
      {previewModalProduct &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            {/* Backdrop click to dismiss */}
            <div
              onClick={() => setPreviewModalProduct(null)}
              className="absolute inset-0 cursor-pointer"
            />

            <div className="relative w-full max-w-2xl rounded-3xl bg-[#121212] border border-[#262626] overflow-hidden shadow-2xl space-y-4 z-10 animate-slide-up">
              {/* Modal Header */}
              <div className="p-5 border-b border-[#1E1E1E] flex items-center justify-between bg-[#151515]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold block">
                      3D STL INTERACTIVE INSPECTOR
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {previewModalProduct.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewModalProduct(null)}
                  className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3D Model Canvas */}
              <div className="px-5">
                <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#0A0A0A] relative">
                  {previewModalProduct.modelKey && (
                    <Product3DViewer
                      modelKey={previewModalProduct.modelKey}
                      colorHex="#E10600"
                      height="320px"
                      interactive={true}
                      autoRotate={true}
                    />
                  )}
                  <span className="absolute bottom-3 left-3 text-[11px] font-mono text-neutral-400 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                    Drag to rotate • Scroll to zoom
                  </span>
                </div>
              </div>

              {/* Modal Specs & Actions */}
              <div className="p-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-neutral-400 font-mono text-left w-full sm:w-auto">
                  <div>Dimensions: <strong className="text-white">{previewModalProduct.dimensions}</strong></div>
                  <div>Material: <strong className="text-white">{previewModalProduct.material}</strong></div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      handleQuickAdd(previewModalProduct);
                      setPreviewModalProduct(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-[#b00500] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-red/20"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Order (${previewModalProduct.price.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Hardware & Product Technical Specs Modal (Portaled to document.body, dead-center in viewport) */}
      {specsModalProduct &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            {/* Backdrop click to dismiss */}
            <div
              onClick={() => setSpecsModalProduct(null)}
              className="absolute inset-0 cursor-pointer"
            />

            <div className="relative w-full max-w-2xl bg-[#121212] border border-[#262626] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-slide-up">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#222] flex items-center justify-between shrink-0 bg-[#151515]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold block">
                      {specsModalProduct.category === 'hardware'
                        ? 'HARDWARE TECHNICAL SPECIFICATIONS'
                        : 'TECHNICAL SPECIFICATIONS'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {specsModalProduct.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSpecsModalProduct(null)}
                  className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-neutral-400 hover:text-white transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Product Overview Card */}
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#181818] border border-neutral-800">
                  <img
                    src={specsModalProduct.images[0]}
                    alt={specsModalProduct.name}
                    className="w-24 h-24 rounded-xl object-cover bg-black shrink-0 border border-neutral-700"
                  />
                  <div className="space-y-1.5 text-left flex-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-red/20 text-brand-red border border-brand-red/30 uppercase">
                        {specsModalProduct.badgeText || specsModalProduct.category.toUpperCase()}
                      </span>
                      <span className="text-base font-bold text-brand-redBright font-mono">
                        ${specsModalProduct.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {specsModalProduct.description}
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-1">
                      ✓ In Stock ({specsModalProduct.stockCount} available) • Ready for immediate dispatch
                    </div>
                  </div>
                </div>

                {/* Detailed Technical Specs Matrix */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    Engineering & Compatibility Data
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                    {specsModalProduct.id === 'prod-nozzle-pack' ? (
                      <>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Thread Standard</span>
                          <span className="text-white font-semibold">M6 × 1.0 mm Pitch</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Material Core</span>
                          <span className="text-white font-semibold">Hardened Tool Steel</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Hardness Rating</span>
                          <span className="text-white font-semibold">Rockwell 60 HRC</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Max Temperature</span>
                          <span className="text-brand-redBright font-semibold">500°C Continuous</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Included Orifices</span>
                          <span className="text-white font-semibold">0.4mm, 0.6mm, 0.8mm</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Abrasive Rating</span>
                          <span className="text-white font-semibold">Carbon / Glass / Glow / Metal</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-neutral-500 uppercase block">Melt Zone Polish</span>
                          <span className="text-white font-semibold">
                            Ra &lt; 0.4 µm mirror finish chamber to prevent filament drag & clogs
                          </span>
                        </div>
                      </>
                    ) : specsModalProduct.id === 'prod-pro-carbon-spool' ? (
                      <>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Filament Diameter</span>
                          <span className="text-white font-semibold">1.75 mm (±0.02 mm)</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Net Spool Weight</span>
                          <span className="text-white font-semibold">1000g (1.0 kg)</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Polymer Matrix</span>
                          <span className="text-white font-semibold">PLA + 15% Carbon Fiber</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Nozzle Temp</span>
                          <span className="text-brand-redBright font-semibold">215°C – 235°C</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Bed Temperature</span>
                          <span className="text-white font-semibold">50°C – 65°C</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Tensile Modulus</span>
                          <span className="text-white font-semibold">5,200 MPa (High Rigidity)</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1 sm:col-span-2">
                          <span className="text-[10px] text-neutral-500 uppercase block">Recommended Tooling</span>
                          <span className="text-white font-semibold">
                            Hardened steel or ruby nozzle recommended to resist abrasive carbon fiber wear
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Physical Dimensions</span>
                          <span className="text-white font-semibold">{specsModalProduct.dimensions}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Material Grade</span>
                          <span className="text-white font-semibold">{specsModalProduct.material}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Estimated Print Time</span>
                          <span className="text-white font-semibold">{specsModalProduct.estimatedPrintTime}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 space-y-1">
                          <span className="text-[10px] text-neutral-500 uppercase block">Infill Recommendation</span>
                          <span className="text-white font-semibold">20% – 40% Gyroid</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-[#222] bg-[#151515] flex items-center justify-between gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setSpecsModalProduct(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1F1F1F] hover:bg-[#2A2A2A] text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleQuickAdd(specsModalProduct);
                    setSpecsModalProduct(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-[#b00500] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-red/30 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Order (${specsModalProduct.price.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Custom Bulk Orders Card matching Mockup 3 */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#121212] border border-[#1E1E1E] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-left w-full md:w-auto">
          <h2 className="text-xl font-bold text-white">
            Custom Bulk Orders?
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg">
            For industrial manufacturing and batches over 100 units, get in touch for corporate pricing.
          </p>
        </div>

        {bulkSent ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-semibold">
            <span>✓ Inquiry received! Our engineers will contact you shortly.</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (bulkEmail) setBulkSent(true);
            }}
            className="flex items-center gap-3 w-full md:w-auto"
          >
            <input
              type="email"
              required
              value={bulkEmail}
              onChange={(e) => setBulkEmail(e.target.value)}
              placeholder="Enter your work email"
              className="px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red w-full sm:w-64 transition-colors font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-brand-red hover:bg-[#b00500] text-xs font-bold text-white whitespace-nowrap transition-colors shadow-red-glow"
            >
              Get Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

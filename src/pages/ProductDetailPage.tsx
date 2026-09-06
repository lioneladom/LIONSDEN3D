import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { STLViewer3D } from '../components/3d/STLViewer3D';
import { ProceduralModelService } from '../services/3d/proceduralModels';
import { STLParserService } from '../services/3d/stlParser';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Minus,
  Move3d,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Wrench,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    materials,
    addToCart,
    formatPrice,
    loadModelIntoConfigurator,
    setActivePage,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedMaterialId, setSelectedMaterialId] = useState(
    product.material.toLowerCase().includes('petg')
      ? 'petg'
      : product.material.toLowerCase().includes('abs')
      ? 'abs'
      : product.material.toLowerCase().includes('tpu')
      ? 'tpu'
      : 'pla'
  );

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const [selectedColorId, setSelectedColorId] = useState(selectedMaterial.colors[0]?.id);

  // Generate real 3D geometry for this product
  const product3DData = useMemo(() => {
    const key = product.sampleModelKey || 'lion-emblem';
    try {
      const geom = ProceduralModelService.generateGeometry(key);
      const buffer = ProceduralModelService.geometryToBinarySTL(geom);
      const { geometry, data } = STLParserService.parse(buffer);
      return { geometry, data, buffer };
    } catch (e) {
      return null;
    }
  }, [product.sampleModelKey]);

  const previewConfig = {
    modelId: product.id,
    materialId: selectedMaterialId,
    colorId: selectedColorId,
    infillPercentage: 20,
    layerHeightMm: 0.2,
    supportType: 'AUTO' as const,
    qualityTier: 'STANDARD' as const,
    scalePercentage: 100,
    scaleX: 100,
    scaleY: 100,
    scaleZ: 100,
    lockAspectRatio: true,
    quantity,
    rushProduction: false,
  };

  const handleAddToCart = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E10600', '#FF2B20', '#FFFFFF'],
    });

    const chosenColor = selectedMaterial.colors.find((c) => c.id === selectedColorId);

    addToCart({
      id: `cart-prod-${Date.now()}`,
      type: 'PRODUCT',
      title: product.name,
      subtitle: `${selectedMaterial.name} • ${chosenColor?.name || 'Standard Color'}`,
      product,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      addedAt: new Date().toISOString(),
    });
  };

  const handleCustomizeInStudio = () => {
    if (!product3DData) return;
    const stlModel = {
      id: `model-${product.id}`,
      filename: `${product.slug}.stl`,
      fileSize: product3DData.buffer.byteLength,
      fileBuffer: product3DData.buffer,
      geometry: product3DData.data,
      createdAt: new Date().toISOString(),
    };
    loadModelIntoConfigurator(stlModel, {
      materialId: selectedMaterialId,
      colorId: selectedColorId,
    });
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-10 animate-slide-up">
      {/* Back to Shop link */}
      <button
        type="button"
        onClick={() => setActivePage('shop')}
        className="flex items-center gap-2 text-xs font-mono text-brand-textDim hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 3D Marketplace</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Real Interactive 3D Model Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-brand-red font-bold uppercase flex items-center gap-1.5">
                <Move3d className="w-4 h-4" />
                <span>Interactive 3D CAD Preview</span>
              </span>
              <span className="text-[11px] font-mono text-brand-textDim">
                Click & Drag to Rotate 360°
              </span>
            </div>

            {product3DData && (
              <STLViewer3D
                geometry={product3DData.geometry}
                geometryData={product3DData.data}
                config={previewConfig}
                material={selectedMaterial}
                height="500px"
                interactive={true}
                showControls={true}
              />
            )}
          </div>
        </div>

        {/* Right Column: Information & Options */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-red">
                {product.category}
              </span>
              <span className="text-brand-border">•</span>
              <div className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified 3D Print File</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-baseline justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-textDim block">
                Item Price
              </span>
              <span className="text-3xl font-extrabold font-mono text-brand-redBright">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              ✓ Ready for 3D Print Dispatch
            </span>
          </div>

          {/* Material Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase font-bold text-white block">
              Material Selection
            </label>
            <div className="grid grid-cols-2 gap-2">
              {materials.filter((m) => m.active).slice(0, 4).map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => {
                    setSelectedMaterialId(mat.id);
                    setSelectedColorId(mat.colors[0]?.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedMaterialId === mat.id
                      ? 'bg-brand-red/10 border-brand-red text-white font-bold shadow-red-glow'
                      : 'bg-brand-card border-brand-border text-brand-textDim hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{mat.name.split(' ')[0]}</div>
                  <div className="text-[10px] font-mono text-brand-textDim">{mat.finish}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase font-bold text-white block">
              Color Finish
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedMaterial.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                    selectedColorId === color.id
                      ? 'bg-brand-surface border-brand-red text-white font-bold'
                      : 'bg-brand-card border-brand-border text-brand-textDim hover:text-white'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-brand-border rounded-xl bg-brand-card p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-brand-textMuted hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-mono font-bold text-white min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-brand-textMuted hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-red-glow transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>
            </div>

            {product3DData && (
              <button
                type="button"
                onClick={handleCustomizeInStudio}
                className="w-full py-3 rounded-xl bg-brand-card hover:bg-brand-surface border border-brand-border text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Cpu className="w-4 h-4 text-brand-red" />
                <span>Customize Dimensions & Infill in 3D Studio</span>
              </button>
            )}
          </div>

          {/* Specifications */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-2 text-xs font-mono">
            <div className="text-[11px] font-bold uppercase text-white pb-1 border-b border-brand-border">
              Print Specifications
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Dimensions:</span>
              <span className="text-white">{product.dimensions}</span>
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Standard Material:</span>
              <span className="text-white">{product.material}</span>
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Estimated Production:</span>
              <span className="text-white">{product.estimatedPrintTime}</span>
            </div>
            <div className="flex justify-between text-brand-textMuted">
              <span>Quality Inspection:</span>
              <span className="text-emerald-400">Guaranteed ±0.05 mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

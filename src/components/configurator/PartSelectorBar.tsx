import React, { useRef, useState } from 'react';
import { STLModel } from '../../types';
import { STLParserService } from '../../services/3d/stlParser';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCode,
  Layers,
  Loader2,
  Plus,
  Scale,
  Trash2,
} from 'lucide-react';

interface PartSelectorBarProps {
  models: STLModel[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onAddFiles: (newModels: STLModel[]) => void;
  onRemoveIndex: (index: number) => void;
  partWeights?: number[];
  totalWeightGrams?: number;
}

export const PartSelectorBar: React.FC<PartSelectorBarProps> = ({
  models,
  activeIndex,
  onSelectIndex,
  onAddFiles,
  onRemoveIndex,
  partWeights = [],
  totalWeightGrams = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingNewPart, setIsProcessingNewPart] = useState(false);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).filter((f) =>
      f.name.toLowerCase().endsWith('.stl')
    );
    if (files.length === 0) return;

    setIsProcessingNewPart(true);
    const addedModels: STLModel[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

        addedModels.push({
          id: `model-${Date.now()}-${i}`,
          filename: file.name,
          fileSize: file.size,
          fileBuffer: buffer,
          geometry: data,
          createdAt: new Date().toISOString(),
        });
      }

      onAddFiles(addedModels);
    } catch (err) {
      console.error('Failed to parse added STL file:', err);
    } finally {
      setIsProcessingNewPart(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      onSelectIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < models.length - 1) {
      onSelectIndex(activeIndex + 1);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-brand-card border border-brand-border shadow-xl space-y-3.5">
      {/* Hidden File Input for Adding Another Part */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Top Header & Flip Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-red/15 border border-brand-red/40 flex items-center justify-center text-brand-red">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
                Your Parts
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-brand-surface border border-brand-border text-brand-redBright">
                {models.length} {models.length === 1 ? 'Part' : 'Parts'}
              </span>
            </div>
            {models.length > 1 && totalWeightGrams > 0 && (
              <span className="text-[10px] font-sans text-brand-textDim">
                Total weight: ~{totalWeightGrams}g
              </span>
            )}
          </div>
        </div>

        {/* Flip Controls & Add Part Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Flip / Arrow Buttons */}
          <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-xl p-1 text-xs font-mono">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeIndex === 0
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/80 hover:text-white hover:bg-brand-card'
              }`}
              title="Previous Part Preview"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Prev</span>
            </button>

            <span className="px-2 text-xs font-bold text-brand-red font-mono">
              {activeIndex + 1} / {models.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === models.length - 1}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeIndex === models.length - 1
                  ? 'text-white/20 cursor-not-allowed'
                  : 'text-white/80 hover:text-white hover:bg-brand-card'
              }`}
              title="Next Part Preview"
            >
              <span className="hidden md:inline text-[11px]">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Add Another STL Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingNewPart}
            className="px-3 py-2 rounded-xl bg-brand-surface hover:bg-brand-cardHover border border-brand-red/40 hover:border-brand-red text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md group"
            title="Upload another STL part into this assembly"
          >
            {isProcessingNewPart ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-red" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-brand-red group-hover:scale-110 transition-transform" />
            )}
            <span className="text-white">Add Another STL</span>
          </button>
        </div>
      </div>

      {/* Part Previews Carousel / Tabs Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1 overflow-x-auto">
        {models.map((model, idx) => {
          const isActive = idx === activeIndex;
          const dims = model.geometry?.dimensions || { x: 0, y: 0, z: 0 };
          const weight = partWeights[idx] || Math.round(model.geometry?.volumeCm3 * 1.24 * 0.45) || 0;

          return (
            <div
              key={model.id || idx}
              onClick={() => onSelectIndex(idx)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                isActive
                  ? 'bg-brand-surface border-brand-red shadow-red-glow scale-[1.01]'
                  : 'bg-brand-surface/60 hover:bg-brand-surface border-brand-border hover:border-brand-borderLight opacity-85 hover:opacity-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                    <span className="text-[10px] font-mono font-bold uppercase text-brand-red">
                      Part {idx + 1}
                    </span>
                  </div>

                  {/* Remove Part (only if more than 1 part) */}
                  {models.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveIndex(idx);
                      }}
                      className="p-1 rounded text-brand-textDim hover:text-brand-red hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove this part"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold text-white truncate" title={model.filename}>
                  {model.filename}
                </div>
              </div>

              {/* Dimensions & Weight badge */}
              <div className="mt-2 pt-2 border-t border-brand-border/40 flex items-center justify-between text-[10px] font-mono text-brand-textDim">
                <span>
                  {dims.x.toFixed(0)}×{dims.y.toFixed(0)}×{dims.z.toFixed(0)} mm
                </span>
                {weight > 0 && <span className="text-white/80">~{weight}g</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

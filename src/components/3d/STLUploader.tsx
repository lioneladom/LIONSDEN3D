import React, { useRef, useState } from 'react';
import { STLModel } from '../../types';
import { STLParserService } from '../../services/3d/stlParser';
import {
  ProceduralModelService,
  SAMPLE_ASSEMBLIES,
  SAMPLE_MODELS,
  SampleAssemblyMeta,
  SampleModelMeta,
} from '../../services/3d/proceduralModels';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileCheck,
  FileUp,
  Layers,
  Loader2,
  PackageCheck,
  Plus,
  ShieldAlert,
  Sparkles,
  Upload,
} from 'lucide-react';

interface STLUploaderProps {
  onModelLoaded?: (model: STLModel, customSampleKey?: string) => void;
  onModelsLoaded?: (models: STLModel[]) => void;
}

export const STLUploader: React.FC<STLUploaderProps> = ({
  onModelLoaded,
  onModelsLoaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState('');
  const [processProgress, setProcessProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processMultipleFiles = async (files: File[]) => {
    const stlFiles = files.filter((f) => f.name.toLowerCase().endsWith('.stl'));
    if (stlFiles.length === 0) {
      setErrorMessage('Please upload valid .STL 3D model files.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessProgress({ current: 0, total: stlFiles.length });

    const parsedModels: STLModel[] = [];

    try {
      for (let i = 0; i < stlFiles.length; i++) {
        const file = stlFiles[i];
        setProcessProgress({ current: i + 1, total: stlFiles.length });
        setProcessStage(`Analyzing part ${i + 1} of ${stlFiles.length}: ${file.name}...`);

        if (file.size > 80 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds maximum upload limit of 80MB.`);
        }

        const buffer = await file.arrayBuffer();
        const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

        const model: STLModel = {
          id: `model-${Date.now()}-${i}`,
          filename: file.name,
          fileSize: file.size,
          fileBuffer: buffer,
          geometry: data,
          createdAt: new Date().toISOString(),
        };

        parsedModels.push(model);
      }

      if (onModelsLoaded) {
        onModelsLoaded(parsedModels);
      } else if (onModelLoaded && parsedModels.length > 0) {
        onModelLoaded(parsedModels[0]);
      }
    } catch (err: any) {
      console.error('Failed to parse STL:', err);
      setErrorMessage(
        err.message || 'We couldn’t process one or more 3D models. Please verify that the STL files are valid.'
      );
    } finally {
      setIsProcessing(false);
      setProcessStage('');
    }
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;
    processMultipleFiles(filesArray);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSampleSelect = (sample: SampleModelMeta) => {
    setIsProcessing(true);
    setProcessStage(`Loading ${sample.name}...`);

    setTimeout(() => {
      const geom = ProceduralModelService.generateGeometry(sample.key);
      const buffer = ProceduralModelService.geometryToBinarySTL(geom);
      const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

      const model: STLModel = {
        id: `model-${Date.now()}`,
        filename: `${sample.key}.stl`,
        fileSize: buffer.byteLength,
        fileBuffer: buffer,
        geometry: data,
        createdAt: new Date().toISOString(),
      };

      if (onModelsLoaded) {
        onModelsLoaded([model]);
      } else if (onModelLoaded) {
        onModelLoaded(model, sample.key);
      }
      setIsProcessing(false);
    }, 100);
  };

  const handleAssemblySelect = (assembly: SampleAssemblyMeta) => {
    setIsProcessing(true);
    setProcessStage(`Loading ${assembly.name} (${assembly.parts.length} parts)...`);

    setTimeout(() => {
      const models: STLModel[] = assembly.parts.map((p, idx) => {
        const geom = ProceduralModelService.generateGeometry(p.key);
        const buffer = ProceduralModelService.geometryToBinarySTL(geom);
        const { data } = STLParserService.parse(buffer, { x: 300, y: 300, z: 400 }, true);

        return {
          id: `model-${Date.now()}-${idx}`,
          filename: p.filename,
          fileSize: buffer.byteLength,
          fileBuffer: buffer,
          geometry: data,
          createdAt: new Date().toISOString(),
        };
      });

      if (onModelsLoaded) {
        onModelsLoaded(models);
      } else if (onModelLoaded && models.length > 0) {
        onModelLoaded(models[0]);
      }
      setIsProcessing(false);
    }, 120);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Drag & Drop Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 shadow-xl ${
          isDragging
            ? 'border-brand-red bg-brand-red/10 scale-[1.01]'
            : 'border-white/15 hover:border-brand-red/60 bg-brand-card hover:bg-brand-cardHover'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".stl"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="relative z-10 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center text-brand-red shadow-lg transition-transform group-hover:scale-105">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              {isProcessing
                ? processStage
                : 'Upload One or Multiple .STL 3D Files'}
            </h3>
            <p className="text-xs text-brand-textDim">
              {isProcessing
                ? `Processed ${processProgress.current} of ${processProgress.total} file(s)`
                : 'Drag and drop single parts or full multi-part assemblies here, or click to browse.'}
            </p>
          </div>

          {!isProcessing && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-xs font-mono text-brand-textMuted">
                <FileCheck className="w-3.5 h-3.5 text-brand-red" />
                <span>Multi-STL Support</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-xs font-mono text-brand-textMuted">
                <Boxes className="w-3.5 h-3.5 text-brand-red" />
                <span>Assembly Part Slicing</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="w-full bg-brand-surface rounded-full h-1.5 overflow-hidden border border-brand-border">
              <div
                className="h-full bg-brand-red rounded-full transition-all duration-300"
                style={{
                  width: processProgress.total > 0
                    ? `${(processProgress.current / processProgress.total) * 100}%`
                    : '50%',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-3 animate-slide-up">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Preset Multi-Part Assemblies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Try A Multi-Part Assembly:
            </span>
          </div>
          <span className="text-xs text-brand-textDim hidden sm:inline font-mono">
            Multi-STL print jobs with flip previews
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SAMPLE_ASSEMBLIES.map((assembly) => (
            <button
              key={assembly.key}
              type="button"
              onClick={() => handleAssemblySelect(assembly)}
              disabled={isProcessing}
              className="p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-red/60 text-left transition-all group relative shadow-md flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-brand-red">
                    {assembly.parts.length} Parts Assembly
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brand-surface text-brand-textMuted border border-white/10">
                    Multi-STL
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-brand-red transition-colors line-clamp-1">
                  {assembly.name}
                </h4>
                <p className="text-[11px] text-brand-textDim line-clamp-2">
                  {assembly.description}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-[10px] font-mono text-brand-textMuted">
                <span>{assembly.parts.map((p) => p.name.split(':')[0]).join(' + ')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-red group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Curated Single Sample Models */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Or Try A Single 3D Model:
            </span>
          </div>
          <span className="text-xs text-brand-textDim hidden sm:inline">
            Click to load instantly in 3D
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SAMPLE_MODELS.slice(0, 4).map((sample) => (
            <button
              key={sample.key}
              type="button"
              onClick={() => handleSampleSelect(sample)}
              disabled={isProcessing}
              className="p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-red/60 text-left transition-all group relative shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 pr-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-brand-red">
                    {sample.category}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-red transition-colors line-clamp-1">
                    {sample.name}
                  </h4>
                  <div className="text-[10px] font-mono text-brand-textDim pt-1">
                    {sample.defaultDims.x} × {sample.defaultDims.y} × {sample.defaultDims.z} mm
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-textDim group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

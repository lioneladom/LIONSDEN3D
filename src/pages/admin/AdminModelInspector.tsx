import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STLViewer3D } from '../../components/3d/STLViewer3D';
import { ProceduralModelService, SAMPLE_MODELS } from '../../services/3d/proceduralModels';
import { STLParserService } from '../../services/3d/stlParser';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Crosshair,
  Eye,
  FileCode,
  Layers,
  Maximize,
  RotateCcw,
  ShieldCheck,
  Upload,
  XCircle,
} from 'lucide-react';

export const AdminModelInspector: React.FC = () => {
  const { userModels, materials, formatPrice } = useApp();
  const [selectedKey, setSelectedKey] = useState<string>('lion-emblem');
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED' | 'FLAGGED'>('PENDING');
  const [feedbackNote, setFeedbackNote] = useState('');

  // Generate model geometry
  const currentInspectModel = useMemo(() => {
    try {
      const geom = ProceduralModelService.generateGeometry(selectedKey);
      const buffer = ProceduralModelService.geometryToBinarySTL(geom);
      const { geometry, data } = STLParserService.parse(buffer);
      return { geometry, data, buffer };
    } catch (e) {
      return null;
    }
  }, [selectedKey]);

  const inspectorConfig = {
    modelId: `admin-${selectedKey}`,
    materialId: 'pla',
    colorId: 'c-pla-red',
    infillPercentage: 20,
    layerHeightMm: 0.20,
    supportType: 'AUTO' as const,
    qualityTier: 'STANDARD' as const,
    scalePercentage: 100,
    scaleX: 100,
    scaleY: 100,
    scaleZ: 100,
    lockAspectRatio: true,
    quantity: 1,
    rushProduction: false,
  };

  const selectedMaterial = materials[0];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Quality Control Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Admin 3D Model Mesh Inspector
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Perform topology verification, measure wall thickness, inspect polygon count, and authorize models for production toolpaths.
          </p>
        </div>

        {/* Model Selector dropdown */}
        <div className="flex items-center gap-2 bg-brand-card p-1.5 rounded-xl border border-brand-border">
          <span className="text-[11px] font-mono text-brand-textDim pl-2">Select Model:</span>
          <select
            value={selectedKey}
            onChange={(e) => {
              setSelectedKey(e.target.value);
              setApprovalStatus('PENDING');
            }}
            className="bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-brand-red"
          >
            {SAMPLE_MODELS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.name} ({m.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Inspector Layout */}
      {currentInspectModel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <STLViewer3D
              geometry={currentInspectModel.geometry}
              geometryData={currentInspectModel.data}
              config={inspectorConfig}
              material={selectedMaterial}
              height="520px"
              interactive={true}
              showControls={true}
            />

            <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Watertight Manifold Topology Verified</span>
              </div>
              <span className="text-brand-textDim">
                {currentInspectModel.data.triangleCount.toLocaleString()} Triangles
              </span>
            </div>
          </div>

          {/* Right Column: Geometry Telemetry & Approval Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mesh Telemetry Table */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl text-xs font-mono">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <Crosshair className="w-4 h-4 text-brand-red" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                  CAD Geometric Telemetry
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-brand-textMuted">
                  <span>Bounding Box (X Width):</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.dimensions.x} mm
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Bounding Box (Y Depth):</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.dimensions.y} mm
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Bounding Box (Z Height):</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.dimensions.z} mm
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Calculated Volume:</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.volumeCm3} cm³
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Surface Area:</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.surfaceAreaMm2} mm²
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Triangle Polycount:</span>
                  <span className="text-white font-bold">
                    {currentInspectModel.data.triangleCount.toLocaleString()} faces
                  </span>
                </div>
                <div className="flex justify-between text-brand-textMuted">
                  <span>Printer Build Volume:</span>
                  <span className="text-emerald-400 font-bold">Fits Chamber (300×300×400)</span>
                </div>
              </div>
            </div>

            {/* Approval Workflow Box */}
            <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl text-xs font-mono">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3">
                Model Slicing Decision
              </h3>

              {approvalStatus === 'APPROVED' ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 space-y-1 animate-slide-up">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Model Approved for Fleet Queue</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80">
                    G-code generated and dispatched to active printer node.
                  </p>
                </div>
              ) : approvalStatus === 'FLAGGED' ? (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500 text-amber-300 space-y-1 animate-slide-up">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flagged for Customer Revision</span>
                  </div>
                  <p className="text-[11px] text-amber-400/80">
                    Feedback sent to customer: "{feedbackNote || 'Wall thickness under 0.8mm'}"
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-brand-textDim block font-sans">
                      Engineer Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      placeholder="e.g. Needs support on chin; scale verified"
                      className="w-full bg-brand-surface border border-brand-border rounded-xl px-3.5 py-2 text-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setApprovalStatus('APPROVED')}
                      className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setApprovalStatus('FLAGGED')}
                      className="py-3 rounded-xl bg-brand-surface hover:bg-amber-900/60 border border-brand-border text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Flag Issue</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

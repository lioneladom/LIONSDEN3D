import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, UploadCloud } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 animate-fade-in text-white">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
          FROM DIGITAL CONCEPT <br />
          <span className="text-brand-red">TO PHYSICAL REALITY.</span>
        </h1>
        <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
          Learn how our automated additive manufacturing pipeline translates your 3D CAD files into flight-ready and industrial parts in under 24 hours.
        </p>
      </div>

      {/* Step Cards */}
      <div className="space-y-12">
        {/* Step 01 */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-8 sm:p-12 hover:border-[#2a2a2a] transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black font-mono text-[#333]">01</span>
                <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase font-bold text-brand-red bg-brand-red/10 rounded-full border border-brand-red/20">
                  STEP 01
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Upload CAD File
              </h2>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                Drop your STL, OBJ, or STEP file into our secure web viewer. Our automated geometry engine instantly analyzes wall thickness, bounding box dimensions, and manifold integrity.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Instant manifold & watertight mesh analysis
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Automated bounding volume & mass calculation
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Client-side 256-bit encryption & 30-day NDA wipe
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
              <img
                src="/images/step1-laptop.jpg"
                alt="Upload CAD model"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Step 02 (reversed) */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-8 sm:p-12 hover:border-[#2a2a2a] transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
              <img
                src="/images/step2-tablet.jpg"
                alt="Configure print parameters"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black font-mono text-[#333]">02</span>
                <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase font-bold text-brand-red bg-brand-red/10 rounded-full border border-brand-red/20">
                  STEP 02
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Configure Parameters
              </h2>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                Select your production-grade polymer, layer height resolution, infill density, and surface treatment. Our quotation system recalculates your pricing and lead time in real-time.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  20+ calibrated production filaments and resins
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Layer height resolutions down to 25 microns
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Instant dynamic price calculation & lead times
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 03 */}
        <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-8 sm:p-12 hover:border-[#2a2a2a] transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black font-mono text-[#333]">03</span>
                <span className="px-3 py-1 text-xs font-mono tracking-widest uppercase font-bold text-brand-red bg-brand-red/10 rounded-full border border-brand-red/20">
                  STEP 03
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Automated Production
              </h2>
              <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
                Your file is automatically sliced and dispatched to our state-of-the-art print farm. We print, post-cure, perform optical quality inspection, and dispatch directly to your doorstep.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Precision calibrated industrial 3D printers
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Rigorous optical and dimensional QC inspection
                </li>
                <li className="flex items-center gap-3 text-sm text-[#ccc]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  Fast express courier shipping with live telemetry
                </li>
              </ul>
            </div>
            <div className="lg:col-span-5 h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
              <img
                src="/images/step3-printers.jpg"
                alt="Automated production print farm"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#171717] via-[#141414] to-[#171717] border border-[#222] p-8 sm:p-14 text-center space-y-6">
        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Ready to bring your design to life?
        </h3>
        <p className="text-brand-textMuted text-sm sm:text-base max-w-xl mx-auto">
          Upload your 3D CAD file now and get an instant production quote in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActivePage('configurator')}
            className="px-8 py-3.5 rounded-full bg-brand-red hover:bg-[#b00500] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-brand-red/20 flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Upload STL File
          </button>
          <button
            onClick={() => setActivePage('materials')}
            className="px-8 py-3.5 rounded-full bg-[#1e1e1e] hover:bg-[#282828] text-white font-medium text-sm transition-all border border-[#333]"
          >
            Explore Materials
          </button>
        </div>
      </div>
    </div>
  );
};

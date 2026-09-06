import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export const MaterialsCatalogPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in text-white">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
          ENGINEERED <span className="text-brand-red">MATERIALS.</span>
        </h1>
        <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
          Explore our production-grade polymers and photopolymers calibrated for extreme durability, cosmetic perfection, and industrial end-use.
        </p>
      </div>

      {/* FDM Industrial Polymers Section */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          FDM Industrial Polymers
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carbon Fiber PLA */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/40 transition-all group">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-brand-red border border-brand-red/30">
                    HIGH STRENGTH
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-[#888]">
                    MATTE FINISH
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Carbon Fiber PLA</h3>
                <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                  High-rigidity composite reinforced with premium chopped carbon fiber strands. Exceptional dimensional stability and matte textured finish.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222]">
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Tensile Strength</span>
                    <span className="text-sm font-bold text-white font-mono">52 MPa</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Heat Deflection</span>
                    <span className="text-sm font-bold text-white font-mono">75°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Impact Res.</span>
                    <span className="text-sm font-bold text-white font-mono">4.8 kJ/m²</span>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-5 h-44 sm:h-full min-h-[160px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
                <img
                  src="/images/carbon-fiber.jpg"
                  alt="Carbon Fiber PLA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
              <span className="text-xs text-brand-textMuted font-mono">Starting at <strong className="text-brand-red">$0.14</strong> / gram</span>
              <button
                onClick={() => setActivePage('configurator')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-red transition-colors"
              >
                Configure with CF-PLA <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Industrial PETG */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/40 transition-all group">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-brand-red border border-brand-red/30">
                    WATER RESISTANT
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-[#888]">
                    CHEMICAL RESISTANT
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Industrial PETG</h3>
                <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                  High-impact, water-resistant copolymer ideal for functional prototypes, snap-fit components, and outdoor enclosures with superior layer adhesion.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222]">
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Tensile Strength</span>
                    <span className="text-sm font-bold text-white font-mono">48 MPa</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Heat Deflection</span>
                    <span className="text-sm font-bold text-white font-mono">80°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Impact Res.</span>
                    <span className="text-sm font-bold text-white font-mono">7.2 kJ/m²</span>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-5 h-44 sm:h-full min-h-[160px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
                <img
                  src="/images/industrial-petg.jpg"
                  alt="Industrial PETG"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
              <span className="text-xs text-brand-textMuted font-mono">Starting at <strong className="text-brand-red">$0.10</strong> / gram</span>
              <button
                onClick={() => setActivePage('configurator')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-red transition-colors"
              >
                Configure with PETG <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Precision Resins Section */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          SLA Precision Resins
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 8K Ultra-Detail Resin */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/40 transition-all group">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-brand-red border border-brand-red/30">
                    0.025MM LAYERS
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-[#888]">
                    SMOOTH FINISH
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">8K Ultra-Detail Resin</h3>
                <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                  High-resolution photopolymer yielding razor-sharp surface details, ultra-smooth layer lines, and microscopic feature fidelity.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222]">
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Tensile Strength</span>
                    <span className="text-sm font-bold text-white font-mono">65 MPa</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Heat Deflection</span>
                    <span className="text-sm font-bold text-white font-mono">60°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Shore Hardness</span>
                    <span className="text-sm font-bold text-white font-mono">85D</span>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-5 h-44 sm:h-full min-h-[160px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
                <img
                  src="/images/resin-bust.jpg"
                  alt="8K Ultra-Detail Resin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
              <span className="text-xs text-brand-textMuted font-mono">Starting at <strong className="text-brand-red">$0.25</strong> / gram</span>
              <button
                onClick={() => setActivePage('configurator')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-red transition-colors"
              >
                Configure with Resin <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Flex-Tech Rubber */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-brand-red/40 transition-all group">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-brand-red border border-brand-red/30">
                    HIGH FLEXIBILITY
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded bg-[#1c1c1c] text-[#888]">
                    SHOCK ABSORBING
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Flex-Tech Rubber</h3>
                <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                  Elastomeric resin with high rebound elasticity, tear resistance, and elongation for tactile grips, seals, and flexible impact dampeners.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222]">
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Tensile Strength</span>
                    <span className="text-sm font-bold text-white font-mono">22 MPa</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Heat Deflection</span>
                    <span className="text-sm font-bold text-white font-mono">45°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Shore Hardness</span>
                    <span className="text-sm font-bold text-white font-mono">70A</span>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-5 h-44 sm:h-full min-h-[160px] rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#222]">
                <img
                  src="/images/flex-rubber.jpg"
                  alt="Flex-Tech Rubber"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1E1E1E] flex items-center justify-between">
              <span className="text-xs text-brand-textMuted font-mono">Starting at <strong className="text-brand-red">$0.32</strong> / gram</span>
              <button
                onClick={() => setActivePage('configurator')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-red transition-colors"
              >
                Configure with Rubber <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Comparison Table */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Technical Comparison
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-[#1E1E1E] bg-[#121212]">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#222] bg-[#171717] text-[#888] font-mono uppercase text-[11px] tracking-wider">
                <th className="py-4 px-6">Material</th>
                <th className="py-4 px-6">Technology</th>
                <th className="py-4 px-6">Max Tensile Strength</th>
                <th className="py-4 px-6">Heat Resistance</th>
                <th className="py-4 px-6">Surface Finish</th>
                <th className="py-4 px-6">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              <tr className="hover:bg-[#161616] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Carbon Fiber PLA</td>
                <td className="py-4 px-6 font-mono text-brand-red">FDM</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">52 MPa</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">75°C</td>
                <td className="py-4 px-6 text-[#aaa]">Textured Matte</td>
                <td className="py-4 px-6 text-white font-medium">Structural & Rigidity</td>
              </tr>
              <tr className="hover:bg-[#161616] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Industrial PETG</td>
                <td className="py-4 px-6 font-mono text-brand-red">FDM</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">48 MPa</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">80°C</td>
                <td className="py-4 px-6 text-[#aaa]">Glossy / Translucent</td>
                <td className="py-4 px-6 text-white font-medium">Enclosures & Waterproof</td>
              </tr>
              <tr className="hover:bg-[#161616] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">8K Ultra-Detail Resin</td>
                <td className="py-4 px-6 font-mono text-brand-red">SLA</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">65 MPa</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">60°C</td>
                <td className="py-4 px-6 text-[#aaa]">Mirror Smooth</td>
                <td className="py-4 px-6 text-white font-medium">Miniatures & Dental</td>
              </tr>
              <tr className="hover:bg-[#161616] transition-colors">
                <td className="py-4 px-6 font-semibold text-white">Flex-Tech Rubber</td>
                <td className="py-4 px-6 font-mono text-brand-red">SLA</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">22 MPa</td>
                <td className="py-4 px-6 font-mono text-[#aaa]">45°C</td>
                <td className="py-4 px-6 text-[#aaa]">Soft Touch</td>
                <td className="py-4 px-6 text-white font-medium">Grips & Gaskets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

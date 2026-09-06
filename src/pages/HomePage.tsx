import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, UploadCloud, ShoppingBag, Sparkles, Box } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActivePage } = useApp();
  const [pullingCard, setPullingCard] = React.useState<'configurator' | 'shop' | null>(null);

  const handlePullNavigate = (dest: 'configurator' | 'shop') => {
    if (pullingCard) return;
    setPullingCard(dest);
    // Noticeably slower tactile pull anticipation so the user clearly sees the button pull out
    setTimeout(() => {
      setActivePage(dest, 'pull-out');
    }, 420);
  };

  return (
    <div className="space-y-24 pb-20 text-white">
      {/* 1. HERO SECTION (Lions shifted up, flanked by Huge Left/Right Pull Gateways at natural eye level) */}
      <section className="relative pt-6 sm:pt-10 pb-4 overflow-hidden text-center">
        {/* Ambient Dark Red Atmospheric Glow in the center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-brand-red/10 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 space-y-6">
          {/* Top Headline & Description */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white uppercase leading-[1.05]">
              BRING YOUR <br />
              <span className="text-brand-red">3D IDEAS</span> TO LIFE.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Upload your STL file, configure your print, get an instant quote, and let Lion's Den 3D handle the rest. Professional quality, delivered fast.
            </p>
          </div>

          {/* Central Hero Stage: Left Huge Button, Centered Elevated Lions, Right Huge Button */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* Left Huge Pull Gateway: Configurator / Upload */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div
                onClick={() => handlePullNavigate('configurator')}
                className={`group p-6 sm:p-7 rounded-3xl bg-[#121212]/90 hover:bg-[#181818] border transition-all duration-500 cursor-pointer text-left space-y-4 relative overflow-hidden ${
                  pullingCard === 'configurator'
                    ? 'scale-[1.06] -translate-x-5 border-brand-red shadow-[0_0_50px_rgba(225,6,0,0.5)] ring-4 ring-brand-red/60 bg-[#1c1c1c]'
                    : 'border-[#222] hover:border-brand-red/70 shadow-xl hover:shadow-brand-red/15 hover:-translate-y-1'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red transition-transform duration-500 ${pullingCard === 'configurator' ? 'scale-125' : 'group-hover:scale-110'}`}>
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-brand-red font-bold block">
                    CUSTOM PRINTING
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-brand-red transition-colors">
                    Upload Your STL
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Automated mesh analysis, 20+ calibrated production materials, and instant live pricing.
                  </p>
                </div>
                {/* Pull Transition Action */}
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                  <span className={`transition-transform duration-500 flex items-center gap-1.5 ${pullingCard === 'configurator' ? '-translate-x-4 text-brand-red' : 'group-hover:-translate-x-1.5'}`}>
                    <ArrowLeft className="w-4 h-4 text-brand-red" />
                    <span>{pullingCard === 'configurator' ? 'Pulling Out...' : 'Start Instant Print'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Center: 3 3D Lions (Shifted up to natural eye level) */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative flex items-end justify-center min-h-[300px] sm:min-h-[380px] -mt-2 sm:-mt-6">
              {/* Floor Shadow & Glow */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-14 bg-black/95 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-red/15 rounded-full blur-[100px] pointer-events-none" />

              {/* Left Lion: Stealth Black */}
              <div className="w-[30%] sm:w-[32%] -mr-[4%] relative z-10 hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/den-lion-black.png"
                  alt="Stealth Black 3D Lion Sculpture"
                  className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] select-none pointer-events-none"
                />
              </div>

              {/* Center Lion: Vivid Crimson Red (Faceted Geometric Sculpture - Elevated) */}
              <div className="w-[44%] sm:w-[46%] relative z-20 hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/den-lion-red.png"
                  alt="Crimson Red 3D Lion Sculpture"
                  className="w-full h-auto drop-shadow-[0_25px_45px_rgba(225,6,0,0.28)] select-none pointer-events-none"
                />
              </div>

              {/* Right Lion: Deep Ruby / Charcoal */}
              <div className="w-[30%] sm:w-[32%] -ml-[4%] relative z-10 hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/den-lion-ruby.png"
                  alt="Ruby Charcoal 3D Lion Sculpture"
                  className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Right Huge Pull Gateway: Shop */}
            <div className="lg:col-span-3 order-3">
              <div
                onClick={() => handlePullNavigate('shop')}
                className={`group p-6 sm:p-7 rounded-3xl bg-[#121212]/90 hover:bg-[#181818] border transition-all duration-500 cursor-pointer text-left space-y-4 relative overflow-hidden ${
                  pullingCard === 'shop'
                    ? 'scale-[1.06] translate-x-5 border-brand-red shadow-[0_0_50px_rgba(225,6,0,0.5)] ring-4 ring-brand-red/60 bg-[#1c1c1c]'
                    : 'border-[#222] hover:border-brand-red/70 shadow-xl hover:shadow-brand-red/15 hover:-translate-y-1'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white transition-all duration-500 ${pullingCard === 'shop' ? 'scale-125 text-brand-red border-brand-red/60' : 'group-hover:border-brand-red/40 group-hover:text-brand-red group-hover:scale-110'}`}>
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold block">
                    PRECISION MARKETPLACE
                  </span>
                  <h3 className="text-xl font-black text-white group-hover:text-brand-red transition-colors">
                    Explore the Shop
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Curated collection of 3D printable STL files, mechanical assemblies & premium filaments.
                  </p>
                </div>
                {/* Pull Transition Action */}
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                  <span className={`transition-transform duration-500 flex items-center gap-1.5 ${pullingCard === 'shop' ? 'translate-x-4 text-brand-red' : 'group-hover:translate-x-1.5'}`}>
                    <span>{pullingCard === 'shop' ? 'Pulling Out...' : 'Browse Catalog'}</span>
                    <ArrowRight className="w-4 h-4 text-brand-red" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATION STATS BAR */}
      <section className="border-y border-neutral-900 bg-black/40 py-8">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-neutral-900">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                20+
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                MATERIALS
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                0.05mm
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                ACCURACY
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                24h
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                TURNAROUND
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                100%
              </div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                QC INSPECTED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MATERIALS matching Mockup 1 */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Materials
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Engineered for strength, finish, and speed.
            </p>
          </div>
          <button
            onClick={() => setActivePage('materials', 'pull-out')}
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Carbon Fiber PLA */}
          <div
            onClick={() => setActivePage('configurator', 'pull-out')}
            className="rounded-2xl overflow-hidden bg-[#121212] border border-[#1E1E1E] hover:border-neutral-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-black">
              <img
                src="/images/carbon-fiber.jpg"
                alt="Carbon Fiber PLA"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1.5 text-left">
              <h3 className="text-base font-bold text-white group-hover:text-brand-red transition-colors">
                Carbon Fiber PLA
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Extreme rigidity, matte finish.
              </p>
            </div>
          </div>

          {/* Card 2: High-Detail Resin */}
          <div
            onClick={() => setActivePage('configurator', 'pull-out')}
            className="rounded-2xl overflow-hidden bg-[#121212] border border-[#1E1E1E] hover:border-neutral-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-black">
              <img
                src="/images/resin-sculpt.jpg"
                alt="High-Detail Resin"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1.5 text-left">
              <h3 className="text-base font-bold text-white group-hover:text-brand-red transition-colors">
                High-Detail Resin
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Glass-smooth, ultra-fine layers.
              </p>
            </div>
          </div>

          {/* Card 3: PETG */}
          <div
            onClick={() => setActivePage('configurator', 'pull-out')}
            className="rounded-2xl overflow-hidden bg-[#121212] border border-[#1E1E1E] hover:border-neutral-700 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-black">
              <img
                src="/images/petg-ribbon.jpg"
                alt="PETG"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1.5 text-left">
              <h3 className="text-base font-bold text-white group-hover:text-brand-red transition-colors">
                PETG
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Impact resistant, weatherproof.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

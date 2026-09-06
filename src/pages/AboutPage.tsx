import React from 'react';
import { useApp } from '../context/AppContext';
import { LionLogo } from '../components/common/LionLogo';
import {
  Award,
  CheckCircle2,
  Cpu,
  Flame,
  Globe,
  Layers,
  MapPin,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-16 animate-slide-up">
      {/* Brand Hero Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-brand-border pb-12">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Company Heritage & Ethos
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-tight text-white leading-tight">
            ENGINEERED TO <br />
            <span className="text-gradient-red">DEFY LIMITS.</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-textMuted leading-relaxed">
            Founded with a vision to democratize industrial additive manufacturing across Ghana and the global stage, <strong>Lion’s Den 3D</strong> combines rigorous mechanical engineering, cloud-based slicing mathematics, and a precision-calibrated 3D printer fleet.
          </p>
          <p className="text-xs sm:text-sm text-brand-textDim leading-relaxed">
            Whether you are an aerospace engineer prototyping drone motor brackets, a medical designer printing custom orthotics, an architect presenting scale elevations, or a digital creator bringing collectible characters to life — we guarantee industrial tolerances and material integrity.
          </p>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="p-8 rounded-3xl bg-brand-card border border-brand-red/40 relative shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-red">
              <LionLogo size="lg" showText={false} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display uppercase text-white">
                The Lion’s Den Precision Standard
              </h3>
              <p className="text-xs text-brand-textDim leading-relaxed">
                The lion represents strength, majesty, and unyielding confidence. We embody these principles in every layer deposition, toolpath calculation, and micrometer quality inspection.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-brand-surface border border-brand-border">
                <span className="text-brand-red font-bold block text-lg">±0.05 mm</span>
                <span className="text-brand-textDim text-[10px]">Caliper Tolerance</span>
              </div>
              <div className="p-3 rounded-xl bg-brand-surface border border-brand-border">
                <span className="text-white font-bold block text-lg">6 Fleet</span>
                <span className="text-brand-textDim text-[10px]">Active Production Nodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Fleet Showcase */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
            Hardware Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Industrial Additive Equipment
          </h2>
          <p className="text-xs sm:text-sm text-brand-textDim max-w-xl mx-auto">
            Our temperature-controlled print studio in Accra operates cutting-edge FDM, CoreXY, and MSLA resin systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Bambu Lab X1-Carbon Fleet',
              tech: 'Enclosed CoreXY with AI Micro-Lidar',
              desc: 'High-speed extrusion up to 500 mm/s with automatic bed leveling and carbon-fiber reinforced printing capabilities.',
              temps: '300°C Hotend • 120°C Bed',
            },
            {
              name: 'Prusa MK4 & XL Toolchanger',
              tech: 'Direct-Drive Nextruder & Multi-Material',
              desc: 'Exceptional dimensional accuracy for tight mechanical interlocking assemblies, nylon, and flexible TPU 95A rubber.',
              temps: '290°C Hotend • 100°C Bed',
            },
            {
              name: 'Voron 2.4 350 Custom CoreXY',
              tech: 'High-Chamber Chamber Temperature',
              desc: 'Enclosed high-temp chamber designed for warp-free ABS, ASA, and Polycarbonate functional engineering housings.',
              temps: '350°C Hotend • 130°C Bed',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-red">
                <Printer className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-brand-red font-bold uppercase">
                  {item.tech}
                </span>
                <h3 className="text-base font-bold text-white">{item.name}</h3>
                <p className="text-xs text-brand-textDim leading-relaxed font-sans">{item.desc}</p>
              </div>
              <div className="text-[10px] font-mono text-brand-textMuted pt-2 border-t border-brand-border">
                {item.temps}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

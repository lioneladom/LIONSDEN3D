import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0, 1]);

  const faqs: FAQItem[] = [
    {
      category: 'STL Uploads',
      q: 'What 3D CAD file formats does Lion’s Den 3D support?',
      a: 'We currently natively support .STL (Standard Tessellation Language) in both Binary and ASCII formats. You can export .STL from Fusion 360, SolidWorks, Blender, Rhino, AutoCAD, or Tinkercad. In future updates, .STEP and .OBJ will also be supported.',
    },
    {
      category: 'STL Uploads',
      q: 'Why did my model show a non-manifold geometry warning?',
      a: 'A non-manifold model has self-intersecting triangles, inverted normal vectors, or missing faces (open edges). While our automated slicer engine repairs standard defects, severe mesh tears may require running an auto-repair mesh pass in Blender or Meshmixer before exporting.',
    },
    {
      category: 'Pricing',
      q: 'How is the instant 3D print quote calculated?',
      a: 'Unlike naive volume calculators, Lion’s Den 3D uses a true slicer formula factoring in: (1) Shell perimeter weight, (2) Core infill volume based on your chosen %, (3) Material density in g/cm³, (4) Estimated machine print runtime, and (5) Platform setup and support material fees. The resulting quotation is authoritative and transparent.',
    },
    {
      category: 'Pricing',
      q: 'Is there a minimum order price threshold?',
      a: 'Yes, our studio operates a standard minimum order threshold (typically GHS 15.00) to cover machine heating, bed calibration, and quality control inspection. If your micro-part calculates below this threshold, the price is clamped to the minimum.',
    },
    {
      category: 'Materials',
      q: 'Which material should I choose: PLA, PETG, ABS, or TPU?',
      a: '• PLA: Best for visual models, figurines, and indoor desktop items. Crisp detail and glossy finish.\n• PETG: Best for functional brackets, waterproof containers, and outdoor UV resistance.\n• ABS: High mechanical strength and heat deflection up to 100°C (ideal for automotive & mechanical housings).\n• TPU 95A: Flexible elastomeric rubber for gaskets, phone cases, and vibration dampeners.',
    },
    {
      category: 'Printing & Tolerances',
      q: 'What dimensional tolerances can Lion’s Den 3D achieve?',
      a: 'Our calibrated CoreXY and direct-drive printers routinely hold ±0.05 mm to ±0.15 mm tolerances depending on the geometry and chosen layer height. For interlocking snap-fit assemblies, we recommend designing 0.20 mm to 0.30 mm clearance into your CAD model.',
    },
    {
      category: 'Printing & Tolerances',
      q: 'What layer height should I select?',
      a: '• 0.12 mm (Ultra Detail): Ideal for miniatures, jewelry prototypes, and fine typography.\n• 0.20 mm (Standard): The sweet spot balancing surface smoothness and printing speed.\n• 0.28 mm (Draft Speed): Best for rapid sizing prototypes and large architectural massing models.',
    },
    {
      category: 'Delivery & Payments',
      q: 'How long does production and delivery take in Ghana?',
      a: 'Standard orders are printed, quality inspected, and packaged within 24 to 48 hours. Express Rush orders are prioritized for 24-hour turnaround. Delivery across Greater Accra takes 2–4 hours post-dispatch; regional deliveries take 24 hours via secure courier.',
    },
    {
      category: 'Delivery & Payments',
      q: 'What payment methods do you accept?',
      a: 'We accept MTN Mobile Money, Telecel Cash, Visa, Mastercard, and Crypto / USDT. Studio pickup orders can also be settled via on-site Mobile Money or cash.',
    },
  ];

  const categories = ['ALL', 'STL Uploads', 'Pricing', 'Materials', 'Printing & Tolerances', 'Delivery & Payments'];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
          Knowledge Base & FAQ
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-brand-textMuted max-w-lg mx-auto">
          Everything you need to know about preparing STL files, material choices, pricing formulas, and physical delivery.
        </p>
      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-brand-textDim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search answers (e.g. tolerances, PLA, mobile money, minimum order)..."
            className="w-full bg-brand-card border border-brand-border rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-red font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand-red text-white font-bold'
                  : 'bg-brand-card border border-brand-border text-brand-textDim hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isExpanded = expandedIndices.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleExpand(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-brand-cardHover transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-brand-red">
                    {faq.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{faq.q}</h3>
                </div>

                <div className="p-1.5 rounded-lg bg-brand-surface border border-brand-border text-brand-textDim shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 text-xs text-brand-textMuted leading-relaxed border-t border-brand-border/40 font-sans whitespace-pre-line animate-slide-up">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

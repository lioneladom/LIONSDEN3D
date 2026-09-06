import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  Box,
  Layers,
  ShoppingBag,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Command,
  CheckCircle,
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    products,
    materials,
    orders,
    formatPrice,
    setActivePage,
    setSelectedProductId,
    setSelectedOrderId,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut Cmd+K / Ctrl+K & Escape handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      } else if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Quick Nav Pages
  const sitePages = [
    { id: 'configurator', title: '3D Print Configurator (Upload STL)', category: 'TOOL', icon: Box, desc: 'Instant mesh analysis, slicing presets & live pricing' },
    { id: 'shop', title: 'Marketplace & STL Catalog', category: 'SHOP', icon: ShoppingBag, desc: 'Curated 3D models, mechanical parts & hardware' },
    { id: 'materials', title: 'Materials Technical Matrix', category: 'SPECS', icon: Layers, desc: 'PLA, PETG, Resin, TPU, Carbon Fiber engineering specs' },
    { id: 'how-it-works', title: 'How It Works Guide', category: 'GUIDE', icon: FileText, desc: 'From CAD design to doorstep delivery workflow' },
    { id: 'tracker', title: 'Live Order Telemetry Tracker', category: 'ORDER', icon: Clock, desc: 'Real-time print progress & status tracking' },
    { id: 'dashboard', title: 'Customer Dashboard', category: 'ACCOUNT', icon: CheckCircle, desc: 'Order history, slicer presets & saved models' },
  ];

  // Filtered results
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], materials: [], orders: [], pages: [] };

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );

    const matchedMaterials = materials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.recommendedFor && m.recommendedFor.some((r) => r.toLowerCase().includes(q)))
    );

    const matchedOrders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some((item) => item.title.toLowerCase().includes(q))
    );

    const matchedPages = sitePages.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.desc.toLowerCase().includes(q) ||
        page.id.toLowerCase().includes(q)
    );

    return {
      products: matchedProducts,
      materials: matchedMaterials,
      orders: matchedOrders,
      pages: matchedPages,
    };
  }, [query, products, materials, orders]);

  const totalResultsCount =
    searchResults.products.length +
    searchResults.materials.length +
    searchResults.orders.length +
    searchResults.pages.length;

  if (!isSearchModalOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-6 md:p-12 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Click outside to close */}
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111111] border border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 animate-slide-up mt-6 sm:mt-12">
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800 bg-[#161616]">
          <Search className="w-5 h-5 text-brand-red shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search STL files, materials, orders, specs, or pages..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
            <span>ESC</span>
          </div>
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* If No Query Typed: Show Suggestions & Quick Navigation */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Popular Searches */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-red" />
                  <span>Popular Inquiries</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Carbon Fiber PLA',
                    'Planetary Gearbox',
                    'High-Detail Resin',
                    'Upload STL',
                    'LD-2026-10082',
                    'PETG Tough',
                    'Nozzle Pack',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-brand-red/50 text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-brand-red" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Jump Directory */}
              <div className="space-y-2.5">
                <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">
                  Navigation Shortcuts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sitePages.map((page) => {
                    const IconComponent = page.icon;
                    return (
                      <div
                        key={page.id}
                        onClick={() => {
                          setActivePage(page.id, 'push-down');
                          setIsSearchModalOpen(false);
                        }}
                        className="group p-3 rounded-2xl bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-brand-red/50 transition-all cursor-pointer flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-brand-red/40 group-hover:text-brand-red flex items-center justify-center text-neutral-300 transition-colors shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-bold text-white truncate group-hover:text-brand-red transition-colors">
                            {page.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            {page.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* If Query Typed & Results Found */}
          {query.trim() && totalResultsCount > 0 && (
            <div className="space-y-6">
              {/* 1. Products / STL Models */}
              {searchResults.products.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold border-b border-neutral-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-red" />
                      <span>3D Models & Marketplace ({searchResults.products.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setActivePage('shop', 'push-down');
                          setIsSearchModalOpen(false);
                        }}
                        className="group p-2.5 rounded-2xl bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 hover:border-brand-red/60 transition-all cursor-pointer flex items-center justify-between gap-3 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={product.images[0] || '/images/den-lion-red.png'}
                            alt={product.name}
                            className="w-11 h-11 rounded-xl object-cover border border-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-brand-red transition-colors truncate">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-neutral-400 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-white font-mono">
                            {formatPrice(product.price)}
                          </div>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Materials */}
              {searchResults.materials.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold border-b border-neutral-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-red" />
                      <span>Calibrated Materials ({searchResults.materials.length})</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.materials.map((mat) => (
                      <div
                        key={mat.id}
                        onClick={() => {
                          setActivePage('materials', 'push-down');
                          setIsSearchModalOpen(false);
                        }}
                        className="group p-3 rounded-2xl bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 hover:border-brand-red/60 transition-all cursor-pointer text-left space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                            {mat.name}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-red/10 text-brand-red border border-brand-red/30">
                            {mat.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 line-clamp-1 leading-relaxed">
                          {mat.description}
                        </p>
                        <div className="flex items-center gap-1.5 pt-1">
                          {mat.colors.slice(0, 5).map((c) => (
                            <span
                              key={c.id}
                              className="w-2.5 h-2.5 rounded-full border border-neutral-700 inline-block"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Orders */}
              {searchResults.orders.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold border-b border-neutral-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-red" />
                      <span>Matching Orders ({searchResults.orders.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.orders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setActivePage('tracker', 'push-down');
                          setIsSearchModalOpen(false);
                        }}
                        className="group p-2.5 rounded-2xl bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 hover:border-brand-red/60 transition-all cursor-pointer flex items-center justify-between text-left"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-red">
                              {o.orderNumber}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
                              {o.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {o.customerName} • {o.items.length} item(s) • {formatPrice(o.total)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Pages */}
              {searchResults.pages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold border-b border-neutral-800 pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Command className="w-3.5 h-3.5 text-brand-red" />
                      <span>Application Pages ({searchResults.pages.length})</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.pages.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActivePage(p.id, 'push-down');
                          setIsSearchModalOpen(false);
                        }}
                        className="group p-2.5 rounded-2xl bg-[#141414] hover:bg-neutral-800/80 border border-neutral-800 hover:border-brand-red/60 transition-all cursor-pointer flex items-center justify-between text-left"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-neutral-400">{p.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* If Query Typed & No Results Found */}
          {query.trim() && totalResultsCount === 0 && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  No matches found for "{query}"
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try searching with generic terms like "PLA", "Gear", "Resin", or check the custom 3D configurator.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePage('configurator', 'push-down');
                  setIsSearchModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-redBright text-white text-xs font-bold transition-colors shadow-red-glow"
              >
                Upload Custom STL Instead
              </button>
            </div>
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-[#0d0d0d] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px]">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px]">
                ESC
              </kbd>{' '}
              Close
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>Lion's Den 3D Search</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

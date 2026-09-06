import React from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from '../../components/common/LionLogo';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Box,
  Cpu,
  DollarSign,
  Eye,
  Layers,
  LayoutDashboard,
  Package,
  Printer,
  Settings,
  Shield,
  ShoppingBag,
  Sliders,
  Users,
  Warehouse,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminTab, setAdminTab, setActivePage, currentUser, orders, inventory, switchUserRole } =
    useApp();

  const lowStockCount = inventory.filter((i) => i.status !== 'HEALTHY').length;
  const pendingOrdersCount = orders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PRINTING'].includes(o.status)
  ).length;

  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Fulfillment', icon: Package, badge: pendingOrdersCount },
    { id: 'inspector', label: '3D Model Inspector', icon: Eye },
    { id: 'pricing', label: 'Live Pricing Engine', icon: DollarSign },
    { id: 'materials', label: 'Materials & Colors', icon: Cpu },
    { id: 'print-settings', label: 'Print Slicer Settings', icon: Sliders },
    { id: 'inventory', label: 'Filament Inventory', icon: Warehouse, badge: lowStockCount, badgeColor: 'bg-amber-500' },
    { id: 'products', label: 'Store Products', icon: ShoppingBag },
    { id: 'analytics', label: 'Business Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Studio Settings', icon: Settings },
  ];

  // Gatekeeper: If user is not an administrator, show the protected Admin Gate
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-slide-up">
          <div className="flex justify-center">
            <LionLogo size="lg" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-brand-red/40 text-brand-red text-xs font-mono font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Clearance</span>
            </div>
            <h1 className="text-xl font-bold font-display text-white pt-2">
              Chief Engineer Portal
            </h1>
            <p className="text-xs text-neutral-400">
              This terminal controls printer fleet telemetry, pricing engines, and order fulfillment.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-left space-y-2 text-xs">
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              Current Session
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium truncate">
                {currentUser?.name || 'Guest / Customer'}
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300">
                {currentUser?.role || 'UNAUTHENTICATED'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                switchUserRole('ADMIN');
              }}
              className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all"
            >
              Authenticate as Chief Engineer
            </button>

            <button
              onClick={() => setActivePage('home')}
              className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white flex flex-col">
      {/* Admin Top Navigation Strip */}
      <header className="bg-brand-surface border-b border-brand-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div onClick={() => setActivePage('home')}>
            <LionLogo size="sm" />
          </div>
          <div className="h-5 w-[1px] bg-brand-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-red text-white uppercase tracking-wider">
              Control Center
            </span>
            <span className="text-xs font-mono text-brand-textDim hidden md:inline">
              Shop Owner Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs font-mono text-brand-textMuted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-red" />
            <span className="hidden sm:inline">Back to Customer Store</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
            <div className="w-7 h-7 rounded-lg bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red text-xs font-bold font-mono">
              AD
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-bold text-white leading-tight">Lead Engineer Kofi</div>
              <div className="text-[10px] text-brand-red font-mono">System Administrator</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-brand-surface border-r border-brand-border p-4 space-y-1.5 shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-brand-textDim px-3 py-2 font-bold">
            Admin Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
                    isActive
                      ? 'bg-brand-red text-white font-bold shadow-red-glow'
                      : 'text-brand-textMuted hover:text-white hover:bg-brand-card'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-black ${
                        item.badgeColor || 'bg-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick System Telemetry in Sidebar */}
          <div className="mt-8 p-3.5 rounded-xl bg-brand-card border border-brand-border space-y-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Activity className="w-3.5 h-3.5 text-brand-red" />
              <span>Printer Fleet Status</span>
            </div>
            <div className="flex justify-between text-brand-textDim">
              <span>Active Jobs:</span>
              <span className="text-emerald-400 font-bold">4 Printing</span>
            </div>
            <div className="flex justify-between text-brand-textDim">
              <span>Idle Nodes:</span>
              <span className="text-white">2 Ready</span>
            </div>
            <div className="flex justify-between text-brand-textDim">
              <span>Bed Limits:</span>
              <span className="text-white">300×300×400</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 xl:p-12 overflow-y-auto max-w-site">
          {children}
        </main>
      </div>
    </div>
  );
};

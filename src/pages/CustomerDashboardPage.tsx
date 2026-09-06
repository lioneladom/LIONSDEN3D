import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  Box,
  Sliders,
  Settings,
  PlusCircle,
  Check,
  Truck,
  Search,
  ArrowRight,
  Plus,
  ExternalLink,
  Clock,
  Cpu,
  FileText,
  CheckCircle2,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const {
    currentUser,
    orders,
    formatPrice,
    setActivePage,
    setSelectedOrderId,
  } = useApp();

  const [activeNav, setActiveNav] = useState<'dashboard' | 'orders' | 'models' | 'configs' | 'settings'>('dashboard');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings form state
  const [name, setName] = useState(currentUser?.name || 'Kwame Mensah');
  const [email, setEmail] = useState(currentUser?.email || 'kwame.mensah@techghana.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+233 24 819 4022');
  const [street, setStreet] = useState('14 Cantonments Road');
  const [city, setCity] = useState('Accra');
  const [region, setRegion] = useState('Greater Accra');

  // Real orders for current customer
  const customerOrders = orders.filter(
    (o) =>
      o.userId === currentUser?.id ||
      o.customerEmail.toLowerCase() === (currentUser?.email || '').toLowerCase() ||
      currentUser?.role === 'CUSTOMER'
  );

  // Computed live metrics
  const activeOrdersList = customerOrders.filter((o) =>
    ['PENDING', 'CONFIRMED', 'PREPARING', 'PRINTING', 'QUALITY_CHECK'].includes(o.status)
  );
  const completedOrdersList = customerOrders.filter((o) =>
    ['READY', 'SHIPPED', 'COMPLETED'].includes(o.status)
  );
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

  // Active or latest order for progress timeline
  const ongoingOrder = activeOrdersList[0] || customerOrders[0];

  // Stage progress helper for ongoing order
  const getStageLevel = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
      case 'PRINTING':
        return 2;
      case 'QUALITY_CHECK':
      case 'READY':
        return 3;
      case 'SHIPPED':
      case 'COMPLETED':
        return 4;
      default:
        return 1;
    }
  };

  const currentStageLevel = ongoingOrder ? getStageLevel(ongoingOrder.status) : 0;

  const handleTrackOrder = (orderNumber: string) => {
    setSelectedOrderId(orderNumber);
    setActivePage('tracker');
  };

  // Saved 3D STL models in customer's personal library
  const savedModels = [
    {
      id: 'model-lion-emblem',
      name: 'Signature Lion Emblem.stl',
      date: 'Sep 04, 2026',
      dimensions: '95 × 80 × 22 mm',
      volume: '42.8 cm³',
      format: 'Binary STL',
      recommendedMaterial: 'PLA Matte Red',
    },
    {
      id: 'model-planetary-gear',
      name: 'Planetary Gear Mechanism.stl',
      date: 'Aug 29, 2026',
      dimensions: '75 × 75 × 35 mm',
      volume: '68.2 cm³',
      format: 'Binary STL',
      recommendedMaterial: 'Industrial PETG',
    },
    {
      id: 'model-cantilever-tower',
      name: 'Skyline Series Tower.stl',
      date: 'Aug 18, 2026',
      dimensions: '120 × 110 × 240 mm',
      volume: '115.6 cm³',
      format: 'Binary STL',
      recommendedMaterial: 'White Matte PLA',
    },
    {
      id: 'model-gyroid-block',
      name: 'Gyroid Micro-Lattice.stl',
      date: 'Aug 10, 2026',
      dimensions: '40 × 40 × 40 mm',
      volume: '24.0 cm³',
      format: 'Binary STL',
      recommendedMaterial: 'TPU 95A / Resin',
    },
  ];

  // Slicer profiles
  const slicerProfiles = [
    {
      name: 'Precision Engineering (0.12mm)',
      layerHeight: '0.12 mm',
      infill: '35% Gyroid',
      speed: '50 mm/s',
      walls: '4 Perimeters',
      desc: 'Optimized for tight dimensional tolerances and mechanical gear assemblies.',
    },
    {
      name: 'Industrial High-Strength (0.20mm)',
      layerHeight: '0.20 mm',
      infill: '45% Honeycomb',
      speed: '65 mm/s',
      walls: '5 Perimeters',
      desc: 'Engineered for carbon fiber composites and high mechanical stress parts.',
    },
    {
      name: 'Rapid Visual Prototype (0.28mm)',
      layerHeight: '0.28 mm',
      infill: '15% Grid',
      speed: '85 mm/s',
      walls: '3 Perimeters',
      desc: 'High-speed drafting mode for rapid form-and-fit testing.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer Profile Pill */}
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#222] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red font-bold font-mono">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'KM'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-sm truncate">
                {currentUser?.name || 'Kwame Mensah'}
              </div>
              <div className="text-[11px] text-neutral-400 truncate font-mono">
                {currentUser?.email || 'kwame.mensah@techghana.com'}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-brand-red/15 text-brand-red font-bold border border-brand-red/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveNav('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeNav === 'orders'
                  ? 'bg-brand-red/15 text-brand-red font-bold border border-brand-red/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              {activeOrdersList.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-red text-white">
                  {activeOrdersList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('models')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === 'models'
                  ? 'bg-brand-red/15 text-brand-red font-bold border border-brand-red/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>My 3D Models</span>
            </button>

            <button
              onClick={() => setActiveNav('configs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === 'configs'
                  ? 'bg-brand-red/15 text-brand-red font-bold border border-brand-red/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Slicer Presets</span>
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeNav === 'settings'
                  ? 'bg-brand-red/15 text-brand-red font-bold border border-brand-red/30'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account & Delivery</span>
            </button>
          </nav>

          {/* Quick Action: Start New Job */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-[#222] space-y-3">
            <span className="text-xs font-mono uppercase text-neutral-400 block font-semibold">
              Instant 3D Printing
            </span>
            <button
              onClick={() => setActivePage('configurator')}
              className="w-full py-2.5 px-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs flex items-center justify-center gap-2 shadow-red-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload New STL File</span>
            </button>
          </div>
        </div>

        {/* Right Main Content Panel */}
        <div className="lg:col-span-9 space-y-8">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeNav === 'dashboard' && (
            <div className="space-y-8">
              {/* Top 4 Live Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-1 shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    ACTIVE PRINTS
                  </span>
                  <span className="text-3xl font-black text-brand-red font-mono">
                    {String(activeOrdersList.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-1 shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    TOTAL ORDERS
                  </span>
                  <span className="text-3xl font-black text-white font-mono">
                    {String(customerOrders.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-1 shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    SAVED STL MODELS
                  </span>
                  <span className="text-3xl font-black text-white font-mono">
                    {String(savedModels.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl p-5 space-y-1 shadow-lg">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    TOTAL INVESTMENT
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {formatPrice(totalSpent)}
                  </span>
                </div>
              </div>

              {/* Ongoing Production Live Stepper Card */}
              {ongoingOrder ? (
                <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Ongoing Production Status
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono mt-1">
                        Order <strong className="text-white">{ongoingOrder.orderNumber}</strong> •{' '}
                        {ongoingOrder.items.length} item(s) • Method: {ongoingOrder.paymentMethod}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTrackOrder(ongoingOrder.orderNumber)}
                      className="px-5 py-2.5 rounded-xl bg-brand-card hover:bg-brand-red border border-[#2E2E2E] text-xs font-semibold text-white transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      <span>Open Live Tracker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 4-Stage Stepper based on real order state */}
                  <div className="relative pt-4 pb-2">
                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                      {/* 1. Confirmed */}
                      <div className="space-y-2.5 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentStageLevel >= 1
                              ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                              : 'bg-[#1C1C1C] border border-[#2E2E2E] text-neutral-500'
                          }`}
                        >
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Confirmed</h5>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {ongoingOrder.createdAt.split('T')[0]}
                          </span>
                        </div>
                      </div>

                      {/* 2. Printing */}
                      <div className="space-y-2.5 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentStageLevel >= 2
                              ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30 ring-4 ring-brand-red/20'
                              : 'bg-[#1C1C1C] border border-[#2E2E2E] text-neutral-500'
                          }`}
                        >
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Printing</h5>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {currentStageLevel >= 2 ? 'In Chamber' : 'Queued'}
                          </span>
                        </div>
                      </div>

                      {/* 3. Quality Check */}
                      <div className="space-y-2.5 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentStageLevel >= 3
                              ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                              : 'bg-[#1C1C1C] border border-[#2E2E2E] text-neutral-500'
                          }`}
                        >
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-neutral-300">Quality Check</h5>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {currentStageLevel >= 3 ? 'Passed' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* 4. Shipped / Ready */}
                      <div className="space-y-2.5 flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentStageLevel >= 4
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-[#1C1C1C] border border-[#2E2E2E] text-neutral-500'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-neutral-300">
                            {ongoingOrder.status === 'COMPLETED' ? 'Delivered' : 'Dispatched'}
                          </h5>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {currentStageLevel >= 4 ? 'Complete' : 'Next Step'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#121212] border border-[#1E1E1E] text-center space-y-3">
                  <Package className="w-10 h-10 text-neutral-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Active Print Orders</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    All your print jobs are complete. Upload a new CAD/STL model or browse our curated shop to queue your next precision print.
                  </p>
                  <button
                    onClick={() => setActivePage('configurator')}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-bold shadow-red-glow"
                  >
                    Start a Print Job
                  </button>
                </div>
              )}

              {/* Two Columns: Recent Orders & Quick STL Access */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Recent Orders
                    </h4>
                    <button
                      onClick={() => setActiveNav('orders')}
                      className="text-xs font-semibold text-brand-red hover:underline"
                    >
                      View All ({customerOrders.length})
                    </button>
                  </div>

                  <div className="bg-[#121212] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#1E1E1E] bg-[#161616] text-neutral-400 text-[10px] uppercase">
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#181818]">
                        {customerOrders.slice(0, 4).map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => handleTrackOrder(ord.orderNumber)}
                            className="hover:bg-[#181818] transition-colors cursor-pointer group"
                          >
                            <td className="py-3.5 px-4 font-bold text-white group-hover:text-brand-red transition-colors">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4 text-neutral-400">
                              {ord.createdAt.split('T')[0]}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  ['PRINTING', 'PREPARING'].includes(ord.status)
                                    ? 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                                    : ord.status === 'COMPLETED'
                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                                    : 'bg-neutral-800 text-neutral-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-brand-redBright">
                              {formatPrice(ord.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Library Highlights */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Saved 3D Models
                    </h4>
                    <button
                      onClick={() => setActiveNav('models')}
                      className="text-xs font-semibold text-brand-red hover:underline"
                    >
                      Library ({savedModels.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {savedModels.slice(0, 3).map((mod) => (
                      <div
                        key={mod.id}
                        onClick={() => setActivePage('configurator')}
                        className="p-3.5 rounded-2xl bg-[#121212] border border-[#1E1E1E] hover:border-neutral-700 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] border border-[#222] flex items-center justify-center shrink-0">
                            <Box className="w-4 h-4 text-brand-red" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate group-hover:text-brand-red transition-colors">
                              {mod.name}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500">
                              {mod.dimensions} • {mod.volume}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                          Configure →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeNav === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Order History</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Review past print jobs, monitor ongoing manufacturing, and download invoices.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-xl border border-[#222]">
                  {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        orderFilter === filter
                          ? 'bg-brand-red text-white font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {customerOrders
                  .filter((o) => {
                    if (orderFilter === 'ACTIVE') return !['COMPLETED', 'READY'].includes(o.status);
                    if (orderFilter === 'COMPLETED') return ['COMPLETED', 'READY'].includes(o.status);
                    return true;
                  })
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#121212] border border-[#1E1E1E] space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-mono text-white">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ['PRINTING', 'PREPARING'].includes(ord.status)
                                ? 'bg-brand-red/20 text-brand-red border border-brand-red/30 animate-pulse'
                                : ord.status === 'COMPLETED'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-400">
                            Ordered {ord.createdAt.split('T')[0]}
                          </span>
                          <span className="text-sm font-bold font-mono text-brand-redBright">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between text-xs py-1"
                          >
                            <div>
                              <span className="text-white font-medium">{it.title}</span>
                              <span className="text-neutral-500 font-mono ml-2 text-[11px]">
                                ({it.subtitle})
                              </span>
                            </div>
                            <div className="text-neutral-400 font-mono">
                              Qty: {it.quantity} • {formatPrice(it.totalPrice)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-[#1A1A1A] flex items-center justify-between gap-4">
                        <div className="text-[11px] text-neutral-500 font-mono">
                          Delivery to: {ord.deliveryAddress.street}, {ord.deliveryAddress.city}
                        </div>
                        <button
                          onClick={() => handleTrackOrder(ord.orderNumber)}
                          className="px-4 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-red text-white text-xs font-semibold border border-neutral-700 transition-colors"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY 3D MODELS */}
          {activeNav === 'models' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E1E] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">My 3D Model Library</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Your uploaded 3D geometries and parametric STL parts ready for immediate production.
                  </p>
                </div>
                <button
                  onClick={() => setActivePage('configurator')}
                  className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center gap-1.5 shadow-red-glow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload STL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedModels.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-5 rounded-3xl bg-[#121212] border border-[#1E1E1E] space-y-4 hover:border-neutral-700 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-[#181818] border border-neutral-800 flex items-center justify-center shrink-0">
                          <Box className="w-5 h-5 text-brand-red" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{mod.name}</h4>
                          <span className="text-[11px] font-mono text-neutral-500 block">
                            Uploaded {mod.date}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
                        {mod.format}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0e0e0e] border border-neutral-900 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between text-neutral-400">
                        <span>Bounding Box:</span>
                        <span className="text-white">{mod.dimensions}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Solid Volume:</span>
                        <span className="text-white">{mod.volume}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Tested Material:</span>
                        <span className="text-brand-redBright">{mod.recommendedMaterial}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActivePage('configurator')}
                        className="w-full py-2 px-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs transition-colors text-center"
                      >
                        Load into Slicer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLICER PRESETS */}
          {activeNav === 'configs' && (
            <div className="space-y-6">
              <div className="border-b border-[#1E1E1E] pb-4">
                <h2 className="text-xl font-bold text-white">Saved Slicer Profiles</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Pre-configured manufacturing parameters calibrated for layer adhesion, finish, and strength.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {slicerProfiles.map((p) => (
                  <div
                    key={p.name}
                    className="p-5 rounded-3xl bg-[#121212] border border-[#1E1E1E] space-y-4 flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">{p.desc}</p>

                      <div className="pt-2 space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-neutral-400">
                          <span>Layer Height:</span>
                          <span className="text-white">{p.layerHeight}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Infill Density:</span>
                          <span className="text-white">{p.infill}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Perimeter Walls:</span>
                          <span className="text-white">{p.walls}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActivePage('configurator')}
                      className="w-full py-2 px-3 rounded-xl bg-[#1c1c1c] hover:bg-brand-red text-white text-xs font-semibold transition-colors mt-4"
                    >
                      Apply to Configurator
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT & DELIVERY SETTINGS */}
          {activeNav === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-[#1E1E1E] pb-4">
                <h2 className="text-xl font-bold text-white">Account & Delivery Information</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update your contact credentials and default shipping address for swift checkout.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 3000);
                }}
                className="p-6 sm:p-8 rounded-3xl bg-[#121212] border border-[#1E1E1E] space-y-6 max-w-2xl shadow-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 uppercase text-[10px] block">Region / State</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-brand-red font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  {profileSaved ? (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile updated successfully!</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Changes are saved locally
                    </span>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs flex items-center gap-2 shadow-red-glow transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

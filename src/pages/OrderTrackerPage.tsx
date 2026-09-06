import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  Layers,
  MapPin,
  Package,
  Printer,
  Search,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const OrderTrackerPage: React.FC = () => {
  const {
    selectedOrderId,
    setSelectedOrderId,
    orders,
    getOrderById,
    formatPrice,
    setActivePage,
    printers,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Resilient resolution: search query -> selectedOrderId -> latest order
  const order = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const found = orders.find(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q)
      );
      if (found) return found;
    }
    if (selectedOrderId) {
      const found = getOrderById(selectedOrderId);
      if (found) return found;
    }
    return orders[0] || null;
  }, [searchQuery, selectedOrderId, orders, getOrderById]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-surface border border-neutral-800 flex items-center justify-center mx-auto text-brand-red shadow-red-glow">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            No Orders Found
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            You don't have any active manufacturing orders in production yet. Upload your 3D model to get an instant quote and track live telemetry.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActivePage('configurator', 'push-down')}
            className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white text-xs font-bold uppercase tracking-wider transition-all shadow-red-glow"
          >
            Start Instant 3D Print
          </button>
          <button
            onClick={() => setActivePage('dashboard', 'push-down')}
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const assignedPrinter = printers.find((p) => p.id === order.assignedPrinterId) || printers[1];

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8">
      {/* Header with Search and Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <button
            onClick={() => setActivePage('dashboard', 'push-down')}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
              Live Additive Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <span>Tracking Order</span>
            <span className="text-brand-red font-mono">{order.orderNumber}</span>
          </h1>
        </div>

        {/* Live Search & Status Indicator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Order Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141414] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red transition-colors font-mono"
            />
          </div>

          <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-neutral-800 text-xs font-mono text-white">
            <span className={`w-2.5 h-2.5 rounded-full ${
              order.status === 'READY' || order.status === 'SHIPPED'
                ? 'bg-emerald-500'
                : 'bg-brand-red animate-pulse'
            }`} />
            <span>Status: {order.status}</span>
          </div>
        </div>
      </div>

      {/* Quick Order Switcher Strip (if customer has multiple orders) */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-900/60">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 whitespace-nowrap mr-1">
            Recent Orders:
          </span>
          {orders.map((o) => {
            const isSelected = order.id === o.id;
            return (
              <button
                key={o.id}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedOrderId(o.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-red text-white font-bold shadow-red-glow'
                    : 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <span>{o.orderNumber}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-black/40 text-white' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {o.status}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Order Timeline Stages */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-border space-y-6 shadow-xl">
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-red" />
              <span>Production Pipeline Timeline</span>
            </h3>

            {/* Vertical Stepper Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-brand-border/80">
              {(order.timeline || []).map((evt, idx) => {
                const isPast = evt.completed;
                const isCurrent = evt.current;

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Circle Node Indicator */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-red text-white ring-4 ring-brand-red/20 shadow-red-glow animate-pulse'
                          : isPast
                          ? 'bg-emerald-500 text-black'
                          : 'bg-brand-surface border border-brand-border text-brand-textDim'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-brand-redBright'
                              : isPast
                              ? 'text-white'
                              : 'text-brand-textDim'
                          }`}
                        >
                          {evt.label}
                        </h4>
                        <span className="text-[10px] font-mono text-brand-textDim">
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-brand-textDim leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active 3D Printer Telemetry Card (If In Production) */}
          {(order.status === 'PRINTING' || order.status === 'PREPARING') && (
            <div className="p-6 rounded-3xl bg-brand-surface border border-brand-red/40 space-y-4 shadow-red-glow">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-brand-red animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-white">
                    Active Printer Node: {assignedPrinter.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-red/20 text-brand-red border border-brand-red/30">
                  {assignedPrinter.progressPercent}% Sliced
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-brand-card rounded-full h-2.5 overflow-hidden border border-brand-border">
                  <div
                    className="h-full bg-gradient-to-r from-brand-redDark to-brand-redBright rounded-full transition-all duration-500"
                    style={{ width: `${assignedPrinter.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Live Temperature Gauges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-[10px] text-brand-textDim flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-brand-red" /> Nozzle Temp
                  </span>
                  <span className="text-white font-bold">{assignedPrinter.nozzleTemp}°C</span>
                </div>
                <div className="p-2 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-[10px] text-brand-textDim block">Bed Temp</span>
                  <span className="text-white font-bold">{assignedPrinter.bedTemp}°C</span>
                </div>
                <div className="p-2 rounded-xl bg-brand-card border border-brand-border">
                  <span className="text-[10px] text-brand-textDim block">Filament</span>
                  <span className="text-brand-redBright font-bold truncate">
                    {assignedPrinter.materialLoaded.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Details & Address Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Details */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase font-bold text-white tracking-wider border-b border-brand-border pb-3">
              Order Specification
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="text-xs space-y-1">
                  <div className="font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-brand-textDim font-mono">
                    {item.subtitle} • Qty: {item.quantity}
                  </div>
                  {item.priceBreakdown && (
                    <div className="text-[10px] font-mono text-brand-textDim">
                      Weight: {item.priceBreakdown.estimatedWeightGrams}g • Print Time: ~
                      {Math.round(item.priceBreakdown.estimatedPrintTimeMinutes / 60)}h
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-brand-border space-y-2 text-xs font-mono">
              <div className="flex justify-between text-brand-textMuted">
                <span>Subtotal:</span>
                <span className="text-white">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Delivery:</span>
                <span className="text-white">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-white font-bold pt-2 border-t border-brand-border">
                <span>Total:</span>
                <span className="text-brand-redBright text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-border space-y-3 shadow-xl text-xs font-mono">
            <div className="flex items-center gap-2 text-brand-red font-bold uppercase">
              <MapPin className="w-4 h-4" />
              <span>Fulfillment Destination</span>
            </div>
            <div className="text-white font-semibold">{order.customerName}</div>
            <div className="text-brand-textDim">{order.customerPhone}</div>
            <div className="text-brand-textDim">
              {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
              {order.deliveryAddress.region}
            </div>
            {order.deliveryAddress.notes && (
              <div className="p-2 rounded bg-brand-surface border border-brand-border text-[11px] text-brand-textDim">
                Note: {order.deliveryAddress.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

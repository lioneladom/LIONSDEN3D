import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Eye,
  Filter,
  Layers,
  MapPin,
  Package,
  Printer,
  Search,
  User,
  X,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, formatPrice, printers } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  // Lock body scroll and listen for Escape key when order modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedOrder(null);
    };
    if (inspectedOrder) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectedOrder]);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stages: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'PRINTING',
    'QUALITY_CHECK',
    'READY',
    'SHIPPED',
    'COMPLETED',
  ];

  const handleStageAdvance = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    if (inspectedOrder && inspectedOrder.id === orderId) {
      setInspectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-widest text-brand-red font-semibold">
            Orders
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
            Order Management
          </h1>
          <p className="text-xs text-brand-textDim mt-1">
            Review orders, inspect configurations, and manage fulfillment.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-brand-card border border-brand-border text-xs font-mono text-white">
          Total: {orders.length} Orders
        </span>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {['ALL', 'PENDING', 'CONFIRMED', 'PRINTING', 'QUALITY_CHECK', 'READY', 'COMPLETED'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-brand-red text-white font-bold'
                    : 'bg-brand-card border border-brand-border text-brand-textDim hover:text-white'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-textDim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, customer..."
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-red"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-brand-card border border-brand-border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-brand-border text-brand-textDim uppercase text-[10px]">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 px-4">Customer</th>
                <th className="pb-3 px-4">Items / Model</th>
                <th className="pb-3 px-4">Total Price</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {filteredOrders.map((ord) => {
                const isPrinting = ord.status === 'PRINTING';
                return (
                  <tr key={ord.id} className="hover:bg-brand-surface/60 transition-colors">
                    <td className="py-4 pr-4 font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-brand-textDim">{ord.customerPhone}</div>
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <div className="text-white truncate font-sans font-medium">
                        {ord.items[0]?.title}
                      </div>
                      <div className="text-[10px] text-brand-textDim truncate">
                        {ord.items.length > 1 ? `+ ${ord.items.length - 1} more items` : ord.items[0]?.subtitle}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-brand-redBright">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                          isPrinting
                            ? 'bg-brand-red/20 text-brand-red border border-brand-red/30 animate-pulse'
                            : ord.status === 'COMPLETED'
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/40'
                            : 'bg-brand-surface text-brand-textMuted border border-brand-border'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-brand-textDim text-[11px]">
                      {ord.createdAt.split('T')[0]}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <button
                        onClick={() => setInspectedOrder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-brand-surface hover:bg-brand-red text-white text-xs font-mono transition-colors"
                      >
                        Inspect & Fulfill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal (Portaled to document.body to prevent parent container bounds/transform clipping) */}
      {inspectedOrder &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            {/* Backdrop click to dismiss */}
            <div
              onClick={() => setInspectedOrder(null)}
              className="absolute inset-0 cursor-pointer"
            />

            <div className="relative w-full max-w-3xl bg-[#111111] border border-brand-border rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-slide-up">
              {/* Pinned Modal Header */}
              <div className="p-5 sm:p-6 border-b border-brand-border flex items-center justify-between shrink-0 bg-[#151515]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse shrink-0" />
                  <div>
                    <span className="text-[10px] font-sans text-brand-red font-semibold uppercase tracking-wider block">
                      Order Fulfillment Inspector
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wider text-white">
                      {inspectedOrder.orderNumber}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-sans font-bold uppercase bg-brand-red/20 text-brand-red border border-brand-red/30">
                    {inspectedOrder.status}
                  </span>
                  <button
                    onClick={() => setInspectedOrder(null)}
                    className="p-2 rounded-xl bg-brand-card text-brand-textMuted hover:text-white hover:bg-white/10 transition-colors"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Stage Transition Control Strip */}
                <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans uppercase font-semibold text-brand-textDim">
                      Update Fulfillment Status:
                    </span>
                    <span className="text-[11px] font-mono text-brand-red font-bold">
                      Current: {inspectedOrder.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stages.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStageAdvance(inspectedOrder.id, st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
                          inspectedOrder.status === st
                            ? 'bg-brand-red text-white font-bold shadow-red-glow'
                            : 'bg-brand-surface border border-brand-border text-brand-textDim hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items & Customer Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-2">
                    <span className="text-brand-red font-semibold uppercase tracking-wider block">
                      Customer & Delivery
                    </span>
                    <div className="text-white font-bold text-sm">{inspectedOrder.customerName}</div>
                    <div className="text-brand-textDim font-mono">{inspectedOrder.customerEmail}</div>
                    <div className="text-brand-textDim font-mono">{inspectedOrder.customerPhone}</div>
                    <div className="text-brand-textDim pt-1 border-t border-brand-border/60">
                      {inspectedOrder.deliveryAddress.street}, {inspectedOrder.deliveryAddress.city}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-card border border-brand-border space-y-2">
                    <span className="text-brand-red font-semibold uppercase tracking-wider block">
                      Payment Details
                    </span>
                    <div className="flex justify-between font-mono">
                      <span className="text-brand-textDim">Method:</span>
                      <span className="text-white">{inspectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-brand-textDim">Subtotal:</span>
                      <span className="text-white">{formatPrice(inspectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-brand-textDim">Delivery:</span>
                      <span className="text-white">{formatPrice(inspectedOrder.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-brand-border font-mono font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-brand-redBright text-sm">
                        {formatPrice(inspectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans uppercase font-semibold text-white">
                      Order Parts ({inspectedOrder.items.length})
                    </span>
                    <span className="text-[11px] font-mono text-brand-textDim">
                      Created: {inspectedOrder.createdAt.split('T')[0]}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {inspectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{item.title}</div>
                          <div className="text-[11px] text-brand-textDim">{item.subtitle}</div>
                          {item.priceBreakdown && (
                            <div className="text-[10px] text-brand-textDim pt-1 font-mono">
                              Weight: {item.priceBreakdown.estimatedWeightGrams}g · ~
                              {Math.round(item.priceBreakdown.estimatedPrintTimeMinutes / 60)}h print time
                            </div>
                          )}
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-white font-bold text-sm">
                            {formatPrice(item.totalPrice)}
                          </div>
                          <div className="text-[10px] text-brand-textDim">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pinned Modal Footer */}
              <div className="p-4 px-6 border-t border-brand-border bg-[#151515] flex items-center justify-between shrink-0">
                <span className="text-xs text-brand-textDim font-mono hidden sm:inline">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Esc</kbd> or click outside to dismiss
                </span>
                <button
                  type="button"
                  onClick={() => setInspectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-brand-surface hover:bg-brand-red border border-brand-border hover:border-brand-red text-white text-xs font-semibold transition-all ml-auto"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

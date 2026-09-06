import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { selectedOrderId, getOrderById, setActivePage, setSelectedOrderId } = useApp();

  const order = selectedOrderId ? getOrderById(selectedOrderId) : null;
  const orderNumber = order?.orderNumber || 'LD-9482103';
  const deliveryAddress = order?.deliveryAddress
    ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.region}`
    : '123 Printing Way, London, EC1V 2NX';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-10 animate-fade-in text-white">
      {/* Red checkmark badge with orbiting dot */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-brand-red flex items-center justify-center bg-brand-red/5">
          <Check className="w-10 h-10 text-brand-red stroke-[2.5]" />
        </div>
        <div className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-brand-red"></div>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Order <span className="text-brand-red">Confirmed.</span>
        </h1>
        <p className="text-brand-textMuted text-sm sm:text-base max-w-lg mx-auto">
          Your design is being queued for production. Get ready to bring your 3D ideas to life.
        </p>
      </div>

      {/* Center Details Card */}
      <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-8 sm:p-10 space-y-6 text-left max-w-xl mx-auto shadow-2xl">
        {/* Row 1: Order Number & Status */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#666] font-mono block">
              ORDER NUMBER
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {orderNumber}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#666] font-mono block">
              STATUS
            </span>
            <div className="flex items-center gap-1.5 justify-end font-mono text-xs text-brand-red font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              Queuing
            </div>
          </div>
        </div>

        <div className="border-t border-[#1C1C1C]"></div>

        {/* Row 2: Estimated Completion & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#666] font-mono block">
              ESTIMATED COMPLETION
            </span>
            <span className="text-base font-bold text-white">
              Oct 24, 2024
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#666] font-mono block">
              DELIVERY ADDRESS
            </span>
            <span className="text-xs text-[#888] leading-relaxed block">
              {deliveryAddress}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              if (order) setSelectedOrderId(order.id);
              setActivePage('tracker');
            }}
            className="w-full py-4 rounded-xl bg-brand-red hover:bg-[#b00500] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-brand-red/20"
          >
            Track Live Production
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert(`Receipt downloaded for ${orderNumber}`)}
              className="py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-xs font-semibold text-white transition-colors border border-[#2A2A2A] text-center"
            >
              Download Receipt
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="py-3 px-4 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] text-xs font-semibold text-white transition-colors border border-[#2A2A2A] text-center"
            >
              Email Support
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="space-y-3 pt-4 text-xs">
        <p className="text-[#666]">Want to print more?</p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActivePage('configurator')}
            className="text-brand-red hover:underline font-semibold"
          >
            Start another print
          </button>
          <span className="text-[#555]">or</span>
          <button
            onClick={() => setActivePage('shop')}
            className="text-[#bbb] hover:text-white hover:underline font-medium"
          >
            Visit the Shop
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Trash2, Box, Info, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    setActivePage,
  } = useApp();

  const shippingCost = cart.length > 0 ? 12.0 : 0;
  const estimatedTax = cart.length > 0 ? cartSubtotal * 0.08 : 0;
  const totalCost = cartSubtotal + shippingCost + estimatedTax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white animate-fade-in">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Your Shopping <span className="text-brand-red">Cart</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.length === 0 ? (
            <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-12 text-center space-y-5">
              <Box className="w-16 h-16 mx-auto text-[#444]" />
              <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
              <p className="text-sm text-brand-textMuted max-w-md mx-auto">
                Upload a 3D model in our configurator or explore ready-to-ship filaments and mechanical assemblies in the shop.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => setActivePage('configurator')}
                  className="px-6 py-2.5 rounded-full bg-brand-red hover:bg-[#b00500] text-white text-sm font-bold transition-colors"
                >
                  Start a Print
                </button>
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-6 py-2.5 rounded-full bg-[#1C1C1C] hover:bg-[#282828] text-white text-sm font-medium border border-[#333] transition-colors"
                >
                  Browse Shop
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#1E1E1E] border-y border-[#1E1E1E]">
              {cart.map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  {/* Left info with thumbnail */}
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] border border-[#222] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.type === 'CUSTOM_STL' ? (
                        <div className="w-10 h-10 flex items-center justify-center">
                          {/* 3D red cube icon */}
                          <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-red fill-current" stroke="none">
                            <polygon points="12,2 22,7.5 12,13 2,7.5" fill="#E10600" />
                            <polygon points="2,8.5 12,14 12,22 2,16.5" fill="#B00500" />
                            <polygon points="12,14 22,8.5 22,16.5 12,22" fill="#750300" />
                          </svg>
                        </div>
                      ) : (
                        <img
                          src={item.product?.images?.[0] || '/images/pro-carbon-spool.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {item.type === 'CUSTOM_STL'
                            ? `Custom Print: ${item.model?.filename || item.title || 'Lion_Emblem.stl'}`
                            : item.product?.name || item.title}
                        </h3>
                        {item.type === 'CUSTOM_STL' ? (
                          <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-brand-red/10 text-brand-red border border-brand-red/30">
                            CUSTOM
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-[#222] text-[#888] border border-[#333]">
                            RETAIL
                          </span>
                        )}
                      </div>

                      {item.type === 'CUSTOM_STL' ? (
                        <div className="text-xs text-brand-textMuted space-y-1">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>Material: <strong className="text-white">{item.configuration?.materialId ? 'Carbon PLA' : 'Standard PLA'}</strong></span>
                            <span>Quality: <strong className="text-white">{item.configuration?.layerHeightMm || '0.12'}mm</strong></span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>Infill: <strong className="text-white">{item.configuration?.infillPercentage || 20}%</strong></span>
                            <span>Size: <strong className="text-white">{Math.round(item.configuration?.scaleX || 120)}×{Math.round(item.configuration?.scaleY || 80)}×{Math.round(item.configuration?.scaleZ || 45)} mm</strong></span>
                          </div>
                          <button
                            onClick={() => setActivePage('configurator')}
                            className="text-xs text-brand-red hover:underline font-semibold block pt-1"
                          >
                            Edit Configuration
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-brand-textMuted space-y-1">
                          <p>Color: <strong className="text-white">Matte Black</strong></p>
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                            🚚 Ships tomorrow
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Price & Quantity */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right">
                      <span className="text-lg font-bold text-white font-mono">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#666] hover:text-brand-red transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {item.type === 'CUSTOM_STL' ? (
                        <div className="px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-xs font-mono text-white">
                          {item.quantity}
                        </div>
                      ) : (
                        <div className="flex items-center bg-[#161616] border border-[#262626] rounded-md overflow-hidden text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-[#888] hover:text-white transition-colors"
                          >
                            –
                          </button>
                          <span className="px-2.5 py-1 text-white font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#888] hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Continue Shopping Link */}
          <div className="pt-4">
            <button
              onClick={() => setActivePage('shop')}
              className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Order Summary</h2>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between text-brand-textMuted">
                <span>Subtotal</span>
                <span className="text-white font-mono font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Production Speed (Standard)</span>
                <span className="text-emerald-400 font-mono font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Shipping</span>
                <span className="text-white font-mono font-medium">{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Estimated Tax</span>
                <span className="text-white font-mono font-medium">{formatPrice(estimatedTax)}</span>
              </div>
            </div>

            <div className="border-t border-[#1E1E1E] pt-4 flex items-baseline justify-between">
              <span className="text-base font-bold text-white">Total</span>
              <span className="text-3xl font-black text-brand-red font-mono">
                {formatPrice(totalCost)}
              </span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => setActivePage('checkout')}
              className="w-full py-4 rounded-xl bg-brand-red hover:bg-[#b00500] disabled:bg-[#282828] disabled:text-[#555] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-brand-red/20"
            >
              Checkout Now
            </button>

            {/* Payment badges */}
            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-[#666]">
              <span className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#282828] font-mono">VISA</span>
              <span className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#282828] font-mono">MC</span>
              <span className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#282828] font-mono">Pay</span>
              <span className="px-2 py-1 rounded bg-[#1A1A1A] border border-[#282828] font-mono">GPay</span>
            </div>

            {/* Secure Fabrication Card */}
            <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A] flex items-start gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Secure Fabrication</h4>
                <p className="text-[11px] text-[#777] leading-relaxed">
                  All custom models are deleted from our servers 30 days after production for your security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

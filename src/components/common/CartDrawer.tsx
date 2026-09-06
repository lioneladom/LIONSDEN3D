import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    setActivePage,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface border-l border-brand-border shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-card">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-red" />
              <h2 className="text-base font-bold font-display uppercase tracking-wider text-white">
                Your Print Order Cart ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-brand-surface text-brand-textMuted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-textDim">
                  <Box className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-brand-textDim max-w-xs">
                    Upload an STL model for instant quotation or browse pre-designed 3D products in our marketplace.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActivePage('configurator');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow-red-glow hover:bg-brand-redBright transition-all"
                >
                  Upload STL Model
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-brand-card border border-brand-border hover:border-brand-borderLight transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-brand-red/20 text-brand-red border border-brand-red/30">
                          {item.type === 'CUSTOM_STL' ? 'Custom Print' : 'Store Product'}
                        </span>
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-brand-textDim">{item.subtitle}</p>

                      {item.parts && item.parts.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.parts.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.5 rounded bg-brand-surface border border-white/10 text-[9px] font-mono text-brand-textDim"
                            >
                              Part {pIdx + 1}: {p.model.filename}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.priceBreakdown && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-brand-textDim pt-1">
                          <span>Est. {item.priceBreakdown.estimatedWeightGrams}g</span>
                          <span>•</span>
                          <span>{Math.round(item.priceBreakdown.estimatedPrintTimeMinutes / 60)}h print time</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-brand-textDim hover:text-brand-red transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-brand-border/60 flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-brand-border rounded-lg bg-brand-surface">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-brand-textMuted hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-brand-textMuted hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-brand-redBright">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-brand-border bg-brand-card space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-brand-textMuted">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-brand-textMuted">
                  <span>Estimated Production</span>
                  <span className="font-mono text-emerald-400">Within 24-48 Hours</span>
                </div>
                <div className="flex items-center justify-between text-brand-textMuted">
                  <span>Tolerance Guarantee</span>
                  <span className="font-mono text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-brand-red" /> ±0.05 mm
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  Order Total
                </span>
                <span className="text-xl font-extrabold font-mono text-brand-redBright">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActivePage('checkout');
                }}
                className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-red-glow transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2 text-center text-xs text-brand-textDim hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

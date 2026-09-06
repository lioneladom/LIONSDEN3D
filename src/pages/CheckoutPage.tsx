import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryMethod, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  Truck,
  User,
  Wallet,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    currentUser,
    createOrder,
    formatPrice,
    setActivePage,
    setSelectedOrderId,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Kwame Mensah');
  const [customerEmail, setCustomerEmail] = useState(
    currentUser?.email || 'kwame.mensah@techghana.com'
  );
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+233 24 819 4022');

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY_ACCRA');
  const [streetAddress, setStreetAddress] = useState('14 Independence Avenue, Ridge');
  const [city, setCity] = useState('Accra');
  const [region, setRegion] = useState('Greater Accra');
  const [deliveryNotes, setDeliveryNotes] = useState('Call on arrival at security gate');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOMO_MTN');
  const [momoNumber, setMomoNumber] = useState('+233 24 819 4022');

  const deliveryFee =
    deliveryMethod === 'DELIVERY_ACCRA'
      ? 25.0
      : deliveryMethod === 'DELIVERY_KUMASI'
      ? 45.0
      : deliveryMethod === 'DELIVERY_REGIONAL'
      ? 65.0
      : 0.0;

  const total = cartSubtotal + deliveryFee;

  const handlePlaceOrder = () => {
    // Launch celebratory particle confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E10600', '#FF2B20', '#FFFFFF', '#D4AF37'],
    });

    const newOrder = createOrder({
      customerName,
      customerEmail,
      customerPhone,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      total,
      paymentMethod,
      deliveryMethod,
      deliveryAddress: {
        street: streetAddress,
        city,
        region,
        notes: deliveryNotes,
      },
    });

    setSelectedOrderId(newOrder.id);
    setActivePage('order-confirmation');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No items in your checkout session</h2>
        <button
          onClick={() => setActivePage('configurator')}
          className="px-6 py-3 rounded-xl bg-brand-red text-white font-bold uppercase text-xs shadow-red-glow"
        >
          Start a Print
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8">
      {/* Header & Steps Progress Tracker */}
      <div className="space-y-4 border-b border-brand-border pb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-red font-bold">
              Secure Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-white">
              Complete Your 3D Print Order
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('cart')}
            className="text-xs font-mono text-brand-textDim hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </button>
        </div>

        {/* 4 Steps Indicator Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { num: 1, label: 'Contact' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review & Pay' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num <= step && setStep(s.num as any)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                step === s.num
                  ? 'bg-brand-red/10 border-brand-red text-white font-bold shadow-red-glow'
                  : step > s.num
                  ? 'bg-brand-card border-brand-border text-emerald-400 font-semibold'
                  : 'bg-brand-surface border-brand-border text-brand-textDim'
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Step 0{s.num}</div>
              <div className="text-xs truncate">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-step Form Views */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Contact Information */}
          {step === 1 && (
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4 animate-slide-up">
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-red" />
                <span>1. Contact & Customer Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-brand-textMuted">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-brand-textMuted">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-brand-textMuted">
                    Phone / WhatsApp (For Delivery & Print Updates)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery & Studio Pickup */}
          {step === 2 && (
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-5 animate-slide-up">
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-red" />
                <span>2. Fulfillment & Delivery Method</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'DELIVERY_ACCRA',
                    label: 'Accra Dispatch Express',
                    desc: 'Direct courier delivery within Greater Accra',
                    fee: 25.0,
                  },
                  {
                    id: 'STUDIO_PICKUP',
                    label: 'Studio Pickup (Spintex Rd)',
                    desc: 'Collect directly from our additive print lab',
                    fee: 0.0,
                  },
                  {
                    id: 'DELIVERY_KUMASI',
                    label: 'Kumasi Express',
                    desc: 'Overnight secure parcel transit to Kumasi',
                    fee: 45.0,
                  },
                  {
                    id: 'DELIVERY_REGIONAL',
                    label: 'Regional Ghana Dispatch',
                    desc: 'Western, Central, Eastern, Northern Regions',
                    fee: 65.0,
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setDeliveryMethod(opt.id as DeliveryMethod)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryMethod === opt.id
                        ? 'bg-brand-red/10 border-brand-red text-white shadow-red-glow'
                        : 'bg-brand-surface border-brand-border text-brand-textDim hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">{opt.label}</span>
                      <span className="text-xs font-mono font-bold text-brand-redBright">
                        {opt.fee === 0 ? 'FREE' : formatPrice(opt.fee)}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-textDim mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>

              {deliveryMethod !== 'STUDIO_PICKUP' ? (
                <div className="space-y-3 pt-2 border-t border-brand-border/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-brand-textMuted">Street Address</label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-brand-textMuted">City / Town</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-brand-textMuted">Region</label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-medium text-brand-textMuted">
                        Delivery Notes / Gate Instructions
                      </label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-brand-surface border border-brand-border text-xs font-mono space-y-1">
                  <div className="text-brand-red font-bold">Studio Pickup Location:</div>
                  <div className="text-white">Lion’s Den 3D Print Lab, Spintex Industrial Lane, Suite 4B, Accra</div>
                  <div className="text-brand-textDim">Hours: Monday – Saturday (08:00 – 19:00 GMT)</div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-brand-textDim hover:text-white"
                >
                  Back to Contact
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-5 animate-slide-up">
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-red" />
                <span>3. Select Payment Gateway</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'MOMO_MTN',
                    label: 'MTN Mobile Money',
                    icon: Smartphone,
                    desc: 'Instant prompt on your phone (Prompt *170#)',
                  },
                  {
                    id: 'MOMO_TELECEL',
                    label: 'Telecel Cash',
                    icon: Smartphone,
                    desc: 'Telecel Cash instant prompt verification',
                  },
                  {
                    id: 'CARD',
                    label: 'Credit / Debit Card',
                    icon: CreditCard,
                    desc: 'Visa, Mastercard 3D-Secure 256-bit encryption',
                  },
                  {
                    id: 'CRYPTO',
                    label: 'Crypto / USDT',
                    icon: Lock,
                    desc: 'USDT (TRC20 / ERC20) instant settlement',
                  },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-brand-red/10 border-brand-red text-white shadow-red-glow'
                          : 'bg-brand-surface border-brand-border text-brand-textDim hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                        <Icon className="w-4 h-4 text-brand-red" />
                        <span>{pm.label}</span>
                      </div>
                      <p className="text-[11px] text-brand-textDim leading-relaxed">{pm.desc}</p>
                    </div>
                  );
                })}
              </div>

              {(paymentMethod === 'MOMO_MTN' || paymentMethod === 'MOMO_TELECEL') && (
                <div className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-2 text-xs font-mono">
                  <label className="text-brand-textMuted block font-sans">
                    Mobile Money Wallet Number
                  </label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    placeholder="+233 24 000 0000"
                    className="w-full bg-brand-card border border-brand-border rounded-lg px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[11px] text-brand-textDim block">
                    You will receive an authorization prompt on this device when you place the order.
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-mono text-brand-textDim hover:text-white"
                >
                  Back to Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-red-glow"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Final Immutable Review */}
          {step === 4 && (
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-6 animate-slide-up">
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-white border-b border-brand-border pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-red" />
                <span>4. Final Order Verification</span>
              </h3>

              {/* Order items snapshot */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-brand-textDim uppercase font-bold">
                  Print Production Queue ({cart.length} items)
                </span>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-brand-textDim font-mono">
                        {item.subtitle} • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-white">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery & Customer Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border text-xs font-mono">
                <div>
                  <span className="text-brand-red font-bold block mb-1">Customer Details</span>
                  <div className="text-white">{customerName}</div>
                  <div className="text-brand-textDim">{customerEmail}</div>
                  <div className="text-brand-textDim">{customerPhone}</div>
                </div>

                <div>
                  <span className="text-brand-red font-bold block mb-1">Fulfillment & Payment</span>
                  <div className="text-white">{deliveryMethod}</div>
                  <div className="text-brand-textDim">
                    {deliveryMethod !== 'STUDIO_PICKUP' ? `${streetAddress}, ${city}` : 'Studio Pickup'}
                  </div>
                  <div className="text-emerald-400 font-semibold pt-1">
                    Gateway: {paymentMethod}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-mono text-brand-textDim hover:text-white"
                >
                  Edit Payment / Details
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-red-glow"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order ({formatPrice(total)})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary Sticky Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border space-y-4 shadow-xl">
            <h4 className="text-xs font-mono uppercase font-bold text-brand-textDim tracking-wider border-b border-brand-border pb-3">
              Order Breakdown
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-brand-textMuted">
                <span>Items Subtotal:</span>
                <span className="text-white">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Delivery / Dispatch:</span>
                <span className="text-white">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-brand-textMuted">
                <span>Micrometer Tolerance QC:</span>
                <span className="text-emerald-400">Included</span>
              </div>

              <div className="pt-3 border-t border-brand-border flex items-baseline justify-between">
                <span className="text-sm font-bold uppercase text-white font-display">
                  Total Payable:
                </span>
                <span className="text-2xl font-extrabold font-mono text-brand-redBright">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-surface border border-brand-border text-[11px] font-mono text-brand-textDim space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />
                <span>Production Guarantee</span>
              </div>
              <p>
                Every print undergoes dimensional tolerance inspection. Non-conforming parts are automatically re-printed at zero cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

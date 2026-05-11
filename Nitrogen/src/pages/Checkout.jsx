import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, CreditCard, CheckCircle2, ArrowRight, 
  ArrowLeft, ShieldCheck, Truck, Loader2, AlertCircle,
  Smartphone, Wallet
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { cn } from '../lib/utils';

const STEPS = ['Address', 'Payment', 'Confirmation'];

const INITIAL_ADDRESS = {
  street: '', city: '', state: '', zipCode: '', country: 'India'
};

const SHIPPING_FEE = 0;
const TAX_RATE = 0.18;

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  // Items might come from "Buy Now" state or from cart
  const checkoutItems = location.state?.buyNowItem ? [location.state.buyNowItem] : cart;
  const subtotal = location.state?.buyNowItem
    ? location.state.buyNowItem.price * location.state.buyNowItem.quantity
    : totalPrice;

  const taxAmount = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + SHIPPING_FEE + taxAmount;

  if (!isAuthenticated) {
    return (
      <div className="pt-40 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <ShieldCheck className="w-16 h-16 text-neon-lime/30 mx-auto mb-6" />
        <h1 className="text-3xl font-bold uppercase mb-4">Login Required</h1>
        <p className="text-white/40 mb-8">Please sign in to complete your purchase.</p>
        <Link
          to="/login"
          state={{ from: location }}
          className="px-10 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="pt-40 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold uppercase mb-4">No Items to Checkout</h1>
        <Link to="/shop" className="px-10 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    const { street, city, state, zipCode } = address;
    if (!street || !city || !state || !zipCode) {
      setError('Please fill in all address fields.');
      return false;
    }
    if (!/^\d{6}$/.test(zipCode)) {
      setError('Please enter a valid 6-digit PIN code.');
      return false;
    }
    setError('');
    return true;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const orderPayload = {
        products: checkoutItems.map(item => ({
          product: item.id || item._id,
          name: item.name || item.title,
          quantity: item.quantity,
          price: item.price,
          flavor: item.selectedFlavor || item.flavor,
          size: item.selectedSize || item.weight,
        })),
        shippingAddress: address,
        billingAddress: address,
        paymentMethod,
        shippingFee: SHIPPING_FEE,
        taxPrice: taxAmount,
        discountAmount: 0,
      };

      if (paymentMethod === 'COD') {
        // Create order directly for COD
        const res = await axiosClient.post('/orders', orderPayload);
        setOrderId(res.data.data.order._id);
        clearCart();
        setStep(2);
      } else {
        // Razorpay payment flow
        const loaded = await loadRazorpay();
        if (!loaded) {
          setError('Payment gateway failed to load. Please try again.');
          setIsProcessing(false);
          return;
        }

        // Create Razorpay order on backend
        let razorpayOrderId;
        try {
          const rzpRes = await axiosClient.post('/payments/razorpay/order', { 
            amount: grandTotal 
          });
          razorpayOrderId = rzpRes.data.data.id;
        } catch {
          // If payment endpoint not ready, use mock for demo
          razorpayOrderId = `order_demo_${Date.now()}`;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SnxA9A7gF51a3d',
          amount: grandTotal * 100, // paise
          currency: 'INR',
          name: 'Nitrogen Supplements',
          description: `Order for ${checkoutItems.length} item(s)`,
          order_id: razorpayOrderId,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: { color: '#c6f135' },
          handler: async (response) => {
            try {
              // Create order in our DB after payment success
              const res = await axiosClient.post('/orders', {
                ...orderPayload,
                paymentStatus: 'Completed',
                transactionId: response.razorpay_payment_id,
              });
              setOrderId(res.data.data.order._id);
              clearCart();
              setStep(2);
            } catch {
              setError('Payment succeeded but order creation failed. Please contact support.');
            }
            setIsProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setError('Payment was cancelled.');
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return; // don't set isProcessing false here, Razorpay handles it
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-matte-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold uppercase mb-4">
            Check<span className="text-neon-lime">out</span>
          </h1>

          {/* Step Progress */}
          <div className="flex items-center gap-3 mt-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    i < step ? "bg-neon-lime text-matte-black" : 
                    i === step ? "border-2 border-neon-lime text-neon-lime" : 
                    "border border-white/20 text-white/30"
                  )}>
                    {i < step ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-widest hidden sm:block",
                    i === step ? "text-white" : "text-white/30"
                  )}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-px max-w-24",
                    i < step ? "bg-neon-lime" : "bg-white/10"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">

              {/* STEP 0: Address */}
              {step === 0 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-neon-lime/10 flex items-center justify-center">
                      <MapPin className="text-neon-lime" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide">Delivery Address</h2>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                      <AlertCircle size={18} />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="bg-graphite/50 border border-white/5 rounded-2xl p-6 space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Street Address *</label>
                      <input
                        name="street" value={address.street} onChange={handleAddressChange}
                        placeholder="House/Flat No., Building, Street"
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">City *</label>
                        <input
                          name="city" value={address.city} onChange={handleAddressChange}
                          placeholder="Mumbai"
                          className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">State *</label>
                        <input
                          name="state" value={address.state} onChange={handleAddressChange}
                          placeholder="Maharashtra"
                          className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">PIN Code *</label>
                        <input
                          name="zipCode" value={address.zipCode} onChange={handleAddressChange}
                          placeholder="400001" maxLength={6}
                          className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Country</label>
                        <input
                          name="country" value={address.country} onChange={handleAddressChange}
                          className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { if (validateAddress()) setStep(1); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:bg-white transition-colors group"
                  >
                    Continue to Payment
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* STEP 1: Payment */}
              {step === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-neon-lime/10 flex items-center justify-center">
                      <CreditCard className="text-neon-lime" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide">Payment Method</h2>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                      <AlertCircle size={18} />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {[
                      { id: 'Razorpay', label: 'Razorpay', sublabel: 'UPI, Cards, Net Banking, Wallets', icon: Smartphone },
                      { id: 'COD', label: 'Cash on Delivery', sublabel: 'Pay when your order arrives', icon: Wallet },
                    ].map(({ id, label, sublabel, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left",
                          paymentMethod === id
                            ? "border-neon-lime bg-neon-lime/5"
                            : "border-white/10 bg-graphite/30 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          paymentMethod === id ? "bg-neon-lime text-matte-black" : "bg-white/10 text-white/60"
                        )}>
                          <Icon size={22} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold uppercase tracking-wide text-sm">{label}</p>
                          <p className="text-xs text-white/40 mt-0.5">{sublabel}</p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          paymentMethod === id ? "border-neon-lime" : "border-white/20"
                        )}>
                          {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-neon-lime" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Address Review */}
                  <div className="bg-graphite/30 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Delivering to</span>
                      <button onClick={() => setStep(0)} className="text-[10px] text-neon-lime uppercase tracking-widest font-bold hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-white/80">{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(0)}
                      className="flex items-center gap-2 px-6 py-4 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 flex items-center justify-center gap-3 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isProcessing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <>
                          {paymentMethod === 'COD' ? 'Place Order' : 'Pay Now'}
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Confirmation */}
              {step === 2 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-24 h-24 bg-neon-lime rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 size={48} className="text-matte-black" />
                  </motion.div>
                  <h2 className="text-4xl font-display font-bold uppercase mb-4">
                    Order <span className="text-neon-lime">Confirmed!</span>
                  </h2>
                  <p className="text-white/40 mb-4 max-w-md mx-auto">
                    Your order has been placed successfully. We'll send you a confirmation shortly.
                  </p>
                  {orderId && (
                    <div className="inline-block bg-graphite border border-white/10 rounded-xl px-6 py-3 mb-8">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Order ID</span>
                      <p className="text-sm font-mono text-neon-lime mt-1">{orderId}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/shop" className="px-8 py-4 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-colors">
                      Continue Shopping
                    </Link>
                    <Link to="/" className="px-8 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors">
                      Go Home
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          {step < 2 && (
            <div className="lg:col-span-5">
              <div className="sticky top-32 bg-graphite/50 border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold uppercase tracking-widest pb-4 border-b border-white/5">
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {checkoutItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-matte-black overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={item.image} alt={item.name || item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm uppercase truncate">{item.name || item.title}</p>
                        <p className="text-xs text-white/40">{item.selectedFlavor} · {item.selectedSize} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2"><Truck size={14} /> Shipping</span>
                    <span>₹{SHIPPING_FEE}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>GST (18%)</span>
                    <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-neon-lime">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: ShieldCheck, text: 'Secure Payment' },
                    { icon: Truck, text: 'Fast Delivery' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                      <Icon size={16} className="text-neon-lime flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [step, setStep] = useState(1);

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 min-h-screen container mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-graphite rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
           <ShoppingBag size={40} className="text-white/20" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6">Your stack is <span className="text-neon-lime">empty</span></h1>
        <p className="text-white/40 mb-10 max-w-md mx-auto uppercase tracking-widest text-xs font-bold">You haven't added any elite performance solutions yet.</p>
        <Link to="/shop" className="px-12 py-5 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:neon-glow transition-all inline-block">
          Explore Armory
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-matte-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-12">Check<span className="text-neon-lime">out</span></h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.selectedFlavor}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex flex-col sm:flex-row items-center bg-graphite rounded-2xl p-6 relative group overflow-hidden border",
                      (item.isOutOfStock || item.stock === 0) ? "border-red-500/30 bg-red-500/5" : "border-white/5"
                    )}
                  >
                    <div className="w-full sm:w-32 aspect-square rounded-xl overflow-hidden mb-6 sm:mb-0 sm:mr-8 bg-matte-black">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neon-lime font-bold">{item.brand}</span>
                        <h3 className="text-xl font-display font-bold uppercase group-hover:text-neon-lime transition-colors">{item.name}</h3>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">
                        <span className="bg-white/5 px-2 py-1 rounded">{item.selectedFlavor}</span>
                        <span className="bg-white/5 px-2 py-1 rounded">{item.selectedSize}</span>
                        {(item.isOutOfStock || item.stock === 0) ? (
                          <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded">Out of Stock</span>
                        ) : (
                          <span className="bg-neon-lime/10 text-neon-lime px-2 py-1 rounded">In Stock</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                         <div className="flex items-center space-x-1 bg-matte-black rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, item.selectedFlavor, item.selectedSize, item.quantity - 1)} className="p-2 hover:text-neon-lime border border-transparent"><Minus size={14} /></button>
                            <span className="w-10 text-center font-display font-bold text-lg">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedFlavor, item.selectedSize, item.quantity + 1)} className="p-2 hover:text-neon-lime border border-transparent"><Plus size={14} /></button>
                         </div>
                         <div className="text-2xl font-display font-bold text-soft-white">
                           ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                         </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedFlavor, item.selectedSize)}
                      className="absolute top-4 right-4 p-2 text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="glass-morphism p-8 rounded-3xl border border-neon-lime/10">
                <h3 className="text-2xl font-display font-bold uppercase mb-8 pb-4 border-b border-white/5 flex items-center">
                  <CreditCard className="mr-3 text-neon-lime" />
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-sm uppercase tracking-widest text-white/40 font-bold">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm uppercase tracking-widest text-white/40 font-bold">
                    <span>Elite Shipping</span>
                    <span className="text-neon-lime uppercase">Calculated in next step</span>
                  </div>
                  <div className="h-px bg-white/5 my-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-display font-bold uppercase">Total Energy</span>
                    <span className="text-3xl font-display font-bold text-soft-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/checkout" className="w-full py-5 bg-neon-lime text-matte-black font-bold uppercase tracking-widest flex items-center justify-center space-x-3 transition-all hover:neon-glow-strong">
                    <span>Initiate Transaction</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/shop" className="w-full py-5 bg-white/5 text-white/60 font-bold uppercase tracking-widest text-center hover:bg-white/10 transition-all">
                    Continue Foraging
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: ShieldCheck, title: 'Secure Protocol', text: 'AES-256 military grade encryption' },
                  { icon: Truck, title: 'Elite Delivery', text: '48h dispatch on all domestic orders' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-white/5 rounded-xl bg-graphite/30">
                    <div className="w-10 h-10 rounded-lg bg-neon-lime/10 flex items-center justify-center text-neon-lime flex-shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.title}</h4>
                      <p className="text-[10px] text-white/30">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

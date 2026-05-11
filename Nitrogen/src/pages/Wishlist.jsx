import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, ShoppingCart, Ghost } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 min-h-screen container mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-graphite rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
           <Heart size={40} className="text-white/20" />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-6">Wishlist is <span className="text-neon-lime">dormant</span></h1>
        <p className="text-white/40 mb-10 max-w-md mx-auto uppercase tracking-widest text-xs font-bold">You haven't targeted any products for your future protocol.</p>
        <Link to="/shop" className="px-12 py-5 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:neon-glow transition-all inline-block">
          Find Your Target
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-matte-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-4">Desired <span className="text-neon-lime">Gear</span></h1>
            <p className="text-white/40 uppercase tracking-[0.2em] text-sm">Targets ready for extraction</p>
          </div>
          <p className="text-white/40 font-display text-4xl font-bold">{wishlist.length} <span className="text-xs uppercase tracking-widest">Units</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

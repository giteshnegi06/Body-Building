import React from "react";
import { motion } from "motion/react";
import { ShoppingCart, Heart, Star, Plus, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { cn } from "../../lib/utils";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  // Safe defaults — works with both API products and mock products
  const name = product.name || product.title || "Unnamed Product";
  const brand = product.brand || "Nitrogen";
  const price = product.price || 0;
  const origPrice =
    product.originalPrice && product.originalPrice > price
      ? product.originalPrice
      : null;
  const image = product.image || (product.images && product.images[0]) || null;
  const rating = product.rating || product.ratings || 4.5;
  const reviewsCount = product.reviewsCount || product.reviews || 0;
  const features = Array.isArray(product.features) ? product.features : [];
  const flavors = Array.isArray(product.flavors)
    ? product.flavors
    : Array.isArray(product.flavor)
      ? product.flavor
      : [];
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : Array.isArray(product.weight)
      ? product.weight
      : [];
  const isBestSeller = product.isBestSeller || product.bestSeller || false;
  const isNew = product.isNew || false;
  const discount = origPrice
    ? Math.round(((origPrice - price) / origPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(
      { ...product, name, image, flavors, sizes },
      flavors[0] || "Default",
      sizes[0] || "Standard",
      1,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-graphite rounded-2xl overflow-hidden border border-white/5 hover:border-neon-lime/20 transition-all duration-500 flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex  gap-1.5">
        {isBestSeller && (
          <span className="bg-neon-lime text-matte-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
            Best Seller
          </span>
        )}
        {isNew && (
          <span className="bg-white text-matte-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
            New
          </span>
        )}
        {(product.isOutOfStock || product.stock === 0) && (
          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
            Out Of Stock
          </span>
        )}
        {discount >= 5 && (
          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-sm">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist */}
      <div className="absolute top-3 right-3 z-10 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({ ...product, name, image });
          }}
          className={cn(
            "p-2 rounded-full border transition-all",
            liked
              ? "bg-red-500 border-red-500 text-white"
              : "bg-matte-black/70 border-white/10 text-white hover:bg-neon-lime hover:text-matte-black hover:border-neon-lime",
          )}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden bg-matte-black"
        style={{ aspectRatio: "1/1" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent opacity-50 z-[1]" />
        {image ? (
          <motion.img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap size={48} className="text-neon-lime/20" />
          </div>
        )}
        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-neon-lime/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full z-[2]" />
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">
          {brand}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="text-sm font-bold leading-snug group-hover:text-neon-lime transition-colors line-clamp-2 mb-3"
        >
          {name}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className={cn(
                i < Math.floor(rating)
                  ? "text-neon-lime fill-neon-lime"
                  : "text-white/15",
              )}
            />
          ))}
          <span className="text-[10px] text-white/30 ml-1">
            {reviewsCount > 0 ? `(${reviewsCount.toLocaleString()})` : ""}
          </span>
        </div>

        {/* Feature pills — only shown if features exist */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {features.slice(0, 2).map((f, i) => (
              <span
                key={i}
                className="text-[9px] px-2 py-0.5 border border-white/10 rounded-full text-white/50"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="mt-auto flex items-end justify-between pt-2 border-t border-white/5">
          <div>
            {origPrice && (
              <span className="text-xs text-white/30 line-through block">
                ₹{origPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xl font-display font-bold text-soft-white">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-9 h-9 bg-white/10 hover:bg-neon-lime text-white hover:text-matte-black rounded-xl flex items-center justify-center transition-all group/btn flex-shrink-0"
          >
            <Plus
              size={18}
              className="group-hover/btn:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

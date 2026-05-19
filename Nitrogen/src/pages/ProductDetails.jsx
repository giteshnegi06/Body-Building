import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Heart, ShoppingCart, ShieldCheck, Zap, Info,
  ChevronRight, ArrowLeft, Plus, Minus, Share2, Award,
  FlaskConical, CheckCircle2, Loader2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { cn } from '../lib/utils';
import ProductCard from '../components/shop/ProductCard';
import axiosClient from '../api/axiosClient';

const normalise = (p) => ({
  id: p._id || p.id,
  name: p.title || p.name,
  brand: p.brand || 'Nitrogen',
  price: p.discountPrice || p.price || 0,
  originalPrice: p.originalPrice || (p.discountPrice && p.price > p.discountPrice ? p.price : null),
  image: (p.images && p.images[0]) || p.image || null,
  images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
  category: typeof p.category === 'object' ? (p.category?.slug || p.category?.name) : p.category,
  subCategory: p.subCategory,
  rating: p.ratings || p.rating || 4.5,
  reviewsCount: p.reviewsCount || p.reviews || 0,
  features: Array.isArray(p.features) ? p.features : [],
  ingredients: Array.isArray(p.ingredients) ? p.ingredients : (p.ingredients ? p.ingredients.split(',').map(s => s.trim()) : []),
  nutritionFacts: Array.isArray(p.nutritionFacts) ? p.nutritionFacts : [],
  featured: p.featured || false,
  bestSeller: p.bestSeller || false,
  isBestSeller: p.isBestSeller || p.bestSeller || false,
  isNew: p.isNew || false,
  stock: p.stock ?? 99,
  isOutOfStock: p.isOutOfStock || false,
  flavors: p.flavor || p.flavors || [],
  sizes: p.variants && p.variants.length > 0 ? p.variants.map(v => v.weight) : (p.weight || p.sizes || []),
  variants: p.variants || [],
  description: p.description || p.shortDescription || '',
  usage: p.usage || p.usageInstructions || '',
  createdAt: p.createdAt,
});

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [showNotifyEmail, setShowNotifyEmail] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const activeVariant = product?.variants?.find(v => v.weight === selectedSize);
  const currentPrice = activeVariant ? (activeVariant.discountPrice || activeVariant.price) : (product?.price || 0);
  const currentOriginalPrice = activeVariant ? (activeVariant.discountPrice ? activeVariant.price : null) : product?.originalPrice;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/products/${id}`);
        const p = normalise(res.data.data.product);
        setProduct(p);
        setSelectedFlavor(p.flavors[0] || '');
        setSelectedSize(p.sizes[0] || '');
        setSelectedImage(p.images[0] || null);
      } catch (err) {
        const mockP = PRODUCTS.find((p) => p.id === id);
        if (mockP) {
          const p = normalise(mockP);
          setProduct(p);
          setSelectedFlavor(p.flavors[0] || '');
          setSelectedSize(p.sizes[0] || '');
          setSelectedImage(p.images[0] || null);
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 flex justify-center items-center h-screen bg-matte-black">
        <Loader2 className="animate-spin text-neon-lime" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-20 text-center px-4">
        <h1 className="text-4xl font-display font-bold uppercase mb-4">Asset Not Found</h1>
        <p className="text-white/40 mb-8">This supplement hash does not exist in our systems.</p>
        <Link to="/shop" className="px-10 py-4 bg-neon-lime text-matte-black font-bold uppercase tracking-widest">Back to Armory</Link>
      </div>
    );
  }

  const liked = isInWishlist(product.id);

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 bg-matte-black min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          <Link to="/" className="hover:text-neon-lime whitespace-nowrap">Home</Link>
          <ChevronRight size={10} className="flex-shrink-0" />
          <Link to="/shop" className="hover:text-neon-lime whitespace-nowrap">Shop</Link>
          <ChevronRight size={10} className="flex-shrink-0" />
          <span className="text-neon-lime truncate">{product.name}</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-graphite group"
            >
              <img src={selectedImage || product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "p-4 rounded-full border border-white/10 transition-all",
                    liked ? "bg-red-600 border-red-600" : "bg-matte-black/60 hover:bg-neon-lime hover:text-matte-black"
                  )}
                >
                  <Heart size={24} fill={liked ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-neon-lime text-matte-black text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap">Authentic</span>
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap">Lab Tested</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setSelectedImage(img)} className={cn("aspect-square bg-graphite rounded-xl overflow-hidden cursor-pointer transition-opacity border-2", selectedImage === img ? "border-neon-lime opacity-100" : "border-transparent opacity-40 hover:opacity-100")}>
                  <img src={img} alt="prev" className="w-full h-full object-cover grayscale" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-neon-lime font-bold tracking-[0.3em] uppercase text-xs mb-4 block">{product.brand} Performance</span>
              <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight mb-4">{product.name}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center text-neon-lime">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  <span className="ml-2 text-soft-white font-bold">{product.rating}</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-white/20" />
                <span className="text-white/40 text-sm uppercase tracking-widest">{product.reviewsCount} Verified Reviews</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-4xl font-display font-bold text-soft-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                {currentOriginalPrice && (
                  <span className="text-2xl font-display font-bold text-white/20 line-through">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
                )}
                <span className="bg-neon-lime/10 text-neon-lime px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border border-neon-lime/20 whitespace-nowrap">Free Shipping</span>
              </div>
            </div>

            <p className="text-white/60 text-lg font-light leading-relaxed mb-10 border-l-2 border-neon-lime/30 pl-6">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-8 mb-10">
              {product.flavors.length > 0 && product.flavors[0] !== 'Unflavored' && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Choose Flavor</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={cn(
                          "px-6 py-3 border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                          selectedFlavor === flavor ? "border-neon-lime bg-neon-lime text-matte-black" : "border-white/10 text-white/50 hover:border-white/30"
                        )}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Choose Size</h4>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-6 py-3 border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                        selectedSize === size ? "border-neon-lime bg-neon-lime text-matte-black" : "border-white/10 text-white/50 hover:border-white/30"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Quantity</h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center space-x-1 bg-graphite rounded-lg p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-neon-lime"><Minus size={16} /></button>
                    <span className="w-12 text-center font-display font-bold text-xl">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-neon-lime"><Plus size={16} /></button>
                  </div>
                  <div className="text-white/30 text-xs font-bold uppercase tracking-widest">
                    {product.isOutOfStock || product.stock === 0 ? 'Out of Stock' : 'In Stock & Ready'}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              {product.isOutOfStock || product.stock === 0 ? (
                <>
                  <button
                    disabled
                    className="flex-1 py-5 bg-neon-lime/20 text-white/20 font-bold uppercase tracking-widest flex items-center justify-center space-x-3 cursor-not-allowed border border-white/5"
                  >
                    <ShoppingCart size={20} />
                    <span>Out of Stock</span>
                  </button>
                  {showNotifyEmail ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 bg-graphite border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-lime transition-colors text-white"
                      />
                      <button
                        onClick={() => {
                          alert(`Will notify ${notifyEmail} when back in stock!`);
                          setShowNotifyEmail(false);
                          setNotifyEmail('');
                        }}
                        className="px-6 py-2 bg-neon-lime text-matte-black font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNotifyEmail(true)}
                      className="flex-1 py-5 bg-soft-white text-matte-black font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-white transition-all"
                    >
                      <span>Notify Me</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => addToCart(product, selectedFlavor, selectedSize, quantity)}
                    className="flex-1 py-5 bg-neon-lime text-matte-black font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:shadow-[0_0_40px_rgba(204,255,0,0.3)] transition-all"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Stack</span>
                  </button>
                  <button
                    onClick={() => navigate('/checkout', {
                      state: {
                        buyNowItem: {
                          id: product.id,
                          name: product.name,
                          price: currentPrice,
                          image: product.images[0] || product.image,
                          quantity,
                          selectedFlavor,
                          selectedSize,
                        }
                      }
                    })}
                    className="flex-1 py-5 bg-soft-white text-matte-black font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-white transition-all"
                  >
                    <span>Buy Now</span>
                  </button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-white/5">
              {[
                { icon: ShieldCheck, label: 'Authentic Gear' },
                { icon: Award, label: 'ISO Certified' },
                { icon: FlaskConical, label: 'Lab Proven' },
                { icon: CheckCircle2, label: 'FDA Approved' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                  <badge.icon size={24} className="text-neon-lime" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-graphite/30 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 mb-12 -mx-4 px-4 md:mx-0 md:px-0">
            {[
              { id: 'info', label: 'Detailed Specs', icon: Info },
              { id: 'nutrition', label: 'Nutrition Facts', icon: FlaskConical },
              { id: 'usage', label: 'Usage Protocol', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap flex-shrink-0",
                  activeTab === tab.id ? "text-neon-lime" : "text-white/40 hover:text-white"
                )}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-neon-lime" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                >
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-2xl font-display font-bold uppercase mb-6 text-neon-lime">Core Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-center space-x-3 py-3 border-b border-white/5">
                            <CheckCircle2 size={16} className="text-neon-lime" />
                            <span className="text-sm text-white/70">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold uppercase mb-6 text-neon-lime">Ingredients</h4>
                      <p className="text-white/50 leading-relaxed font-light">{product.ingredients.length > 0 ? product.ingredients.join(', ') : 'Ingredients information not available.'}</p>
                    </div>
                  </div>
                  <div className="bg-matte-black/50 p-10 rounded-2xl border border-white/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full border-2 border-neon-lime flex items-center justify-center mx-auto mb-6 text-neon-lime">
                        <ShieldCheck size={32} />
                      </div>
                      <h4 className="text-xl font-display font-bold uppercase mb-4">Zero Banned Substances</h4>
                      <p className="text-white/40 text-sm max-w-xs mx-auto">This product is rigorously screened for over 250 prohibited substances in modern sport.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'nutrition' && (
                <motion.div
                  key="nutrition"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto bg-white text-matte-black p-6 md:p-12 border-4 border-matte-black shadow-[8px_8px_0px_#ccff00] md:shadow-[15px_15px_0px_#ccff00]"
                >
                  <h3 className="text-4xl font-display font-black uppercase text-center mb-1">Nutrition Facts</h3>
                  <div className="h-3 bg-matte-black mb-4" />

                  <div className="font-bold border-b border-matte-black py-1 flex justify-between">
                    <span>Amount Per Serving</span>
                    <span>% Daily Value*</span>
                  </div>
                  {product.nutritionFacts && product.nutritionFacts.length > 0 ? (
                    product.nutritionFacts.map((fact, i) => (
                      <div key={i} className="flex justify-between border-b border-matte-black py-2">
                        <span className="font-bold uppercase">{fact.label}</span>
                        <div className="flex gap-4">
                          <span className="font-bold uppercase">{fact.amount}</span>
                          {fact.dailyValue && <span className="font-bold uppercase w-12 text-right">{fact.dailyValue}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center italic opacity-70">Nutrition facts not provided.</div>
                  )}

                  <div className="mt-8 text-[10px] leading-tight opacity-70">
                    * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                  </div>
                </motion.div>
              )}

              {activeTab === 'usage' && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {[
                    { title: 'Training Day', icon: Zap, text: product.usage },
                    { title: 'Rest Day', icon: Award, text: 'Take 1 serving in the morning with a meal to maintain serum saturation levels.' },
                    { title: 'Hybrid Protocol', icon: ShieldCheck, text: 'Can be stacked with EAA Matrix for intra-workout dominance.' },
                  ].map((step, i) => (
                    <div key={i} className="glass-morphism p-10 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <step.icon size={80} />
                      </div>
                      <h4 className="text-2xl font-display font-bold uppercase mb-6 text-neon-lime">{step.title}</h4>
                      <p className="text-white/60 leading-relaxed font-light">{step.text}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-neon-lime font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Expand the stack</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">Related <span className="italic text-neon-lime">Compounds</span></h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SlidersHorizontal, Search, X, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '../data/products';
import { cn } from '../lib/utils';
import axiosClient from '../api/axiosClient';
import { useLocation } from 'react-router-dom';

const CATEGORIES = ['all', 'protein', 'pre-workout', 'creatine', 'mass-gainer', 'vitamins', 'amino-acids', 'fat-burner'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

// Normalise a product from either API or static mock into a unified shape
const normalise = (p) => ({
  id:            p._id || p.id,
  name:          p.title || p.name,
  brand:         p.brand || 'Nitrogen',
  price:         p.discountPrice || p.price || 0,
  originalPrice: p.originalPrice || (p.discountPrice && p.price > p.discountPrice ? p.price : null),
  image:         (p.images && p.images[0]) || p.image || null,
  category:      typeof p.category === 'object' ? (p.category?.slug || p.category?.name) : p.category,
  subCategory:   p.subCategory,
  rating:        p.ratings || p.rating || 4.5,
  reviewsCount:  p.reviewsCount || p.reviews || 0,
  features:      p.features || [],
  featured:      p.featured || false,
  bestSeller:    p.bestSeller || false,
  isBestSeller:  p.isBestSeller || p.bestSeller || false,
  isNew:         p.isNew || false,
  stock:         p.stock ?? 99,
  flavors:       p.flavor || p.flavors || [],
  sizes:         p.weight || p.sizes || [],
  description:   p.description || p.shortDescription || '',
  usage:         p.usage || p.usageInstructions || '',
  createdAt:     p.createdAt,
});

export default function Shop() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingMock, setUsingMock] = useState(false);

  const [activeCategory, setActiveCategory] = useState(params.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/products?limit=100');
      const apiProducts = res.data.data.products || [];

      if (apiProducts.length > 0) {
        setProducts(apiProducts.map(normalise));
        setUsingMock(false);
      } else {
        // No DB products yet — show mock data
        setProducts(MOCK_PRODUCTS.map(normalise));
        setUsingMock(true);
      }
    } catch {
      // Backend unreachable — fallback to mock
      setProducts(MOCK_PRODUCTS.map(normalise));
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Sync URL params
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    if (newParams.get('category')) setActiveCategory(newParams.get('category'));
    if (newParams.get('search')) setSearchQuery(newParams.get('search'));
    if (newParams.get('filter') === 'bestseller') setSortBy('bestseller');
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory || p.subCategory?.toLowerCase() === activeCategory;
        const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'bestseller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, sortBy, searchQuery, priceRange]);

  return (
    <div className="pt-24 min-h-screen bg-matte-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-4">
            The <span className="text-neon-lime">Armory</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm">Fuel your ambition with elite grade nutrition</p>
          {usingMock && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
              <AlertCircle size={14} /> Showing demo products — add real products via Admin Panel
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-graphite border border-white/5 rounded-lg py-4 pl-12 pr-10 text-sm font-display uppercase tracking-widest outline-none focus:border-neon-lime/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="p-3 bg-graphite border border-white/5 rounded-lg hover:bg-white/5 transition-colors"
              title="Refresh products"
            >
              <RefreshCw size={16} className={cn('text-neon-lime', loading && 'animate-spin')} />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn('flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all', isFilterOpen ? 'bg-neon-lime text-matte-black' : 'bg-graphite hover:bg-white/5')}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-graphite border border-white/5 rounded-lg py-3 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-neon-lime/30 text-white"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-graphite/50 border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            'px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all',
                            activeCategory === cat ? 'bg-neon-lime text-matte-black' : 'bg-white/5 text-white/50 hover:bg-white/10'
                          )}
                        >
                          {cat === 'all' ? 'All' : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
                      Price Range: ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                    </h3>
                    <input
                      type="range" min={0} max={10000} step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-neon-lime"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            {loading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
          {activeCategory !== 'all' && (
            <button onClick={() => setActiveCategory('all')} className="flex items-center gap-1 text-xs text-neon-lime hover:underline">
              <X size={12} /> Clear filter
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-neon-lime animate-spin" />
            <p className="text-white/30 text-sm uppercase tracking-widest">Loading arsenal...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <Search size={48} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-2xl font-bold uppercase mb-2">No Products Found</h3>
            <p className="text-white/40 text-sm">Try adjusting your filters or search query.</p>
            <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="mt-6 px-6 py-3 bg-neon-lime text-matte-black font-bold uppercase text-xs tracking-widest rounded-xl">
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

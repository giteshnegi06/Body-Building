import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";
import ProductCard from "../components/shop/ProductCard";
import { PRODUCTS as MOCK_PRODUCTS } from "../data/products";
import { cn } from "../lib/utils";
import axiosClient from "../api/axiosClient";
import { useLocation } from "react-router-dom";

const CATEGORIES = [
  "all",
  "protein",
  "pre-workout",
  "creatine",
  "mass-gainer",
  "vitamins",
  "amino-acids",
  "fat-burner",
];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

// Normalise a product from either API or static mock into a unified shape
const normalise = (p) => ({
  id: p._id || p.id,
  name: p.title || p.name,
  brand: p.brand || "Nitrogen",
  price: p.discountPrice || p.price || 0,
  originalPrice:
    p.originalPrice ||
    (p.discountPrice && p.price > p.discountPrice ? p.price : null),
  image: (p.images && p.images[0]) || p.image || null,
  category:
    typeof p.category === "object"
      ? p.category?.slug || p.category?.name
      : p.category,
  subCategory: p.subCategory,
  rating: p.ratings || p.rating || 4.5,
  reviewsCount: p.reviewsCount || p.reviews || 0,
  features: p.features || [],
  featured: p.featured || false,
  bestSeller: p.bestSeller || false,
  isBestSeller: p.isBestSeller || p.bestSeller || false,
  isNew: p.isNew || false,
  isOutOfStock: p.isOutOfStock || p.stock === 0 || false,
  stock: p.stock ?? 99,
  flavors: p.flavor || p.flavors || [],
  sizes: p.weight || p.sizes || [],
  description: p.description || p.shortDescription || "",
  usage: p.usage || p.usageInstructions || "",
  createdAt: p.createdAt,
  goal: p.goal || "",
  dietaryPreference: p.dietaryPreference || p.dietary || "",
  proteinPerServing: p.proteinPerServing || p.protein || 0,
});

export default function Shop() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingMock, setUsingMock] = useState(false);

  const [activeCategory, setActiveCategory] = useState(
    params.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // New Filters
  const [selectedFlavor, setSelectedFlavor] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState("all");
  const [dietary, setDietary] = useState("all");
  const [minProtein, setMinProtein] = useState(0);
  const [availability, setAvailability] = useState("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const resetAllFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setPriceRange([0, 10000]);
    setSelectedFlavor("all");
    setSelectedBrand("all");
    setMinRating(0);
    setSelectedGoal("all");
    setDietary("all");
    setMinProtein(0);
    setAvailability("all");
    setShowFeaturedOnly(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/products?limit=100");
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync URL params
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    setActiveCategory(newParams.get("category") || "all");
    setSearchQuery(newParams.get("search") || "");
    if (newParams.get("filter") === "bestseller") {
      setSortBy("bestseller");
    } else if (newParams.get("filter") === "stacks") {
      // If we had a stacks sort or filter, we could handle it. Currently no "stacks" sort.
      setSortBy("featured"); // Fallback
    } else {
      // Optional: reset sort if no filter or keep current
    }
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const pCategorySlug = (p.category || "").toLowerCase().replace(/\s+/g, '-');
        const matchesCategory =
          activeCategory === "all" ||
          pCategorySlug === activeCategory ||
          p.subCategory?.toLowerCase() === activeCategory;
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice =
          p.price >= priceRange[0] && p.price <= priceRange[1];

        const matchesFlavor =
          selectedFlavor === "all" ||
          (p.flavors &&
            p.flavors.some(
              (f) => f.toLowerCase() === selectedFlavor.toLowerCase(),
            ));
        const matchesBrand =
          selectedBrand === "all" ||
          p.brand?.toLowerCase() === selectedBrand.toLowerCase();
        const matchesRating = p.rating >= minRating;
        const matchesGoal =
          selectedGoal === "all" ||
          p.goal?.toLowerCase() === selectedGoal.toLowerCase();
        const matchesDietary =
          dietary === "all" ||
          (dietary === "veg"
            ? p.dietaryPreference?.toLowerCase() === "veg" ||
            p.dietaryPreference?.toLowerCase() === "vegetarian"
            : p.dietaryPreference?.toLowerCase() === "non-veg" ||
            p.dietaryPreference?.toLowerCase() === "non-vegetarian");
        const matchesProtein = p.proteinPerServing >= minProtein;
        const matchesAvailability =
          availability === "all" ||
          (availability === "in-stock" ? !p.isOutOfStock : p.isOutOfStock);
        const matchesFeatured = showFeaturedOnly ? p.featured : true;

        return (
          matchesCategory &&
          matchesSearch &&
          matchesPrice &&
          matchesFlavor &&
          matchesBrand &&
          matchesRating &&
          matchesGoal &&
          matchesDietary &&
          matchesProtein &&
          matchesAvailability &&
          matchesFeatured
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest")
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === "bestseller")
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    activeCategory,
    sortBy,
    searchQuery,
    priceRange,
    selectedFlavor,
    selectedBrand,
    minRating,
    selectedGoal,
    dietary,
    minProtein,
    availability,
    showFeaturedOnly,
  ]);

  return (
    <div className="pt-24 min-h-screen bg-matte-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase mb-4">
            The <span className="text-neon-lime">Armory</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm">
            Fuel your ambition with elite grade nutrition
          </p>
          {usingMock && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">
              <AlertCircle size={14} /> Showing demo products — add real
              products via Admin Panel
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/5">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              size={18}
            />
            <input
              type="text"
              placeholder="SEARCH PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-graphite border border-white/5 rounded-lg py-4 pl-12 pr-10 text-sm font-display uppercase tracking-widest outline-none focus:border-neon-lime/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={fetchProducts}
              className="p-3 bg-graphite border border-white/5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              title="Refresh products"
            >
              <RefreshCw
                size={16}
                className={cn("text-neon-lime", loading && "animate-spin")}
              />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex-1 sm:flex-none",
                isFilterOpen
                  ? "bg-neon-lime text-matte-black"
                  : "bg-graphite hover:bg-white/5",
              )}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-graphite/50 border border-white/5 rounded-2xl p-6">
                {/* Top Row */}
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                            activeCategory === cat
                              ? "bg-neon-lime text-matte-black"
                              : "bg-white/5 text-white/50 hover:bg-white/10",
                          )}
                        >
                          {cat === "all" ? "All" : cat.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
                      Price Range: ₹{priceRange[0].toLocaleString()} – ₹
                      {priceRange[1].toLocaleString()}
                    </h3>
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, Number(e.target.value)])
                      }
                      className="w-full accent-neon-lime"
                    />
                  </div>
                </div>

                {/* Grid Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Featured
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Flavor
                    </h3>
                    <select
                      value={selectedFlavor}
                      onChange={(e) => setSelectedFlavor(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      <option value="all">All Flavors</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="vanilla">Vanilla</option>
                      <option value="strawberry">Strawberry</option>
                      <option value="unflavored">Unflavored</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Brand
                    </h3>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      <option value="all">All Brands</option>
                      <option value="nitrogen">Nitrogen</option>
                      <option value="optimum nutrition">
                        Optimum Nutrition
                      </option>
                      <option value="muscleblaze">MuscleBlaze</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Goal
                    </h3>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      <option value="all">Any Goal</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="recovery">Recovery</option>
                      <option value="energy">Energy</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Availability
                    </h3>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Dietary
                    </h3>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full bg-matte-black border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-neon-lime"
                    >
                      <option value="all">Any</option>
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Min. Rating
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[0, 3, 4, 4.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setMinRating(rate)}
                          className={cn(
                            "flex-1 py-2 px-2 text-xs rounded-lg border border-white/10 transition-colors whitespace-nowrap",
                            minRating === rate
                              ? "bg-neon-lime text-matte-black"
                              : "bg-matte-black text-white hover:bg-white/5",
                          )}
                        >
                          {rate === 0 ? "Any" : `${rate}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                      Min Protein: {minProtein}g
                    </h3>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={minProtein}
                      onChange={(e) => setMinProtein(Number(e.target.value))}
                      className="w-full accent-neon-lime mt-2"
                    />
                  </div>

                </div>

                {/* Reset All Filters */}
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20 text-white/50 text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
                  >
                    <X size={14} /> Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            {loading
              ? "Loading..."
              : `${filteredProducts.length} products found`}
          </p>
          {(activeCategory !== "all" || searchQuery || priceRange[1] < 10000 || selectedFlavor !== "all" || selectedBrand !== "all" || minRating > 0 || selectedGoal !== "all" || dietary !== "all" || minProtein > 0 || availability !== "all" || showFeaturedOnly) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-neon-lime hover:underline"
            >
              <X size={12} /> Reset all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-neon-lime animate-spin" />
            <p className="text-white/30 text-sm uppercase tracking-widest">
              Loading arsenal...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <Search size={48} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-2xl font-bold uppercase mb-2">
              No Products Found
            </h3>
            <p className="text-white/40 text-sm">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-6 px-6 py-3 bg-neon-lime text-matte-black font-bold uppercase text-xs tracking-widest rounded-xl"
            >
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

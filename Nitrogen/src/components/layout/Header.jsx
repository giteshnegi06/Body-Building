import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Heart, Search, Menu, X, User, LogOut,
  Settings, Package, Gift, ChevronDown, Dumbbell, Zap,
  FlaskConical, Star, Layers, Coffee, Shield, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const CATEGORIES = [
  { name: 'Whey Protein', icon: Dumbbell, slug: 'protein', badge: 'Popular' },
  { name: 'Pre-Workout', icon: Zap, slug: 'pre-workout', badge: 'Hot' },
  { name: 'Creatine', icon: FlaskConical, slug: 'creatine', badge: null },
  { name: 'Mass Gainer', icon: TrendingUp, slug: 'mass-gainer', badge: null },
  { name: 'Vitamins', icon: Shield, slug: 'vitamins', badge: null },
  { name: 'Amino Acids', icon: Coffee, slug: 'amino-acids', badge: null },
  { name: 'Fat Burner', icon: Layers, slug: 'fat-burner', badge: null },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setIsCategoriesOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-matte-black/90 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── MAIN NAV ROW ── */}
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0 mr-2">
            <div className="w-8 h-8 bg-neon-lime flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-90 transition-transform">
              <span className="text-matte-black font-black -rotate-45 group-hover:-rotate-90 transition-transform text-sm">N</span>
            </div>
            <span className="text-xl font-display font-bold tracking-tighter text-soft-white uppercase hidden sm:block">
              Nitrogen
            </span>
          </Link>

          {/* ── FULL-WIDTH SEARCH BAR ── */}
          <form onSubmit={handleSearch} className="flex-1 relative hidden md:block">
            <div className={cn(
              'flex items-center gap-3 rounded-xl border transition-all duration-200 px-4 py-2.5',
              isSearchOpen || searchQuery
                ? 'bg-white/10 border-neon-lime/60 shadow-[0_0_20px_rgba(198,241,53,0.1)]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            )}>
              <Search size={16} className={cn('flex-shrink-0 transition-colors', searchQuery ? 'text-neon-lime' : 'text-white/40')} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                placeholder="Search products, brands, goals..."
                className="flex-1 bg-transparent text-sm placeholder-white/30 focus:outline-none text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="flex-shrink-0 text-white/30 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              {searchQuery && (
                <button
                  type="submit"
                  className="flex-shrink-0 bg-neon-lime text-matte-black text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* ── DESKTOP NAV LINKS ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {/* Categories Mega Menu */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all',
                  isCategoriesOpen ? 'text-neon-lime bg-neon-lime/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                Categories
                <ChevronDown
                  size={13}
                  className={cn('transition-transform duration-200', isCategoriesOpen ? 'rotate-180 text-neon-lime' : '')}
                />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-matte-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {/* Mega Menu Header */}
                    <div className="px-5 pt-5 pb-3 border-b border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Browse by Category</p>
                    </div>

                    {/* Category Grid */}
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {CATEGORIES.map(({ name, icon: Icon, slug, badge }) => (
                        <Link
                          key={slug}
                          to={`/shop?category=${slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:border-neon-lime/20 border border-transparent transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-lime/10 group-hover:text-neon-lime transition-all flex-shrink-0">
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{name}</span>
                          {badge && (
                            <span className="ml-auto text-[9px] font-bold uppercase tracking-widest bg-neon-lime/20 text-neon-lime px-2 py-0.5 rounded-full">
                              {badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Footer Links */}
                    <div className="border-t border-white/5 p-3 flex gap-2">
                      <Link
                        to="/shop"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-neon-lime hover:text-matte-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all text-white/60"
                      >
                        <Star size={13} /> All Products
                      </Link>
                      <Link
                        to="/shop?filter=bestseller"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-neon-lime hover:text-matte-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all text-white/60"
                      >
                        <TrendingUp size={13} /> Best Sellers
                      </Link>
                      <Link
                        to="/shop?filter=stacks"
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neon-lime/10 hover:bg-neon-lime hover:text-matte-black text-neon-lime text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-neon-lime/20"
                      >
                        <Layers size={13} /> Stacks
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ── RIGHT ICONS ── */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto lg:ml-0">

            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2.5 hover:bg-white/5 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>

            <Link to="/wishlist" className="p-2.5 hover:bg-white/5 rounded-full transition-colors relative hidden sm:flex items-center">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neon-lime text-matte-black text-[9px] font-black flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2.5 hover:bg-white/5 rounded-full transition-colors relative flex items-center">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-neon-lime text-matte-black text-[9px] font-black flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative ml-1" ref={userRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-3 border-l border-white/10 hover:text-neon-lime transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-neon-lime flex items-center justify-center text-matte-black font-black text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={13} className={cn('text-white/40 transition-transform hidden sm:block', isDropdownOpen ? 'rotate-180' : '')} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-matte-black border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
                      </div>

                      {[
                        { to: '/dashboard#profile', icon: User, label: 'My Profile' },
                        { to: '/dashboard#orders', icon: Package, label: 'My Orders' },
                        { to: '/dashboard#refer', icon: Gift, label: 'Earn & Refer' },
                      ]
                      .filter(link => !(user?.role === 'admin' && (link.label === 'My Orders' || link.label === 'Earn & Refer')))
                      .map(({ to, icon: Icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-neon-lime transition-colors"
                        >
                          <Icon size={15} className="flex-shrink-0" />
                          {label}
                        </Link>
                      ))}

                      {user?.role === 'admin' && (
                        <>
                          <div className="border-t border-white/5 my-1" />
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-neon-lime transition-colors"
                          >
                            <Settings size={15} className="flex-shrink-0" />
                            Admin Panel
                          </Link>
                        </>
                      )}

                      <div className="border-t border-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-neon-lime text-matte-black px-5 py-2 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2.5 ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE SEARCH BAR ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <form onSubmit={handleSearch} className="pt-3 pb-1">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-neon-lime/60 rounded-xl px-4 py-3 transition-all">
                  <Search size={16} className="text-white/40 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search supplements..."
                    className="flex-1 bg-transparent text-sm placeholder-white/30 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button type="submit" className="text-neon-lime font-bold text-xs uppercase">Go</button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-matte-black z-[60] lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex flex-col min-h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-2xl font-display font-bold uppercase">Nitrogen</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={28} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Search size={16} className="text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm placeholder-white/30 focus:outline-none"
                  />
                </div>
              </form>

              {/* Mobile Nav */}
              <nav className="flex-1 space-y-1">
                {[
                  { label: 'Shop All', to: '/shop' },
                  { label: 'Best Sellers', to: '/shop?filter=bestseller' },
                  { label: 'Stacks', to: '/shop?filter=stacks' },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 text-2xl font-display font-bold uppercase hover:text-neon-lime transition-colors border-b border-white/5"
                  >
                    {label}
                  </Link>
                ))}

                <div className="pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(({ name, slug, icon: Icon }) => (
                      <Link
                        key={slug}
                        to={`/shop?category=${slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-3 px-3 bg-white/5 rounded-xl hover:bg-neon-lime/10 hover:text-neon-lime transition-all text-sm font-bold"
                      >
                        <Icon size={16} />
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Mobile Footer */}
              <div className="pt-8 border-t border-white/5 mt-8 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 text-white/70 hover:text-neon-lime transition-colors">
                      <User size={18} /> My Account
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 py-3 text-red-400">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-4 bg-neon-lime text-matte-black text-center font-bold uppercase tracking-widest rounded-xl"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

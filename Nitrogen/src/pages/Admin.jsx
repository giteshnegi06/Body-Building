import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Users, ShoppingBag, 
  Settings, LogOut, Bell, Search, Plus, 
  MoreVertical, TrendingUp, AlertCircle, X,
  Save, Loader2, CheckCircle, Trash2, Edit3, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const CATEGORIES = ['Protein', 'Pre-Workout', 'Creatine', 'Mass Gainer', 'Vitamins', 'Amino Acids', 'Fat Burner', 'Other'];
const GOALS = ['muscle-gain', 'weight-loss', 'recovery', 'energy', 'general-health'];

const INITIAL_FORM = {
  title: '',
  brand: 'Nitrogen',
  category: '',
  goal: '',
  price: '',
  discountPrice: '',
  stock: '',
  // Arrays (comma-separated in UI)
  flavor: '',
  weight: '',
  features: '',       // e.g. "25g Protein, 0g Sugar, 5.5g BCAAs"
  benefits: '',       // e.g. "Muscle growth, Fast recovery"
  ingredients: '',    // plain text
  // Long text
  shortDescription: '',
  description: '',
  usageInstructions: '',
  // Media
  imageUrl: '',       // single image URL
  // Flags
  featured: false,
  bestSeller: false,
  isNew: false,
  isOutOfStock: false,
};

// Auto-generate a unique SKU
const genSKU = (title, category) => {
  const prefix = (category || 'PRD').slice(0, 3).toUpperCase().replace(/\s/g, '');
  const suffix = (title || 'ITEM').slice(0, 4).toUpperCase().replace(/\s/g, '');
  return `${prefix}-${suffix}-${Date.now().toString(36).toUpperCase()}`;
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [dbProducts, setDbProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Revenue', value: '₹12,84,500', change: '+12.5%', icon: BarChart3 },
    { label: 'Active Orders', value: '142', change: '+5.2%', icon: ShoppingBag },
    { label: 'New Users', value: '450', change: '+8.1%', icon: Users },
    { label: 'Inventory Health', value: '98%', icon: AlertCircle },
  ];

  // Fetch products from backend when on inventory tab
  useEffect(() => {
    if (activeTab === 'inventory') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axiosClient.get('/products');
      setDbProducts(res.data.data.products);
    } catch {
      setDbProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axiosClient.get('/orders');
      setOrders(res.data.data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await axiosClient.get('/users');
      setCustomers(res.data.data.users || []);
    } catch {
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleOpenAddModal = () => {
    setEditProductId(null);
    setForm(INITIAL_FORM);
    setShowAddModal(true);
    setSubmitStatus(null);
  };

  const handleEditProduct = (product) => {
    setEditProductId(product._id);
    setForm({
      title: product.title || '',
      brand: product.brand || 'Nitrogen',
      category: typeof product.category === 'object' ? (product.category?.slug || product.category?.name || '') : (product.category || ''),
      goal: product.goal || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stock: product.stock ?? '',
      flavor: Array.isArray(product.flavor) ? product.flavor.join(', ') : '',
      weight: Array.isArray(product.weight) ? product.weight.join(', ') : '',
      features: Array.isArray(product.features) ? product.features.join(', ') : '',
      benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : '',
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      usageInstructions: product.usageInstructions || '',
      imageUrl: product.images?.[0] || '',
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      isNew: product.isNew || false,
      isOutOfStock: product.isOutOfStock || false,
    });
    setShowAddModal(true);
    setSubmitStatus(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const splitTrim = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

      const payload = {
        title:            form.title,
        brand:            form.brand,
        category:         form.category,
        goal:             form.goal || undefined,
        price:            Number(form.price),
        discountPrice:    form.discountPrice ? Number(form.discountPrice) : undefined,
        stock:            Number(form.stock),
        sku:              genSKU(form.title, form.category),
        // Arrays
        flavor:           splitTrim(form.flavor),
        weight:           splitTrim(form.weight),
        features:         splitTrim(form.features),
        benefits:         splitTrim(form.benefits),
        // Text
        ingredients:      form.ingredients || undefined,
        shortDescription: form.shortDescription || undefined,
        description:      form.description || form.shortDescription || form.title,
        usageInstructions: form.usageInstructions || undefined,
        // Media — store as images array
        images:           splitTrim(form.imageUrl),
        // Flags
        featured:         form.featured,
        bestSeller:       form.bestSeller,
        isNew:            form.isNew,
        isOutOfStock:     form.isOutOfStock,
      };

      // Remove undefined keys to avoid Mongoose validators firing
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      if (editProductId) {
        const res = await axiosClient.patch(`/products/${editProductId}`, payload);
        setSubmitStatus('success');
        setSubmitMessage(`"${form.title}" updated successfully!`);
        setDbProducts(prev => prev.map(p => p._id === editProductId ? res.data.data.product : p));
      } else {
        const res = await axiosClient.post('/products', payload);
        setSubmitStatus('success');
        setSubmitMessage(`"${form.title}" added successfully!`);
        setDbProducts(prev => [res.data.data.product, ...prev]);
        setForm(INITIAL_FORM);
      }

      setTimeout(() => {
        setShowAddModal(false);
        setSubmitStatus(null);
      }, 1500);
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await axiosClient.delete(`/products/${id}`);
      setDbProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  // Show only real DB products in admin (not mock)
  const displayProducts = dbProducts;

  return (
    <div className="min-h-screen bg-matte-black flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-graphite/50 border-r border-white/5 flex flex-col p-6 space-y-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-neon-lime text-matte-black flex items-center justify-center rounded-sm font-black">A</div>
          <span className="text-xl font-display font-bold uppercase tracking-tight">Terminal Control</span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'orders', label: 'Order Feed', icon: ShoppingBag },
            { id: 'customers', label: 'User Base', icon: Users },
            { id: 'settings', label: 'System Config', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === item.id ? "bg-neon-lime text-matte-black" : "text-white/40 hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          {user && (
            <div className="px-4 py-3 text-xs text-white/30 uppercase tracking-widest">
              Logged in as <span className="text-neon-lime">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleExit}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-lg text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={18} />
            <span>Exit Terminal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold uppercase mb-2">Systems <span className="text-neon-lime">Online</span></h1>
            <p className="text-white/30 text-xs uppercase tracking-widest">Admin Authorization: Authorized</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input type="text" placeholder="Global Search..." className="bg-graphite border border-white/5 rounded-full py-2 pl-10 pr-4 text-xs tracking-widest uppercase outline-none focus:border-neon-lime/30" />
            </div>
            <button className="p-3 bg-graphite rounded-full relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-neon-lime rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-neon-lime flex items-center justify-center text-matte-black font-black">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-graphite p-6 border border-white/5 rounded-2xl group hover:border-neon-lime/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-lime group-hover:bg-neon-lime group-hover:text-matte-black transition-colors">
                  <stat.icon size={20} />
                </div>
                {stat.change && (
                  <span className="text-[10px] font-bold text-neon-lime flex items-center">
                    <TrendingUp size={12} className="mr-1" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-bold text-soft-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <h3 className="text-2xl font-display font-bold uppercase">Inventory Control</h3>
              <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center space-x-2 bg-neon-lime text-matte-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {loadingProducts ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <Package size={48} className="text-white/10 mx-auto mb-4" />
                  <h3 className="text-xl font-bold uppercase mb-2">No Products Yet</h3>
                  <p className="text-white/40 text-sm mb-6">Add your first product using the button above.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neon-lime text-matte-black font-bold uppercase text-xs tracking-widest rounded-xl"
                  >
                    <Plus size={16} /> Add First Product
                  </button>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                      <th className="pb-4 pt-4 px-4">Product</th>
                      <th className="pb-4 pt-4">Category</th>
                      <th className="pb-4 pt-4">Price</th>
                      <th className="pb-4 pt-4">Stock</th>
                      <th className="pb-4 pt-4">Status</th>
                      <th className="pb-4 pt-4 text-right px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayProducts.map((product) => (
                      <tr key={product._id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-matte-black rounded-lg overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center">
                              {product.images?.[0]
                                ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                : <Package size={20} className="text-white/20" />
                              }
                            </div>
                            <div>
                              <p className="font-bold uppercase tracking-wider text-soft-white text-sm">{product.title}</p>
                              <p className="text-[10px] text-white/30 font-mono">{product.sku || product._id?.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded">
                            {product.subCategory || (typeof product.category === 'object' ? product.category?.name : product.category) || '—'}
                          </span>
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-soft-white">₹{(product.discountPrice || product.price || 0).toLocaleString('en-IN')}</p>
                          {product.discountPrice && (
                            <p className="text-[10px] text-white/30 line-through">₹{product.price?.toLocaleString('en-IN')}</p>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            'font-bold text-sm',
                            (product.isOutOfStock || product.stock === 0) ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-neon-lime'
                          )}>
                            {product.stock ?? 0}
                          </span>
                          <span className="text-white/20 text-[10px] uppercase ml-1">units</span>
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            'px-2 py-1 text-[9px] font-bold uppercase tracking-widest border rounded',
                            (!product.isOutOfStock && product.stock > 0)
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          )}>
                            {(!product.isOutOfStock && product.stock > 0) ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-4 text-right px-4 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-white/20 hover:text-neon-lime transition-colors"
                            title="Edit product"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.title)}
                            className="p-2 text-white/20 hover:text-red-400 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold uppercase pb-6 border-b border-white/5">System Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-graphite border border-white/5 p-6 rounded-2xl">
                <h4 className="text-sm font-bold uppercase text-white/40 mb-4">Recent Activity</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-neon-lime/10 flex items-center justify-center text-neon-lime"><ShoppingBag size={14} /></div>
                      <div>
                        <p className="text-sm font-bold">New Order #ORD-{Math.floor(Math.random() * 10000)}</p>
                        <p className="text-xs text-white/40">Just now</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-graphite border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                <BarChart3 size={48} className="text-white/10 mb-4" />
                <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Revenue Graph</p>
                <p className="text-xs text-white/20 mt-2">Connecting to analytics engine...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold uppercase pb-6 border-b border-white/5">Order Feed</h3>
            <div className="bg-graphite border border-white/5 rounded-2xl overflow-hidden">
              {loadingOrders ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center text-white/40">No orders found.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5 bg-white/5">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm font-mono text-neon-lime">{order._id.slice(-8).toUpperCase()}</td>
                        <td className="p-4 text-sm font-bold text-soft-white">{order.user?.name || 'Guest'}</td>
                        <td className="p-4 text-sm">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={cn(
                            "text-[10px] uppercase tracking-widest px-2 py-1 rounded border",
                            order.paymentStatus === 'Completed' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/60 border-white/10"
                          )}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold uppercase pb-6 border-b border-white/5">User Base</h3>
            <div className="bg-graphite border border-white/5 rounded-2xl p-6">
              {loadingCustomers ? (
                <div className="py-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-neon-lime animate-spin" />
                </div>
              ) : customers.length === 0 ? (
                <div className="py-20 text-center text-white/40">No users found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((customer) => (
                    <div key={customer._id} className="flex items-center gap-4 p-4 border border-white/5 rounded-xl bg-white/5">
                      <div className="w-12 h-12 bg-neon-lime/10 text-neon-lime rounded-full flex items-center justify-center font-bold text-lg">
                        {customer.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{customer.name}</p>
                        <p className="text-xs text-white/40">{customer.email}</p>
                        <p className="text-[10px] text-white/20 mt-1 uppercase">Role: {customer.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-display font-bold uppercase pb-6 border-b border-white/5">System Config</h3>
            <div className="max-w-2xl bg-graphite border border-white/5 p-6 rounded-2xl space-y-6">
              <div>
                <label className="text-xs font-bold uppercase text-white/40 block mb-2">Store Name</label>
                <input type="text" defaultValue="Nitrogen Supplements" className="w-full bg-matte-black border border-white/10 rounded-lg p-3 text-sm focus:border-neon-lime outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-white/40 block mb-2">Support Email</label>
                <input type="email" defaultValue="support@nitrogen.com" className="w-full bg-matte-black border border-white/10 rounded-lg p-3 text-sm focus:border-neon-lime outline-none" />
              </div>
              <div className="flex items-center justify-between py-4 border-t border-white/5 mt-4">
                <div>
                  <p className="font-bold text-sm uppercase">Maintenance Mode</p>
                  <p className="text-xs text-white/40">Disable storefront for updates</p>
                </div>
                <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white/40 rounded-full absolute top-1 left-1"></div>
                </div>
              </div>
              <button className="px-6 py-3 bg-neon-lime text-matte-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors">
                Save Configurations
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-graphite border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-graphite z-10">
                <div>
                  <h2 className="text-xl font-display font-bold uppercase tracking-widest">{editProductId ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Fill all details like the demo products</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-6">
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
                    <CheckCircle size={18} /><span className="text-sm">{submitMessage}</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    <AlertCircle size={18} /><span className="text-sm">{submitMessage}</span>
                  </div>
                )}

                {/* ── SECTION 1: Core Info ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">① Core Info</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Product Name *</label>
                      <input name="title" value={form.title} onChange={handleFormChange} required
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="e.g. Nitro Gold Whey Isolate" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Brand *</label>
                      <input name="brand" value={form.brand} onChange={handleFormChange} required
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="NITROGEN" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Category *</label>
                      <select name="category" value={form.category} onChange={handleFormChange} required
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors">
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Fitness Goal</label>
                      <select name="goal" value={form.goal} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors">
                        <option value="">Select Goal</option>
                        {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Product Image URLs (comma-separated)</label>
                      <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="https://image1.png, https://image2.png" />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 2: Pricing & Stock ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">② Pricing & Stock</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">MRP Price (₹) *</label>
                      <input type="number" name="price" value={form.price} onChange={handleFormChange} required min="0"
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="9500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Sale Price (₹)</label>
                      <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleFormChange} min="0"
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="7500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Stock Qty *</label>
                      <input type="number" name="stock" value={form.stock} onChange={handleFormChange} required min="0"
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="100" />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 3: Variants ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">③ Variants</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Flavors (comma-separated)</label>
                      <input name="flavor" value={form.flavor} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="Gourmet Chocolate, Vanilla Bean, Cookies & Cream" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Sizes / Weights (comma-separated)</label>
                      <input name="weight" value={form.weight} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="1kg, 2kg, 5kg" />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 4: Descriptions ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">④ Descriptions</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Short Description (shown on card)</label>
                      <input name="shortDescription" value={form.shortDescription} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="Ultra-pure whey protein isolate engineered for fast absorption..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Full Description *</label>
                      <textarea name="description" value={form.description} onChange={handleFormChange} required rows={3}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors resize-none"
                        placeholder="Detailed product description for the product page..." />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 5: Features & Benefits ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">⑤ Features & Benefits</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Key Features (comma-separated)</label>
                      <input name="features" value={form.features} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="25g Protein per serving, 0g Added Sugar, 5.5g BCAAs, Lactose Free" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Benefits (comma-separated)</label>
                      <input name="benefits" value={form.benefits} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="Muscle growth, Fast recovery, Lean mass gain" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Ingredients</label>
                      <input name="ingredients" value={form.ingredients} onChange={handleFormChange}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                        placeholder="Whey Protein Isolate, Natural Flavors, Soy Lecithin, Sucralose" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Usage Instructions</label>
                      <textarea name="usageInstructions" value={form.usageInstructions} onChange={handleFormChange} rows={2}
                        className="w-full bg-matte-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors resize-none"
                        placeholder="Mix 1 scoop with 200ml of cold water or milk. Consume post-workout..." />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 6: Flags ── */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-lime mb-4">⑥ Labels & Flags</p>
                  <div className="flex flex-wrap gap-4">
                    {[['featured','Featured'],['bestSeller','Best Seller'],['isNew','New Arrival'],['isOutOfStock','Out of Stock']].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <div
                          onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                          className={cn('w-10 h-6 rounded-full transition-colors relative', form[key] ? 'bg-neon-lime' : 'bg-white/10')}
                        >
                          <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', form[key] ? 'translate-x-5' : 'translate-x-1')} />
                        </div>
                        <span className="text-xs uppercase tracking-widest text-white/60">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2 border-t border-white/5">
                  <button type="button" onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neon-lime text-matte-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Product</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

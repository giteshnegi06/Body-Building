import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Package, Gift, Camera, Save, Loader2, 
  CheckCircle2, AlertCircle, LogOut, Copy, Share2,
  ArrowRight, ShoppingBag, ChevronRight, Edit3,
  Phone, Mail, Shield, Star, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'refer', label: 'Earn & Refer', icon: Gift },
];

const ORDER_STATUS_COLORS = {
  Processing:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Shipped:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Delivered:   'bg-green-500/10 text-green-400 border-green-500/20',
  Cancelled:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab from URL hash
  const hashTab = location.hash.replace('#', '');
  const [activeTab, setActiveTab] = useState(TABS.find(t => t.id === hashTab)?.id || 'profile');

  // Profile form
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  // Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Referral
  const [copied, setCopied] = useState(false);
  const referralCode = `NIT-${(user?._id || user?.id || 'USER').toString().slice(-6).toUpperCase()}`;
  const referralLink = `https://nitrogen.store/ref/${referralCode}`;

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    // Sync URL hash
    navigate(`#${activeTab}`, { replace: true });
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await axiosClient.get('/orders/my-orders');
      setOrders(res.data.data.orders);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await axiosClient.patch('/users/updateMe', form);
      if (refreshUser) await refreshUser();
      setSaveStatus('success');
      setSaveMsg('Profile updated successfully!');
    } catch (err) {
      setSaveStatus('error');
      setSaveMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-linear-to-br from-graphite via-graphite/80 to-matte-black border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,241,53,0.15),transparent_60%)]" />
          <div className="relative p-8 md:p-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-neon-lime flex items-center justify-center text-matte-black text-3xl font-black border-4 border-neon-lime/30">
                {initials}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-graphite border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-neon-lime transition-colors">
                <Camera size={14} />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight">
                {user?.name || 'Athlete'}
              </h1>
              <p className="text-white/40 text-sm mt-1">{user?.email}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                <span className="flex items-center gap-1.5 bg-neon-lime/10 text-neon-lime border border-neon-lime/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  <Star size={10} /> Elite Member
                </span>
                {user?.role !== 'admin' && (
                  <span className="flex items-center gap-1.5 bg-white/5 text-white/50 border border-white/10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    <Zap size={10} /> {orders.length} Orders
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl px-4 py-2 transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3">
            <div className="bg-graphite/50 border border-white/5 rounded-2xl p-3 space-y-1 sticky top-28">
              {TABS.filter(t => !(user?.role === 'admin' && (t.id === 'orders' || t.id === 'refer'))).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all text-left',
                    activeTab === id
                      ? 'bg-neon-lime text-matte-black'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">

              {/* ── MY PROFILE ── */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-graphite/50 border border-white/5 rounded-2xl p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-neon-lime/10 flex items-center justify-center">
                      <Edit3 className="text-neon-lime" size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wide">Edit Profile</h2>
                      <p className="text-xs text-white/40">Update your personal information</p>
                    </div>
                  </div>

                  {saveStatus && (
                    <div className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border mb-6 text-sm',
                      saveStatus === 'success'
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    )}>
                      {saveStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {saveMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <User size={10} className="inline mr-1" /> Full Name
                        </label>
                        <input
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-matte-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <Mail size={10} className="inline mr-1" /> Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-matte-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <Phone size={10} className="inline mr-1" /> Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-matte-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-lime transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                          <Shield size={10} className="inline mr-1" /> Account Role
                        </label>
                        <div className="w-full bg-matte-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40 capitalize">
                          {user?.role || 'user'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-neon-lime text-matte-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                      >
                        {isSaving
                          ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                          : <><Save size={16} /> Save Changes</>
                        }
                      </button>
                    </div>
                  </form>

                  {/* Account Stats */}
                  <div className={cn("grid gap-4 mt-8 pt-8 border-t border-white/5", user?.role === 'admin' ? "grid-cols-1" : "grid-cols-3")}>
                    {[
                      { label: 'Total Orders', value: orders.length || '—', show: user?.role !== 'admin' },
                      { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', show: true },
                      { label: 'Referrals', value: '0', show: user?.role !== 'admin' },
                    ].filter(s => s.show).map(({ label, value }) => (
                      <div key={label} className="text-center bg-matte-black/50 rounded-xl p-4 border border-white/5">
                        <p className="text-2xl font-display font-bold text-neon-lime">{value}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── MY ORDERS ── */}
              {activeTab === 'orders' && user?.role !== 'admin' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-neon-lime/10 flex items-center justify-center">
                      <Package className="text-neon-lime" size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wide">Order History</h2>
                      <p className="text-xs text-white/40">Track and review all your purchases</p>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="py-24 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-neon-lime animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-24 text-center bg-graphite/30 border border-white/5 rounded-2xl">
                      <ShoppingBag size={48} className="text-white/10 mx-auto mb-4" />
                      <h3 className="text-xl font-bold uppercase mb-2">No Orders Yet</h3>
                      <p className="text-white/40 text-sm mb-6">Your order history will appear here.</p>
                      <button
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neon-lime text-matte-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors"
                      >
                        Start Shopping <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-graphite/50 border border-white/5 rounded-2xl p-5 hover:border-neon-lime/20 transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Order ID</p>
                            <p className="font-mono text-sm text-white/70">#{order._id?.slice(-8).toUpperCase()}</p>
                          </div>
                          <div className="text-left sm:text-center">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Date</p>
                            <p className="text-sm text-white/70">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-left sm:text-center">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Total</p>
                            <p className="text-lg font-bold text-soft-white">
                              ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span className={cn(
                            'px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border self-start sm:self-center',
                            ORDER_STATUS_COLORS[order.status] || ORDER_STATUS_COLORS.Processing
                          )}>
                            {order.status || 'Processing'}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 border-t border-white/5 pt-4">
                          {order.products?.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-matte-black rounded-lg border border-white/10 shrink-0 flex items-center justify-center">
                                <Package size={14} className="text-white/20" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <p className="text-[10px] text-white/40 flex flex-wrap items-center gap-1.5">
                                  {item.size && (
                                    <span className="bg-neon-lime/10 text-neon-lime border border-neon-lime/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">{item.size}</span>
                                  )}
                                  {item.flavor && item.flavor !== 'Unflavored' && (
                                    <span className="bg-white/5 text-white/50 border border-white/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">{item.flavor}</span>
                                  )}
                                  <span>Qty: {item.quantity}</span>
                                </p>
                              </div>
                              <p className="text-sm font-bold shrink-0">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                          {order.products?.length > 3 && (
                            <p className="text-[10px] text-white/30 pl-13">
                              +{order.products.length - 3} more items
                            </p>
                          )}
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">
                              📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                            <span className="text-[10px] text-white/30 uppercase tracking-widest">
                              {order.paymentMethod} · {order.paymentStatus || 'Pending'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* ── EARN & REFER ── */}
              {activeTab === 'refer' && user?.role !== 'admin' && (
                <motion.div
                  key="refer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {/* Hero Card */}
                  <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-neon-lime/20 to-neon-lime/5 border border-neon-lime/20 p-8 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,241,53,0.1),transparent_70%)]" />
                    <div className="relative">
                      <div className="w-16 h-16 bg-neon-lime rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Gift size={32} className="text-matte-black" />
                      </div>
                      <h2 className="text-3xl font-display font-bold uppercase mb-2">
                        Refer & <span className="text-neon-lime">Earn</span>
                      </h2>
                      <p className="text-white/60 max-w-md mx-auto text-sm">
                        Share Nitrogen with your gym crew. You earn <strong className="text-neon-lime">₹200</strong> and 
                        they get <strong className="text-neon-lime">10% off</strong> their first order!
                      </p>
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div className="bg-graphite/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Your Referral Code</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-matte-black border border-neon-lime/30 rounded-xl px-5 py-4 font-mono text-2xl font-bold text-neon-lime tracking-widest text-center">
                        {referralCode}
                      </div>
                      <button
                        onClick={handleCopy}
                        className={cn(
                          'flex flex-col items-center gap-1 px-5 py-4 rounded-xl font-bold transition-all text-xs uppercase tracking-widest',
                          copied ? 'bg-neon-lime text-matte-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                        )}
                      >
                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Your Referral Link</p>
                      <div className="flex items-center gap-2 bg-matte-black border border-white/10 rounded-xl px-4 py-3">
                        <p className="flex-1 text-xs text-white/50 font-mono truncate">{referralLink}</p>
                        <button
                          onClick={handleCopy}
                          className="text-white/40 hover:text-neon-lime transition-colors shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {[
                        { label: 'Share on WhatsApp', bg: 'bg-[#25D366]', url: `https://wa.me/?text=Use%20my%20Nitrogen%20referral%20code%20${referralCode}%20to%20get%2010%25%20off!%20${referralLink}` },
                        { label: 'Share on Instagram', bg: 'bg-gradient-to-r from-purple-500 to-pink-500', url: '#' },
                      ].map(({ label, bg, url }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={cn('flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80', bg)}
                        >
                          <Share2 size={14} /> {label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="bg-graphite/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">How It Works</h3>
                    <div className="space-y-4">
                      {[
                        { step: '01', title: 'Share your code', desc: 'Send your unique referral code or link to friends.' },
                        { step: '02', title: 'Friend signs up', desc: 'They register using your referral code.' },
                        { step: '03', title: 'Both get rewarded', desc: 'They get 10% off, you get ₹200 Nitrogen Credits!' },
                      ].map(({ step, title, desc }) => (
                        <div key={step} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center shrink-0">
                            <span className="text-neon-lime font-display font-bold text-sm">{step}</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-wide">{title}</p>
                            <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Earnings Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Referred', value: '0' },
                      { label: 'Credits Earned', value: '₹0' },
                      { label: 'Credits Used', value: '₹0' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-graphite/50 border border-white/5 rounded-2xl p-5 text-center">
                        <p className="text-2xl font-display font-bold text-neon-lime">{value}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

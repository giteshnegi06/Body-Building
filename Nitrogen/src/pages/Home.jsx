import React, { useState } from 'react';
import { motion } from 'motion/react';
import Hero from '../components/home/Hero';
import ProductCard from '../components/shop/ProductCard';
import { PRODUCTS } from '../data/products';
import { Shield, Sparkles, Zap, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [email, setEmail] = useState('');
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);

  return (
    <div className="bg-matte-black w-full overflow-x-hidden">
      <Hero />

      {/* Featured Categories */}
      <section id="categories" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-neon-lime font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Categories</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">Engineered for your <span className="italic text-neon-lime">goals</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Protein', image: '/products/whey.png', desc: 'Muscle Building & Recovery' },
            { name: 'Creatine', image: '/products/creatine.png', desc: 'Strength & Power' },
            { name: 'Pre-Workout', image: '/products/preworkout.png', desc: 'Focus & Energy' },
            { name: 'Vitamins', image: '/products/vitamins.png', desc: 'Health & Vitality' },
          ].map((cat, i) => (
            <Link to="/shop" key={i} className="group relative h-[400px] overflow-hidden rounded-xl bg-graphite">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-display font-bold uppercase mb-2 group-hover:text-neon-lime transition-colors">{cat.name}</h3>
                <p className="text-white/50 text-sm mb-6">{cat.desc}</p>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-neon-lime group-hover:text-matte-black group-hover:border-neon-lime transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section id="best-sellers" className="py-24 bg-graphite/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-neon-lime font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Shop Popular</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase">The <span className="italic text-neon-lime">Core</span> Collection</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center space-x-2 text-sm font-bold uppercase tracking-widest hover:text-neon-lime transition-colors">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us section */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-neon-lime font-bold tracking-[0.3em] uppercase text-xs mb-4 block">The Process</span>
              <h2 className="text-5xl font-display font-bold uppercase leading-tight mb-8">Purity in every <br />single <span className="italic text-neon-lime">molecule</span></h2>
              <p className="text-white/60 text-lg font-light leading-relaxed">
                We don't just sell supplements; we engineer performance. Every batch undergoes rigorous third-party lab testing.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {[
                { icon: Shield, title: 'Informed Choice', desc: 'Screened for 250+ banned substances.' },
                { icon: Zap, title: 'Rapid Absorb', desc: 'Micronized for immediate delivery.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-neon-lime">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold uppercase tracking-wider">{item.title}</h4>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <img src="/products/gainer.png" className="rounded-2xl grayscale" alt="Performance" />
             <div className="absolute -bottom-6 -right-6 bg-neon-lime p-8 text-matte-black rounded-lg">
                <Award size={48} className="mb-2" />
                <p className="text-2xl font-display font-bold uppercase leading-none">Certified <br />Elite</p>
             </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-neon-lime">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-matte-black p-12 md:p-20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:max-w-xl text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-none mb-6">Join the <span className="text-neon-lime">Alpha</span> Squad</h2>
              <p className="text-white/60 text-lg">Sign up for early access and elite training protocols.</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex gap-4" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="ENTER EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-graphite border border-white/10 px-6 py-4 text-white font-display uppercase tracking-widest outline-none flex-1" />
                <button className="bg-neon-lime text-matte-black font-bold uppercase tracking-widest px-8 py-4">Join</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

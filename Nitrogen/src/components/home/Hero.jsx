import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Background with cinematic lighting */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black via-matte-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000" 
          alt="Athlete"
          className="w-full h-full object-cover grayscale opacity-40"
        />
        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-lime/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full z-20 relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-neon-lime text-matte-black text-xs font-bold tracking-[0.3em] uppercase py-1 px-3 mb-6">
              Elite Performance Fuel
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-none mb-6">
              Unleash your <br />
              <span className="text-neon-lime italic">strength</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light">
              Scientifically engineered supplements for serious athletes. Zero fillers, maximum results. Built for those who demand more from their bodies.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto px-10 py-5 bg-neon-lime text-matte-black font-bold uppercase tracking-widest hover:neon-glow-strong transition-all flex items-center justify-center group"
              >
                Shop Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="w-full sm:w-auto flex items-center justify-center space-x-3 group px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-neon-lime transition-colors">
                  <Play size={20} fill="white" className="ml-1 group-hover:fill-neon-lime transition-colors" />
                </div>
                <span className="font-bold uppercase tracking-widest text-sm">Watch Stories</span>
              </button> */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Supplement Render - Abstract representation */}
      {/* <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: -5 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="hidden lg:block absolute right-20 top-1/4 z-30 pointer-events-none"
      >
        <div className="relative">
          <div className="absolute -inset-10 bg-neon-lime blur-3xl opacity-20 rounded-full" />
          <img 
            src="/products/whey.png" 
            alt="Protein Render"
            className="w-[450px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)]"
          />
        </div>
      </motion.div> */}

      {/* Stats Counter */}
      <div className="absolute bottom-10 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
            {[
              { label: 'Active Users', value: '50k+' },
              { label: 'Pro Athletes', value: '200+' },
              { label: 'Countries', value: '45' },
              { label: 'Lab Tested', value: '100%' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-neon-lime font-display text-4xl font-bold">{stat.value}</p>
                <p className="text-white/40 uppercase text-xs tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

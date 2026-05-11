import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-graphite pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neon-lime flex items-center justify-center rounded-sm rotate-45">
                <span className="text-matte-black font-bold -rotate-45">N</span>
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter uppercase">Nitrogen</span>
            </Link>
            <p className="text-white/50 leading-relaxed font-light">
              Premium sports nutrition for those who refuse to settle. Formulated in elite laboratories, tested on the field of play.
            </p>
            <div className="flex items-center space-x-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-lime hover:text-matte-black transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 text-white/50">
              {['Shop All', 'Best Sellers', 'New Arrivals', 'Subscription Plans', 'Gift Cards', 'Track Order'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="hover:text-neon-lime transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-4 text-white/50">
              {['Contact Us', 'Shipping Policy', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-neon-lime transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-white/50">
                <li className="flex items-start space-x-3">
                  <MapPin size={20} className="text-neon-lime mt-1 flex-shrink-0" />
                  <span>221B Elite Plaza, Performance Ave, London</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={20} className="text-neon-lime flex-shrink-0" />
                  <span>support@nitrogen.fit</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="text-neon-lime flex-shrink-0" />
                  <span>+1 (800) NITRO-FIT</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications and Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 py-10 border-t border-white/10 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest">100% Authentic</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-graphite font-bold text-[10px]">GMP</div>
            <span className="text-xs font-bold uppercase tracking-widest">GMP Certified</span>
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-6 h-6 border-2 border-neon-lime rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest">Lab Tested</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            © 2026 Nitrogen Performance. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain opacity-40" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-4 object-contain opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  );
}

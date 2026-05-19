import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ShieldCheck,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

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
              <span className="text-2xl font-display font-bold tracking-tighter uppercase">
                Nitrogen
              </span>
            </Link>
            <p className="text-white/50 leading-relaxed font-light">
              Premium sports nutrition for those who refuse to settle.
              Formulated in elite laboratories, tested on the field of play.
            </p>
            <div className="flex items-center space-x-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-lime hover:text-matte-black transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-4 text-white/50">
              {[
                "Shop All",
                "Best Sellers",
                "New Arrivals",
                "Subscription Plans",
                "Gift Cards",
                "Track Order",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="hover:text-neon-lime transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-4 text-white/50">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-neon-lime transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-neon-lime transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns-refunds"
                  className="hover:text-neon-lime transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-neon-lime transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-neon-lime transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-neon-lime transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-4 text-white/50">
                <li className="flex items-start space-x-3">
                  <MapPin
                    size={20}
                    className="text-neon-lime mt-1 flex-shrink-0"
                  />
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
            <span className="text-xs font-bold uppercase tracking-widest">
              100% Authentic
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-graphite font-bold text-[10px]">
              GMP
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              GMP Certified
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-neon-lime rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Lab Tested
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            © 2026 Nitrogen Performance. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="#ffffff"
              viewBox="0 0 24 24"
            >
              <path d="M13.93 9a1.84 1.84 0 0 0-1.28-.5h-2v5.74h.75V11.9h1.2a1.85 1.85 0 0 0 1.28-.5 1.63 1.63 0 0 0 .52-1.23A1.58 1.58 0 0 0 13.93 9m-.5 1.9a1 1 0 0 1-.73.3h-1.25v-2h1.25a.9.9 0 0 1 .73.3 1 1 0 0 1 0 1.38zm2.75-.72a1.92 1.92 0 0 0-1.63.77l.65.4a1.09 1.09 0 0 1 1-.52 1.1 1.1 0 0 1 .72.27.81.81 0 0 1 .3.65v.18a1.9 1.9 0 0 0-1.07-.25 1.9 1.9 0 0 0-1.25.32 1.2 1.2 0 0 0-.45 1 1.35 1.35 0 0 0 .45 1 1.74 1.74 0 0 0 1.1.37 1.45 1.45 0 0 0 1.23-.67v.54H18v-2.41a1.56 1.56 0 0 0-.47-1.2 1.84 1.84 0 0 0-1.35-.45m.7 3.17a1.18 1.18 0 0 1-.83.35.94.94 0 0 1-.57-.2.56.56 0 0 1-.25-.47.6.6 0 0 1 .3-.53 1.2 1.2 0 0 1 .75-.22 1.58 1.58 0 0 1 1 .27 1 1 0 0 1-.4.8M22 10.33v-.03l-.01.03zm-1.92 2.82h-.03l-1.17-2.82h-.8L19.7 14l-.92 1.97h.75l2.46-5.64h-.76zM5.31 10.73V12h1.77a1.52 1.52 0 0 1-.65 1 2 2 0 0 1-3-1.05 1.9 1.9 0 0 1 0-1.27 1.91 1.91 0 0 1 1.88-1.35 1.83 1.83 0 0 1 1.27.5l1-.95A3.14 3.14 0 0 0 5.33 8 3.26 3.26 0 0 0 2.4 9.83a3.24 3.24 0 0 0 0 3 3.28 3.28 0 0 0 2.95 1.82 3.24 3.24 0 0 0 2.19-.79 3.22 3.22 0 0 0 1-2.43c0-.22 0-.45-.05-.67z" />
            </svg>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="h-6 object-contain opacity-40"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
              alt="PayPal"
              className="h-4 object-contain opacity-40"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

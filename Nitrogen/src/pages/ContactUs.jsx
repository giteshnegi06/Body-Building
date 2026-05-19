import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <h1 className="text-5xl font-display font-bold uppercase mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-white/70 mb-8 leading-relaxed">
            Have a question about our products, your order, or just want to say hello? 
            Our support team is ready to help you reach your peak performance.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="text-neon-lime mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg">HQ Address</h3>
                <p className="text-white/70">221B Elite Plaza, Performance Ave<br/>London, UK</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="text-neon-lime mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg">Email Support</h3>
                <p className="text-white/70">support@nitrogen.fit</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="text-neon-lime mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg">Phone</h3>
                <p className="text-white/70">+1 (800) NITRO-FIT</p>
              </div>
            </div>
          </div>
        </div>
        <form className="space-y-6 bg-graphite p-8 rounded-lg border border-white/5">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-white/70">Name</label>
            <input type="text" className="w-full bg-matte-black border border-white/10 p-3 rounded text-white focus:border-neon-lime outline-none transition-colors" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-white/70">Email</label>
            <input type="email" className="w-full bg-matte-black border border-white/10 p-3 rounded text-white focus:border-neon-lime outline-none transition-colors" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-white/70">Message</label>
            <textarea rows="5" className="w-full bg-matte-black border border-white/10 p-3 rounded text-white focus:border-neon-lime outline-none transition-colors" placeholder="How can we help?"></textarea>
          </div>
          <button type="button" className="w-full bg-neon-lime text-matte-black font-bold py-4 rounded uppercase tracking-widest hover:bg-white transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

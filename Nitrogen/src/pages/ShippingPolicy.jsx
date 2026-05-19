import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 md:px-8 prose prose-invert prose-neon">
      <h1 className="text-5xl font-display font-bold uppercase mb-8 text-white">Shipping Policy</h1>
      
      <h2 className="text-2xl font-bold mt-12 mb-4 text-white">Order Processing</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Domestic Shipping Rates and Estimates</h2>
      <p className="text-white/70 leading-relaxed mb-4">We offer simple, flat-rate shipping options:</p>
      <ul className="list-disc pl-6 text-white/70 space-y-2 mb-6">
        <li><strong>Standard Shipping (3-5 business days):</strong> $5.99</li>
        <li><strong>Express Shipping (1-2 business days):</strong> $14.99</li>
        <li><strong>Free Standard Shipping:</strong> On all orders over $75.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">International Shipping</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        We currently ship to select countries internationally. Shipping charges for your order will be calculated and displayed at checkout. Please note that international orders may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. Nitrogen Performance is not responsible for these charges if they are applied and are your responsibility as the customer.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">How do I check the status of my order?</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
      </p>
    </div>
  );
}

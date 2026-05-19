import React from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqs = [
    {
      question: "Are your products third-party tested?",
      answer: "Yes. All Nitrogen Performance products undergo rigorous third-party testing for purity, potency, and to ensure they are free of banned substances. We believe in complete transparency for our athletes."
    },
    {
      question: "Can I stack Nitrogen products together?",
      answer: "Absolutely. Our product line is designed to work synergistically. For example, stacking our Pre-Workout with our Intra-Workout BCAAs is a highly effective combination for endurance and recovery."
    },
    {
      question: "Do you ship internationally?",
      answer: "We currently ship to the US, Canada, UK, EU, and Australia. We are constantly working to expand our shipping capabilities to reach more athletes worldwide."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can easily manage, pause, or cancel your subscription at any time through your account dashboard. There are no hidden fees or minimum commitments."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, simply contact our support team to initiate a return. Please see our full Returns & Refunds policy for details."
    }
  ];

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 md:px-8">
      <h1 className="text-5xl font-display font-bold uppercase mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-white/50 text-center mb-16 max-w-xl mx-auto">
        Everything you need to know about our products, shipping, and the Nitrogen Performance brand.
      </p>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-graphite p-6 md:p-8 rounded-lg border border-white/5">
            <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
            <p className="text-white/70 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-white/70 mb-4">Still have questions?</p>
        <Link to="/contact" className="inline-block bg-white/5 hover:bg-neon-lime hover:text-matte-black transition-colors px-8 py-3 rounded font-bold uppercase tracking-widest">
          Contact Support
        </Link>
      </div>
    </div>
  );
}

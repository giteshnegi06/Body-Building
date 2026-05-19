import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 md:px-8 prose prose-invert prose-neon">
      <h1 className="text-5xl font-display font-bold uppercase mb-8 text-white">Privacy Policy</h1>
      <p className="text-sm text-white/50 mb-8 uppercase tracking-widest">Last Updated: October 2023</p>

      <p className="text-white/70 leading-relaxed mb-6">
        Nitrogen Performance ("we", "us", or "our") operates the nitrogen.fit website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4 text-white">Information Collection and Use</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        We collect several different types of information for various purposes to provide and improve our Service to you.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-3 text-white">Personal Data</h3>
      <p className="text-white/70 leading-relaxed mb-6">
        While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
      </p>
      <ul className="list-disc pl-6 text-white/70 space-y-2 mb-6">
        <li>Email address</li>
        <li>First name and last name</li>
        <li>Phone number</li>
        <li>Address, State, Province, ZIP/Postal code, City</li>
        <li>Cookies and Usage Data</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Use of Data</h2>
      <p className="text-white/70 leading-relaxed mb-4">Nitrogen Performance uses the collected data for various purposes:</p>
      <ul className="list-disc pl-6 text-white/70 space-y-2 mb-6">
        <li>To provide and maintain our Service</li>
        <li>To notify you about changes to our Service</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our Service</li>
        <li>To monitor the usage of our Service</li>
        <li>To detect, prevent and address technical issues</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Security of Data</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
      </p>
    </div>
  );
}

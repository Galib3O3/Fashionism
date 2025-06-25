import React from 'react';

function AboutPage() {
  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">About My E-Shop</h2>
      <p className="text-gray-700 leading-relaxed mb-6">Welcome to My E-Shop, your ultimate destination for high-quality products at unbeatable prices. We are passionate about providing an exceptional shopping experience to our customers.</p>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Our Mission</h3>
      <p className="text-gray-700 leading-relaxed mb-6">Our mission is to make online shopping convenient, secure, and enjoyable for everyone. We strive to offer a diverse range of products, from electronics to fashion, all while ensuring top-notch customer service.</p>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Our Values</h3>
      <ul className="list-disc ml-8 text-gray-700 leading-relaxed mb-6">
        <li><strong className="font-medium">Customer Satisfaction:</strong> Your happiness is our priority.</li>
        <li><strong className="font-medium">Quality Products:</strong> We source products from trusted suppliers.</li>
        <li><strong className="font-medium">Transparency:</strong> Clear pricing and honest descriptions.</li>
        <li><strong className="font-medium">Innovation:</strong> Constantly improving our platform and services.</li>
      </ul>
      <p className="text-gray-700 leading-relaxed mt-8 text-center">Thank you for choosing My E-Shop. Happy Shopping!</p>
    </div>
  );
}

export default AboutPage;
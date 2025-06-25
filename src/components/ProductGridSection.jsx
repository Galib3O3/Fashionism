// components/ProductGridSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProductCard from './FeaturedProductCard'; // Assuming this is used inside

function ProductGridSection({ title, products, linkPath, bgColor = "bg-gray-900", textColor = "text-gray-50" }) {
  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <h2 className={`animate-fade-in-up delay-100 text-3xl md:text-4xl font-bold text-center mb-12 ${textColor}`}>
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No products found in this section.</p>
          )}
        </div>
        <div className="text-center mt-12 animate-fade-in-up delay-600">
          <Link
            to={linkPath}
            className="inline-block bg-gray-800 text-gray-200 font-bold px-8 py-4 rounded-full hover:bg-gray-700 transition duration-300 transform hover:scale-105 border border-gray-700"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductGridSection;
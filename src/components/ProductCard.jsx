import React from 'react';

function ProductImageCard({ product }) {
  return (
    <div className="group relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-white p-2 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      {/* Optional: Overlay for quick view/add to cart on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-sm font-semibold p-2 bg-blue-600 rounded-md">View Details</span>
      </div>
    </div>
  );
}

export default ProductImageCard;
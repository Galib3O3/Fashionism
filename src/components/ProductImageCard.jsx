// src/components/ProductImageCard.jsx
import React from 'react';

function ProductImageCard({ product }) {
  if (!product || !product.imageUrl || !product.name) {
    console.warn('ProductImageCard received invalid product prop:', product);
    return (
      <div className="group relative w-full h-full flex flex-col justify-center items-center overflow-hidden bg-white p-2 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-center text-sm">
          Image Not Available
        </div>
        <p className="text-gray-500 text-sm mt-2 text-center">{product?.name || 'Unknown Product'}</p>
      </div>
    );
  }

  return (
    <div className="group relative w-full h-full flex flex-col justify-between items-center overflow-hidden bg-white p-2 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <img
        src={product.imageUrl} // Ensure this is imageUrl
        alt={product.name}
        className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <div className="mt-2 text-center w-full">
        <p className="text-lg font-semibold text-gray-800 truncate">{product.name}</p>
        {product.size && (
          <p className="text-sm text-gray-500 mt-1">Sizes: {product.size}</p>
        )}
        <p className="text-lg font-bold text-blue-600">${product.price?.toFixed(2) || 'N/A'}</p>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white text-sm font-semibold p-2 bg-blue-600 rounded-md">View Details</span>
      </div>
    </div>
  );
}

export default ProductImageCard;
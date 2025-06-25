// src/components/FeaturedProductCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Keep this for potential future use or other components

function FeaturedProductCard({ product }) {
  // We'll keep CartContext imported for now, but handleAddToCart will change
  const { addToCart } = useContext(CartContext); 

  if (!product || !product.imageUrl || !product.name || typeof product.price === 'undefined' || typeof product.id === 'undefined') {
    console.warn('FeaturedProductCard received invalid product prop:', product);
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 p-6 flex flex-col justify-center items-center text-center min-h-[300px]">
        <p className="text-red-500">Product data missing.</p>
        <p className="text-sm text-gray-400 mt-2">({product?.name || 'Unknown'})</p>
      </div>
    );
  }

  // We are removing the direct addToCart call from this button's onClick
  // The 'Buy Now' button will now act as a navigation link.
  // The product details page will be responsible for adding to cart.

  return (
    <div className=" bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group">
      {/* The entire card is already wrapped in a Link to the product details page.
          So, the "Buy Now" button inside it can also be a Link or a simple button
          that gets its click handled by the parent Link. */}
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/f0e6ff/7f5ad2?text=Image+Error'; }}
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-zinc-950 text-lg font-bold mb-4">৳&nbsp;{product.price.toFixed(2)}</p>
          
          {/* This button will now also navigate to the product details page.
              Since the parent `Link` wraps the entire card including this button,
              clicking the button will naturally trigger the navigation.
              We can remove the specific `onClick` for `handleAddToCart` here,
              as cart logic will reside on the product details page. */}
          <button
            // Removed onClick={handleAddToCart}
            className="w-full bg-zinc-950 text-white py-3 rounded-lg hover:bg-slate-700 transition duration-300 font-medium"
          >
            View Details {/* Changed text from "Buy Now" to "View Details" to reflect new action */}
          </button>
        </div>
      </Link>
    </div>
  );
}

export default FeaturedProductCard;
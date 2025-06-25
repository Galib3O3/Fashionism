import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-10 sticky top-0 z-50">
      <div className="relative container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0 z-10">
          <Link to="/" className="text-gray-900 text-3xl font-extrabold tracking-tight whitespace-nowrap">
            Fashionism<span className="text-gradient-purple"> BD</span>
          </Link>
        </div>

        {/* Center: Nav Links (absolutely centered) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8">
          <Link to="/products?category=new-arrivals" className="text-gray-600 hover:text-purple-600 font-medium transition">New Arrivals</Link>
          <Link to="/products?category=men" className="text-gray-600 hover:text-purple-600 font-medium transition">Men's</Link>
          <Link to="/products?category=women" className="text-gray-600 hover:text-purple-600 font-medium transition">Women's</Link>
          <Link to="/products?category=sale" className="text-gray-600 hover:text-purple-600 font-medium transition">Sale</Link>
        </div>

        {/* Right: Cart + Hamburger */}
        <div className="flex items-center space-x-4 z-10">
          <Link to="/cart" className="relative text-gray-600 hover:text-purple-600 transition duration-300" aria-label="Shopping Cart">
            <FaShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-gray-600 hover:text-purple-600 focus:outline-none"
            aria-label="Toggle navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white w-full absolute left-0 top-full p-4 space-y-4 shadow-md border-t border-gray-100 animate-fade-in-up">
          <Link to="/products?category=new-arrivals" className="text-gray-800 hover:text-purple-600 font-medium w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
          <Link to="/products?category=men" className="text-gray-800 hover:text-purple-600 font-medium w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Men's</Link>
          <Link to="/products?category=women" className="text-gray-800 hover:text-purple-600 font-medium w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Women's</Link>
          <Link to="/products?category=sale" className="text-gray-800 hover:text-purple-600 font-medium w-full text-center py-2" onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
          <Link to="/cart" className="text-gray-800 hover:text-purple-600 font-medium w-full text-center py-2 flex items-center justify-center" onClick={() => setIsMobileMenuOpen(false)}>
            <FaShoppingCart className="mr-2" /> Cart ({cartItems.length})
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom'; // <--- ADD THIS LINE
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'; // For social media icons

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 shadow-inner mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand Info */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Fashionism</h3>
          <p className="text-sm">
            Discover signature wear and fragrances. <br/>
            Quality, style, and comfort.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors duration-200">Shop</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors duration-200">Cart</Link></li>
            <li><Link to="/Track_order" className="hover:text-white transition-colors duration-200">Track Order</Link></li>

          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors duration-200">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Social */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">
            Email: support@Fashionism.com<br/>
            Phone: +880 1234 567890<br/>
            Address: Dhaka, Bangladesh
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-blue-500 transition-colors duration-200"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-pink-500 transition-colors duration-200"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-red-500 transition-colors duration-200"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Fashionism BD . All rights reserved.
      </div>

      <div className="text-center text-gray-500 text-xs mt-2 ">
        Md. Asadullah-Al-Galib
      </div>
    </footer>
  );
}

export default Footer;
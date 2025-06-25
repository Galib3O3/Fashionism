import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Dummy product data - In a real app, this would come from an API
const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Headphones' },
  { id: 2, name: 'Smart Watch', price: 199.50, image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Smart+Watch' },
  { id: 3, name: 'Mechanical Keyboard', price: 120.00, image: 'https://via.placeholder.com/150/008000/FFFFFF?text=Keyboard' },
  { id: 4, name: 'Gaming Mouse', price: 49.99, image: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Gaming+Mouse' },
  { id: 5, name: 'USB-C Hub', price: 35.75, image: 'https://via.placeholder.com/150/800080/FFFFFF?text=USB-C+Hub' },
  { id: 6, name: 'Portable SSD', price: 75.20, image: 'https://via.placeholder.com/150/ADD8E6/000000?text=Portable+SSD' },
];

function ProductsPage() {
  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Products</h2>
      <div className="product-list flex flex-wrap justify-center gap-5"> {/* gap-5 is 20px */}
        {products.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="no-underline text-inherit"> {/* Remove default link styles */}
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
import React from 'react';
import { Link } from 'react-router-dom';

function ProductTypeCard({ type, description, buttonText, bgColor, linkTo = '/products' }) {
  return (
    <div className={`p-8 rounded-lg shadow-md text-gray-900 ${bgColor} flex flex-col justify-between items-center text-center h-full`}>
      <div>
        <h3 className="text-3xl font-bold mb-2">{type}</h3>
        <p className="text-sm mb-6">{description}</p>
      </div>
      <Link
        to={linkTo}
        className="mt-auto inline-block border border-gray-900 text-gray-900 px-6 py-2 rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default ProductTypeCard;
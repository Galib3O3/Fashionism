import React from 'react';

function CheckoutPage() {
  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h2>
      <p className="text-gray-600 text-center mb-6">This is where customers will finalize their purchase.</p>
      <form className="max-w-2xl mx-auto p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h3>
        <div className="mb-5">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name:</label>
          <input type="text" id="name" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="John Doe" />
        </div>
        <div className="mb-5">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
          <input type="text" id="address" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="123 Main St" />
        </div>
        <div className="mb-5">
          <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
          <input type="text" id="city" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="Anytown" />
        </div>
        <div className="mb-5">
          <label htmlFor="zip" className="block text-gray-700 text-sm font-bold mb-2">Zip Code:</label>
          <input type="text" id="zip" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500" placeholder="12345" />
        </div>
        {/* Add more fields (e.g., payment info) as needed */}
        <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
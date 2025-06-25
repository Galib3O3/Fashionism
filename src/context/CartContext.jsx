// src/context/CartContext.jsx (or CartContext.js)
import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast for notifications

// Create the CartContext
export const CartContext = createContext();

// Create the CartProvider component
export const CartProvider = ({ children }) => {
  // Initialize cart items from localStorage, or an empty array if nothing is saved
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return []; // Return empty cart on error
    }
  });

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
      toast.error("Cart could not be saved due to storage issues.");
    }
  }, [cartItems]); // Dependency array ensures effect runs when cartItems changes

  // Function to add a product to the cart
  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // If product exists, update its quantity
      const updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCartItems);
      // Optional: Show a toast notification that quantity was updated
      // toast(`Increased quantity of ${product.name}`, { icon: '➕' });
    } else {
      // If product is new, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      // Optional: Show a toast notification that product was added
      // toast.success(`${product.name} added to cart!`);
    }
  };

  // Function to remove a product from the cart by its ID
  const removeFromCart = (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    toast.error('Item removed from cart.', { duration: 1500 });
  };

  // Function to update the quantity of a specific product in the cart
  const updateQuantity = (id, newQuantity) => {
    // Ensure new quantity is at least 1 (or 0 if you want to allow removal by setting to 0)
    if (newQuantity < 1) {
      removeFromCart(id); // If quantity goes to 0 or less, remove the item
      return;
    }

    const updatedCartItems = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCartItems);
    // toast.success(`Quantity of ${updatedItem.name} updated.`); // Optional toast
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
    toast.success('Your cart has been cleared!', { duration: 2000 });
  };

  // Calculate the total number of items in the cart (sum of quantities)
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate the overall total price of all items in the cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Provide the cart state and functions to consumers of the context
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // Make clearCart available
        getTotalItems, // Get total count of items (for e.g., navbar cart icon)
        getCartTotal, // Get total price of cart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
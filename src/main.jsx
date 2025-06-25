// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// --- Import your layout and page components ---
import MainLayout from './Layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import TrackOrderPage from './pages/TrackOrder';

// Import CartContext Provider
import { CartProvider } from './context/CartContext'; // CartProvider is already here and used

const router = createBrowserRouter([
  {
    path: '/',
    // MainLayout is wrapped with CartProvider here,
    // ensuring cart context is available to all child routes.
    element: (
      <CartProvider>
        <MainLayout />
      </CartProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      // We need a dynamic route that can handle products from different collections
      // For simplicity, we'll stick to 'products/:id' and handle collection lookup
      // within ProductDetailPage for now, but a more robust solution would be:
      // path: ':collectionName/:id'
      {
        path: 'products/:id', // Can be any product ID from any collection
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
       {
        path: 'Track_order',
        element: <TrackOrderPage/>,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
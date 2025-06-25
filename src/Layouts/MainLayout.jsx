// src/Layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/*
        Fixed Header: This ensures the Navbar always stays at the top of the viewport
        regardless of scrolling.
        - fixed: Positions the element relative to the viewport.
        - top-0, left-0, w-full: Places it across the entire top edge of the screen.
        - z-50: Ensures it stays above other content.
        - bg-white, shadow-md: Visual styling for the navbar.
      */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </header>

      {/*
        Main content area:
        - flex-grow: Allows it to expand and push the footer down.
        - container mx-auto px-4 py-5: Standard layout container.
        - pt-16: CRUCIAL! Adds top padding to the main content to prevent it from
                 being hidden underneath the fixed navbar.
                 'pt-16' corresponds to 4rem or 64px. You might need to adjust
                 this value (e.g., 'pt-20' for 5rem/80px, or a custom value like 'pt-[72px]')
                 based on the exact height of your Navbar component.
      */}
      <main className="flex-grow container mx-auto px-4 py-5 pt-16">
        <Outlet />
      </main>

      <Footer />

      {/* Toaster component for professional notifications */}
       
    </div>
  );
}

export default MainLayout;
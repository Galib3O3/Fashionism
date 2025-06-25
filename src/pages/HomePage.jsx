import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageBanner from '../components/ImageBanner';
import ProductTypeCard from '../components/ProductTypeCard';
import FeatureCard from '../components/FeatureCard';
import FeaturedProductCard from '../components/FeaturedProductCard';
import ProductGridSection from '../components/ProductGridSection';
import { FaStar, FaTruck } from 'react-icons/fa';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'; // Ensure doc and getDoc are imported
import { db } from '../firebase';
import CustomShoeIcon from '../components/CustomShoeIcon';

function HomePage() {
  const [headingImages, setHeadingImages] = useState([]);
  const [shoeProductsNormal, setShoeProductsNormal] = useState([]);
  const [favShoeProducts, setFavShoeProducts] = useState([]);
  const [bestsellersProducts, setBestsellersProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // --- CORRECTED SECTION based on your screenshot ---
        // Collection: 'heading_image'
        // Document ID: 'main_heading_banner'
        // Field containing URL: 'image'
        const mainHeadingBannerDocRef = doc(db, 'heading_image', 'main_heading_banner'); // Use the correct document ID
        const mainHeadingBannerSnapshot = await getDoc(mainHeadingBannerDocRef);

        if (mainHeadingBannerSnapshot.exists()) {
          setHeadingImages([{
            id: mainHeadingBannerSnapshot.id,
            ...mainHeadingBannerSnapshot.data(),
            imageUrl: mainHeadingBannerSnapshot.data().image // Map the 'image' field to 'imageUrl'
          }]);
        } else {
          console.warn("Document 'main_heading_banner' does not exist in 'heading_image' collection.");
          setHeadingImages([]);
        }
        // --- END CORRECTED SECTION ---

        // Fetch 'shoe' collection where category is "Normal"
        const shoeCollectionRef = collection(db, 'shoe');
        const normalShoesQuery = query(shoeCollectionRef, where("category", "==", "Normal"));
        const normalShoeSnapshot = await getDocs(normalShoesQuery);
        const fetchedNormalShoes = normalShoeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShoeProductsNormal(fetchedNormalShoes);

        // Fetch 'fav_shoe' collection (for "FAVOURITE SHOES (Special Picks)")
        const favShoeCollectionRef = collection(db, 'fav_shoe');
        const favShoeSnapshot = await getDocs(favShoeCollectionRef);
        const fetchedFavShoes = favShoeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFavShoeProducts(fetchedFavShoes);

        // Fetch for "Our Bestsellers" section
        const allShoesSnapshot = await getDocs(shoeCollectionRef);
        const fetchedAllShoes = allShoesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBestsellersProducts(fetchedAllShoes.slice(0, 4));

      } catch (err) {
        console.error("Error fetching data from Firestore:", err);
        setError("Failed to load content. Please check your internet or Firebase setup, and Firestore rules.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  // heroBanner will now correctly use the 'imageUrl' property which is mapped from 'image'
  const heroBanner = headingImages[0] || {  };

  // If you only have ONE heading image for the hero, you might consider removing
  // the 'stylishSneakerImage' variable if it's not used elsewhere.
  const stylishSneakerImage = headingImages.find(img => img.type === 'stylish_sneaker' || img.name === 'stylish_sneaker_banner') || { imageUrl: 'https://placehold.co/600x400/ffffff/333333?text=Stylish+Footwear' };


  const whyChooseFeatures = [
    { icon: FaStar, title: 'Unrivaled Quality', description: 'Meticulously crafted with the finest materials for enduring elegance.' },
    { icon: CustomShoeIcon, title: 'Precision Fit', description: 'Our bespoke fitting ensures unparalleled comfort and a flawless silhouette.' },
    { icon: FaTruck, title: 'Expedited Global Delivery', description: 'Complimentary, swift shipping on all orders, worldwide.' },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-gray-50 py-20 md:py-32 overflow-hidden shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          {/* Left Content Area */}
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="animate-fade-in-right delay-200 text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Step Into <span className="text-gray-700">Refined Style</span> & Comfort
            </h1>
            <p className="animate-fade-in-right delay-400 text-lg md:text-xl text-gray-700 mb-10 max-w-xl mx-auto md:mx-0">
              Discover our curated collection of footwear, where timeless design meets supreme wearability.
            </p>
            <Link
              to="/products"
              className="animate-pop-in delay-800 inline-block bg-black text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-800 transform hover:scale-105 transition duration-300 ease-in-out text-lg"
            >
              Explore Collection
            </Link>
          </div>
          {/* Right Image Area */}
          <div className="md:w-1/2 flex justify-center">
            <img src={heroBanner.imageUrl} // This will now use the 'image' field's URL
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/ffffff/333333?text=Premium+Footwear'; }}
              alt="Hero Shoe Image"
              className="animate-fade-in-left delay-500 w-full max-w-md lg:max-w-lg rounded-2xl shadow-md object-cover transform rotate-3 border border-gray-200" />
          </div>
        </div>
      </section>

      {/* "Our Bestsellers" Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="animate-fade-in-up delay-100 text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Our Distinguished Bestsellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bestsellersProducts.length > 0 ? (
              bestsellersProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-700">No distinguished bestsellers found.</p>
            )}
          </div>
          <div className="text-center mt-12 animate-fade-in-up delay-600">
            <Link
              to="/products"
              className="inline-block bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition duration-300 transform hover:scale-105 border border-gray-300"
            >
              View Entire Collection
            </Link>
          </div>
        </div>
      </section>

      {/* NEW DEDICATED SECTION: "Shop Our Normal Shoes Collection" */}
      {shoeProductsNormal.length > 0 && (
        <ProductGridSection
          title="Curated Everyday Footwear"
          products={favShoeProducts}
          linkPath="/products?category=Normal"
          bgColor="bg-gray-50"
          textColor="text-gray-900"
        />
      )}

      {/* FAVOURITE SHOES Section from Firestore 'fav_shoe' collection */}
      {/* {favShoeProducts.length > 0 && (
        <ProductGridSection
          title="Exclusive Selections (Editor's Picks)"
          products={favShoeProducts}
          linkPath="/products?category=fav-shoes"
          bgColor="bg-white"
          textColor="text-gray-900"
        />
      )} */}

      {/* "Why Choose Stride&Style?" Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="animate-fade-in-up delay-100 text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            The Stride&Style Distinction
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor="text-gray-700"
                titleColor="text-gray-900"
                descriptionColor="text-gray-700"
                bgColor="bg-gray-50"
                shadow="shadow-md"
                borderColor="border-gray-200"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Subscription Section */}
      {/* <section className="py-16 bg-gray-100 text-gray-900 text-center shadow-inner">
        <div className="container mx-auto px-4">
          <h2 className="animate-fade-in-up delay-100 text-3xl md:text-4xl font-bold mb-6">
            Receive Exclusive Updates
          </h2>
          <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for early access to new collections and bespoke offers.
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto animate-pop-in delay-300">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full sm:flex-grow p-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-gray-300"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-black text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-800 transform hover:scale-105 transition duration-300 ease-in-out border border-gray-300"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
}

export default HomePage;
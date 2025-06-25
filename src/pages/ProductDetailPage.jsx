// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { CartContext } from '../context/CartContext';
// toast import removed
import { FaShoppingCart } from 'react-icons/fa';
import FeaturedProductCard from '../components/FeaturedProductCard';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mainImage, setMainImage] = useState('');
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
  const [relatedProductsError, setRelatedProductsError] = useState(null);

  // --- Start of useEffect Hooks (MUST be at the top level) ---

  // Effect to fetch product details and related products from Firestore
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      setError(null);
      setRelatedProductsLoading(true);

      let productData = null; // Declare productData here for scope
      try {
        // 1. Attempt to fetch main product from the 'shoe' collection
        const shoeProductRef = doc(db, 'shoe', id);
        const shoeProductSnap = await getDoc(shoeProductRef);

        if (shoeProductSnap.exists()) {
          productData = { id: shoeProductSnap.id, ...shoeProductSnap.data() };
          console.log(`Product found in 'shoe' collection with ID: ${id}`);
        } else {
          // 2. If not found in 'shoe', attempt to fetch from 'fav_shoe' collection
          console.log(`Product with ID: ${id} not found in 'shoe' collection. Checking 'fav_shoe'.`);
          const favShoeProductRef = doc(db, 'fav_shoe', id);
          const favShoeProductSnap = await getDoc(favShoeProductRef);

          if (favShoeProductSnap.exists()) {
            productData = { id: favShoeProductSnap.id, ...favShoeProductSnap.data() };
            console.log(`Product found in 'fav_shoe' collection with ID: ${id}`);
          } else {
            console.warn(`Product with ID: ${id} not found in either 'shoe' or 'fav_shoe' collections.`);
            setError("Product not found."); // Product with this ID does not exist in either
          }
        }

        if (productData) {
          setProduct(productData);
          setMainImage(productData.imageUrl || 'https://placehold.co/800x600/ece9f4/6b4e94?text=Image+Not+Available');

          // --- FIX: Safely handle productData.size to avoid 'split' on undefined ---
          const sizesArray = (typeof productData.size === 'string' && productData.size) // Ensure it's a string AND not null/undefined
            ? productData.size.split(',').map(s => s.trim()).filter(s => s)
            : (Array.isArray(productData.size) ? productData.size : []); // Fallback to array or empty array

          setSelectedSize(sizesArray?.[0] || '');
          setSelectedColor(productData.availableColors?.[0]?.value || '');
        }

      } catch (err) {
        console.error("Error fetching main product:", err);
        setError("Failed to load product details. Please check your internet or try again.");
      } finally {
        setLoading(false); // Main product loading complete
      }

      // 3. Fetch Related Products (from both 'shoe' and 'fav_shoe' collections)
      try {
        const shoeCollectionRef = collection(db, 'shoe');
        const favShoeCollectionRef = collection(db, 'fav_shoe'); // Reference to fav_shoe collection

        let fetchedCombinedProducts = [];
        const seenIds = new Set(); // To store unique product IDs and avoid duplicates

        // Fetch from 'shoe' collection first
        let shoeRelatedQuery = query(shoeCollectionRef);
        // Filter by category if main product has one
        if (productData && productData.category) {
          shoeRelatedQuery = query(shoeCollectionRef, where('category', '==', productData.category));
        }
        const shoeQuerySnapshot = await getDocs(shoeRelatedQuery);
        shoeQuerySnapshot.docs.forEach(doc => {
          if (doc.id !== id && !seenIds.has(doc.id)) { // Exclude current product and avoid duplicates
            fetchedCombinedProducts.push({ id: doc.id, ...doc.data() });
            seenIds.add(doc.id);
          }
        });

        // Fetch from 'fav_shoe' collection (if not already found in 'shoe' and unique)
        let favShoeRelatedQuery = query(favShoeCollectionRef);
        // Can also filter fav_shoe by category if they have it
        if (productData && productData.category) {
            favShoeRelatedQuery = query(favShoeCollectionRef, where('category', '==', productData.category));
        }
        const favShoeQuerySnapshot = await getDocs(favShoeRelatedQuery);
        favShoeQuerySnapshot.docs.forEach(doc => {
          if (doc.id !== id && !seenIds.has(doc.id)) { // Exclude current product and avoid duplicates
            fetchedCombinedProducts.push({ id: doc.id, ...doc.data() });
            seenIds.add(doc.id);
          }
        });

        // Shuffle and take the first 4 related products
        const shuffledAndLimitedProducts = fetchedCombinedProducts
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 4); // Limit to 4

        setRelatedProducts(shuffledAndLimitedProducts);

      } catch (err) {
        console.error("Error fetching related products:", err);
        setRelatedProductsError("Failed to load related products.");
      } finally {
        setRelatedProductsLoading(false); // Related products loading complete
      }
    };

    if (id) {
      fetchProductAndRelated();
    }
  }, [id]); // Effect depends on product ID

  // Effect to warn about missing sizes/colors (moved to top-level)
  useEffect(() => {
    // Only run this check after product data has loaded and there's no overall error
    if (!loading && product && !error) {
      const currentProductAvailableSizes = (typeof product.size === 'string' && product.size)
        ? product.size.split(',').map(s => s.trim()).filter(s => s)
        : (Array.isArray(product.size) ? product.size : []);

      // Check for missing/empty sizes
      if (currentProductAvailableSizes.length === 0) {
        console.warn(`Product ${product.id} (${product.name}) does not have valid size data in Firestore. Size selection will be hidden.`);
        // toast.info removed
      }

      // Check for missing/empty colors
      if (!product.availableColors || product.availableColors.length === 0) {
        console.warn(`Product ${product.id} (${product.name}) does not have 'availableColors' in Firestore. Color selection will be hidden.`);
        // toast.info removed
      }
    }
  }, [loading, product, error]); // Dependencies for this effect

  // --- End of useEffect Hooks ---

  const handleThumbnailClick = (imageSrc, index) => {
    setMainImage(imageSrc);
    setSelectedThumbnailIndex(index);
  };

  const handleQuantityChange = (type) => {
    setQuantity(prevQuantity => {
      if (type === 'decrement') {
        return Math.max(1, prevQuantity - 1);
      } else {
        return prevQuantity + 1;
      }
    });
  };

  const handleAddToCart = () => {
    if (!product) {
      console.error("Product data not loaded."); // Replaced toast.error
      return;
    }

    // --- FIX: Safely access product.size for validation ---
    const sizesForValidation = (typeof product.size === 'string' && product.size) ? product.size.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(product.size) ? product.size : []);
    const colorsForValidation = product.availableColors && product.availableColors.length > 0 ? product.availableColors : [];


    if (sizesForValidation.length > 0 && !selectedSize) {
      console.error("Please select a size."); // Replaced toast.error
      return;
    }
    if (colorsForValidation.length > 0 && !selectedColor) {
      console.error("Please select a color."); // Replaced toast.error
      return;
    }

    addToCart({
      ...product,
      quantity: quantity,
      selectedSize: selectedSize || (sizesForValidation.length > 0 ? '' : 'N/A'),
      selectedColor: selectedColor || (colorsForValidation.length > 0 ? '' : 'N/A'),
    });
    console.log(`${product.name} (Size: ${selectedSize || 'N/A'}, Color: ${selectedColor || 'N/A'}) added to cart!`); // Replaced toast.success
  };

  const handleBuyItNow = () => {
    if (!product) {
      console.error("Product data not loaded."); // Replaced toast.error
      return;
    }
    // --- FIX: Safely access product.size for validation ---
    const sizesForValidation = (typeof product.size === 'string' && product.size) ? product.size.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(product.size) ? product.size : []);
    const colorsForValidation = product.availableColors && product.availableColors.length > 0 ? product.availableColors : [];

    if (sizesForValidation.length > 0 && !selectedSize) {
      console.error("Please select a size."); // Replaced toast.error
      return;
    }
    if (colorsForValidation.length > 0 && !selectedColor) {
      console.error("Please select a color."); // Replaced toast.error
      return;
    }
    console.info("Buy It Now functionality is coming soon!"); // Replaced toast.info
    console.log(`Buying ${product.name} (Size: ${selectedSize || 'N/A'}, Color: ${selectedColor || 'N/A'}, Qty: ${quantity}) now!`);
  };

  // --- Conditional Renderings for Loading/Error States (must come after all hooks) ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-gray-700">
        <p className="text-xl animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!product) { // This handles case where product is null after loading (e.g., ID not found)
    return (
      <div className="text-center py-10 text-gray-600">
        <p className="text-xl">Product not found.</p>
      </div>
    );
  }

  // --- Data preparation for rendering (derived states - must come after product is confirmed) ---
  const productGalleryImages = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.imageUrl];

  // --- FIX: Safely access product.size for rendering ---
  const productAvailableSizes = (typeof product.size === 'string' && product.size)
    ? product.size.split(',').map(s => s.trim()).filter(s => s)
    : (Array.isArray(product.size) ? product.size : []);

  const productAvailableColors = product.availableColors && product.availableColors.length > 0
    ? product.availableColors
    : [];

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Product Details Section */}
      <section className="bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 animate-fade-in-up delay-100">
        {/* Product Image Gallery (Left Column) */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full mb-4 rounded-xl overflow-hidden shadow-lg">
            <img
              src={mainImage}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/ece9f4/6b4e94?text=Image+Error'; }}
              alt={`Main product image of ${product.name}`}
              className="w-full h-auto object-cover rounded-xl transition duration-300 ease-in-out"
            />
          </div>
          {/* Thumbnails Gallery - Only show if more than one image available (main image + at least one gallery image) */}
          {productGalleryImages.length > 1 && (
            <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {productGalleryImages.map((imageSrc, index) => (
                <img
                  key={index}
                  src={imageSrc}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/120x90/ece9f4/6b4e94?text=Thumb+${index + 1}`; }}
                  alt={`Product thumbnail ${index + 1}`}
                  onClick={() => handleThumbnailClick(imageSrc, index)}
                  className={`thumbnail-image w-24 h-auto rounded-lg shadow-sm
                    ${selectedThumbnailIndex === index ? 'selected border-purple-500 shadow-md' : 'border-transparent hover:border-purple-300'}
                    cursor-pointer transition duration-200 ease-in-out`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information (Right Column) */}
        <div className="md:w-1/2">
          <h1 className="animate-fade-in delay-200 text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <p className="animate-fade-in delay-300 text-xl text-gray-600 mb-4">By Fashionism</p>
          <div className="animate-fade-in delay-400 flex items-baseline mb-6">
            <span className="text-xl font-bold text-zinc-950">TK.&nbsp;{product.price.toFixed(2)}</span>
            {/* Display sale price if available and less than original price */}
            {product.originalPrice && product.salePrice && product.salePrice < product.originalPrice && (
                <>
                    <span className="text-lg text-gray-500 ml-2 line-through">TK.&nbsp;{product.originalPrice.toFixed(2)}</span>
                    <span className="ml-3 text-sm font-semibold text-red-500">
                        SAVE {(100 - (product.salePrice / product.originalPrice) * 100).toFixed(0)}%
                    </span>
                </>
            )}
          </div>

          <p className="animate-fade-in delay-500 text-gray-700 leading-relaxed mb-6">
            {product.description || 'Experience the perfect blend of metropolitan style and ultimate comfort. This product features a lightweight design, responsive cushioning, and a durable, breathable knit upper. Ideal for city exploration or your daily routine.'}
          </p>

          {/* Size Selection - Only show if productAvailableSizes are provided */}
          {productAvailableSizes.length > 0 && (
            <div className="animate-fade-in delay-600 mb-6">
              <label className="block text-gray-800 text-lg font-semibold mb-3">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {productAvailableSizes.map(size => (
                  <label
                    key={size}
                    className={`cursor-pointer px-4 py-2 border-2 rounded-lg text-gray-700
                      ${selectedSize === size
                        ? 'bg-zinc-950 text-white border-zinc-600'
                        : 'border-gray-300 hover:border-zinc-500'
                      } transition duration-200 flex items-center justify-center`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                      className="hidden" // Hide the default radio button
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection - Only show if availableColors are provided */}
          {productAvailableColors.length > 0 && (
            <div className="animate-fade-in delay-700 mb-6">
              <label className="block text-gray-800 text-lg font-semibold mb-3">Color</label>
              <div className="flex items-center gap-3">
                {productAvailableColors.map(color => (
                  <label
                    key={color.value}
                    className={`cursor-pointer w-9 h-9 rounded-full border-2
                      ${selectedColor === color.value ? 'border-purple-600' : 'border-gray-300'}
                      ${color.className} flex items-center justify-center transition duration-200`}
                    title={color.name}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color.value}
                      checked={selectedColor === color.value}
                      onChange={() => setSelectedColor(color.value)}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="animate-fade-in delay-800 mb-8 flex items-center gap-4">
            <label htmlFor="quantity" className="text-gray-800 text-lg font-semibold">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="quantity-btn bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition duration-200"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800"
              />
              <button
                onClick={() => handleQuantityChange('increment')}
                className="quantity-btn bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300 transition duration-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-pop-in delay-900 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex-1 bg-zinc-950 text-white font-bold py-4 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-105 transition duration-300 ease-in-out text-lg flex items-center justify-center"
            >
              <FaShoppingCart className="inline-block mr-2 text-xl" />
              Add to Cart
            </button>
            {/* <button
              onClick={handleBuyItNow}
              className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-full shadow-md hover:bg-gray-300 transform hover:scale-105 transition duration-300 ease-in-out text-lg"
            >
              Buy It Now
            </button> */}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (Static) */}
      <section className="py-16 md:py-24 animate-fade-in-up delay-200">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Review Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in-up delay-300">
            <div className="flex items-center mb-3">
              <div className="text-yellow-400 flex text-lg">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <span className="text-gray-500 ml-2 text-sm">5.0</span>
            </div>
            <p className="text-gray-700 italic mb-4">"These are my new favorite shoes! Incredibly comfortable for my daily commute."</p>
            <p className="text-gray-500 font-medium">- Jane D.</p>
          </div>
          {/* Review Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in-up delay-400">
            <div className="flex items-center mb-3">
              <div className="text-yellow-400 flex text-lg">
                {[...Array(4)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <span className="text-gray-500 ml-2 text-sm">4.5</span>
            </div>
            <p className="text-gray-700 italic mb-4">"Stylish and well-made. A little snug at first but broke in nicely. Highly recommend!"</p>
            <p className="text-gray-500 font-medium">- Mark S.</p>
          </div>
          {/* Review Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in-up delay-500">
            <div className="flex items-center mb-3">
              <div className="text-yellow-400 flex text-lg">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <span className="text-gray-500 ml-2 text-sm">5.0</span>
            </div>
            <p className="text-gray-700 italic mb-4">"Fantastic versatile shoe. Looks great with jeans or chinos. Very happy with this purchase."</p>
            <p className="text-gray-500 font-medium">- Chris R.</p>
          </div>
        </div>
        <div className="text-center mt-12 animate-fade-in-up delay-600">
          <button className="inline-block bg-gray-200 text-gray-800 font-bold px-8 py-4 rounded-full hover:bg-gray-300 transition duration-300 transform hover:scale-105">
            Read All Reviews
          </button>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-16 md:py-24 bg-gray-50 rounded-2xl shadow-inner animate-fade-in-up delay-300">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          You Might Also Like
        </h2>
        {relatedProductsLoading ? (
          <p className="text-center text-gray-500 py-8">Loading related products...</p>
        ) : relatedProductsError ? (
          <p className="text-center text-red-600 py-8">{relatedProductsError}</p>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {relatedProducts.map((p, index) => (
              <FeaturedProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No related products found.</p>
        )}
      </section>
    </main>
  );
}

export default ProductDetailPage;

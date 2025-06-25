// src/pages/CartPage.jsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaLock, FaTrashAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
// Firebase Firestore Imports
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast'; // For professional notifications
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  // --- Component States ---
  const [billingDetails, setBillingDetails] = useState({
    fullName: '', mobileNumber: '', district: '', fullAddress: ''
  });
  const [mobileNumberError, setMobileNumberError] = useState('');
  const deliveryCharge = billingDetails.district === 'Dhaka' ? 60 : (billingDetails.district ? 100 : 0);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [transactionId, setTransactionId] = useState('');
  const [transactionIdError, setTransactionIdError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data for Dropdowns and Validation ---
  const bangladeshDivisions = [
    "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"
  ];
  const bangladeshiMobileOperatorsRegex = [
    /^017\d{8}$/, /^013\d{8}$/,
    /^018\d{8}$/,
    /^016\d{8}$/,
    /^019\d{8}$/, /^014\d{8}$/,
    /^015\d{8}$/,
  ];

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setBillingDetails(prevDetails => ({ ...prevDetails, mobileNumber: value }));
    if (value.trim() === "") setMobileNumberError("Mobile number is required.");
    else {
      const isValid = bangladeshiMobileOperatorsRegex.some(regex => regex.test(value));
      setMobileNumberError(isValid ? "" : "Invalid Bangladeshi mobile number format (e.g., 017xxxxxxxxx).");
    }
  };

  const handleTransactionIdChange = (e) => {
    const value = e.target.value;
    setTransactionId(value);
    if (paymentMethod !== 'cash_on_delivery' && value.trim() === '') setTransactionIdError('Transaction ID is required.');
    else setTransactionIdError('');
  };

  const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculateTotal = () => (calculateSubtotal() + deliveryCharge).toFixed(2);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!billingDetails.fullName || !billingDetails.mobileNumber || !billingDetails.district || !billingDetails.fullAddress) {
      toast.error('Please fill in all required billing information.'); setIsSubmitting(false); return;
    }
    if (mobileNumberError) { toast.error('Please correct the mobile number format.'); setIsSubmitting(false); return; }
    if (paymentMethod !== 'cash_on_delivery' && transactionId.trim() === '') { toast.error('Please enter the Transaction ID.'); setIsSubmitting(false); return; }
    if (cartItems.length === 0) { toast.error('Your cart is empty. Please add items before placing an order.'); setIsSubmitting(false); return; }
    if (!billingDetails.district) { toast.error('Please select a district for delivery calculation.'); setIsSubmitting(false); return; }

    const currentOrderItems = cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.selectedSize || item.size || 'N/A', // Use selectedSize from cart, fallback to item.size, then N/A
      imageUrl: item.imageUrl || ''
    }));
    const generatedOrderId = uuidv4();

    const orderData = {
      customerName: billingDetails.fullName, customerMobile: billingDetails.mobileNumber,
      deliveryAddress: billingDetails.fullAddress, deliveryDistrict: billingDetails.district,
      deliveryCharge: deliveryCharge, items: currentOrderItems, orderDate: serverTimestamp(),
      orderId: generatedOrderId, paymentMethod: paymentMethod, promoCode: promoCode || null,
      status: "Pending", subTotal: parseFloat(calculateSubtotal().toFixed(2)),
      totalAmount: parseFloat(calculateTotal()),
      transactionId: (paymentMethod !== 'cash_on_delivery') ? transactionId : null,
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log("Order placed successfully. Document ID: ", docRef.id);
      toast.success(`Order placed! Order ID: ${generatedOrderId}`, { duration: 5000 });
      setConfirmedOrderDetails({
        orderId: generatedOrderId, items: currentOrderItems, totalAmount: parseFloat(calculateTotal())
      });
      setShowConfirmationModal(true);

      if (clearCart) clearCart();
      setBillingDetails({ fullName: '', mobileNumber: '', district: '', fullAddress: '' });
      setMobileNumberError(''); setPaymentMethod('cash_on_delivery');
      setTransactionId(''); setTransactionIdError(''); setPromoCode('');

    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !showConfirmationModal) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Shopping Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-block px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 text-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
        Please fill out the form below with correct information to place your order
      </h2>
      <div className="border-t-2 border-gray-300 border-dashed w-full max-w-2xl mx-auto mb-8"></div>

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Billing Details</h3>

            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input type="text" id="fullName" name="fullName" value={billingDetails.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition duration-200" required />
            </div>

            <div className="mb-4">
              <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Your Mobile Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" id="mobileNumber" name="mobileNumber" value={billingDetails.mobileNumber} onChange={handleMobileNumberChange} placeholder="Enter Mobile Number (e.g., 017xxxxxxxxx)" className={`w-full px-4 py-2 border ${mobileNumberError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition duration-200`} required />
              {mobileNumberError && <p className="text-red-500 text-xs mt-1">{mobileNumberError}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="district" className="block text-gray-700 text-sm font-bold mb-2">
                Select District <span className="text-red-500">*</span>
              </label>
              <select id="district" name="district" value={billingDetails.district} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition duration-200 bg-white appearance-none pr-8" required>
                <option value="">Select</option>
                {bangladeshDivisions.map(division => (<option key={division} value={division}>{division}</option>))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="fullAddress" className="block text-gray-700 text-sm font-bold mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea id="fullAddress" name="fullAddress" value={billingDetails.fullAddress} onChange={handleInputChange} placeholder="Road Name/Number, House Name/Number, Flat Number" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition duration-200 resize-y" required></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Product Details</h3>

            <div className="grid grid-cols-5 text-gray-600 text-sm font-semibold border-b pb-2 mb-4">
              <span className="col-span-3">Product Name</span>
              <span className="col-span-2 text-right">Selling Price</span>
            </div>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 mr-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain rounded-md" />
                  </div>
                  <div className="flex-grow text-sm">
                    {/* Display product name and selected size */}
                    <p className="font-semibold text-gray-800">
                      {item.name} {item.selectedSize && `(Size: ${item.selectedSize})`} {/* Show size if selected */}
                    </p>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <span>Qty:</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="ml-2 px-2 py-0.5 border border-gray-300 rounded-sm hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                      <span className="mx-2 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 border border-gray-300 rounded-sm hover:bg-gray-100">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                  </div>
                  <p className="text-right text-sm font-bold text-gray-900 ml-4">TK.&nbsp;{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-semibold text-gray-800">
              <div className="flex justify-between border-t border-gray-200 pt-3"><span>Sub-Total (+)</span><span>TK.&nbsp;{calculateSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge (+)</span>
                <span className="text-gray-900 font-semibold">TK.&nbsp;{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="pt-3">
                <span className="block text-gray-700 text-sm font-bold mb-2">Payment Method:</span>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={() => { setPaymentMethod('cash_on_delivery'); setTransactionId(''); setTransactionIdError(''); }} className="form-radio text-black h-4 w-4" />
                    <span className="ml-2 text-gray-800 font-semibold">Cash on delivery <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full ml-1">New</span></span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="form-radio text-black h-4 w-4" />
                    <span className="ml-2 text-gray-800 font-semibold">bKash</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="paymentMethod" value="nagad" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} className="form-radio text-black h-4 w-4" />
                    <span className="ml-2 text-gray-800 font-semibold">Nagad</span>
                  </label>
                </div>
              </div>

              {paymentMethod !== 'cash_on_delivery' && (
                <div className="mt-4">
                  <label htmlFor="transactionId" className="block text-gray-700 text-sm font-bold mb-2">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input type="text" id="transactionId" name="transactionId" value={transactionId} onChange={handleTransactionIdChange} placeholder="Enter Transaction ID" className={`w-full px-4 py-2 border ${transactionIdError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition duration-200`} required={paymentMethod !== 'cash_on_delivery'} />
                  {transactionIdError && <p className="text-red-500 text-xs mt-1">{transactionIdError}</p>}
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-3"><span>Total</span><span>TK.&nbsp;{calculateTotal()}</span></div>
            </div>

            <div className="mt-6 mb-4">
              <label className="flex items-center">
                <input type="checkbox" name="cashOnDelivery" defaultChecked className="form-checkbox text-black h-4 w-4" />
                <span className="ml-2 text-gray-800 font-semibold">Cash on delivery <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full ml-1">New</span></span>
              </label>
            </div>

            <div className="bg-gray-100 text-gray-700 p-4 rounded-md text-sm mb-6">
              <p>Home delivery will be within 5-7 days. No calls will be made during this time.</p>
            </div>

            <div className="flex mb-6">
              <input type="text" placeholder="If you have a Promo Code, Enter here..." value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm" />
              <button type="button" onClick={() => toast.info('Promo code functionality coming soon!')} className="bg-black text-white px-6 py-2 rounded-r-md hover:bg-gray-800 transition-colors duration-300 font-medium">Apply</button>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-md text-xl font-bold flex items-center justify-center hover:bg-gray-800 transition duration-300"
                disabled={isSubmitting} // Disable the button while submitting
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <FaLock className="mr-3" />
                    Confirm Order TK.&nbsp;{calculateTotal()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {showConfirmationModal && confirmedOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You for your Purchase!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-lg font-semibold text-gray-700 mb-2">Order ID: <span className="font-bold text-gray-900">{confirmedOrderDetails.orderId}</span></p>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4">
              {confirmedOrderDetails.items.map(item => (
                <div key={item.name + Math.random()} className="flex items-center justify-between border-b border-gray-100 py-2">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain rounded-md mr-3" />
                    {/* Display product name, quantity, and size here */}
                    <p className="text-gray-800 text-sm">
                      {item.name} (x{item.quantity}) {item.selectedSize && `(Size: ${item.selectedSize})`}
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm">TK.&nbsp;{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <p className="text-xl font-bold text-gray-900">Total Paid: TK.&nbsp;{confirmedOrderDetails.totalAmount}</p>
            </div>

            <button
              onClick={() => setShowConfirmationModal(false)}
              className="mt-6 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 text-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

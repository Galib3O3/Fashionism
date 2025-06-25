// src/pages/TrackOrderPage.jsx
import React, { useState, useEffect } from 'react';
// Import 'db' directly from your Firebase configuration for Firestore access
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct for your project

// Import icons for a better visual experience
import {
  FaSearch, // For search button
  FaSpinner, // For loading spinner (animate-spin)
  FaClipboardCheck, // For 'Delivered' status icon (more fitting than generic checkmark)
  FaExclamationCircle, // For error messages
  FaCheckCircle, // For 'Confirmed' status icon
  FaTruck, // For 'On the Way' status icon
  FaRegListAlt, // For 'Pending' status icon
  FaTimesCircle // For 'Cancelled' status icon (though not in current steps, good to have)
} from 'react-icons/fa';

/**
 * TrackOrderPage component allows users to check the status of their orders
 * by entering an Order ID. It fetches order details from Firestore and displays
 * them along with a visual timeline of the order status.
 */
const TrackOrderPage = () => {
  // State to hold the order ID entered by the user
  const [orderId, setOrderId] = useState('');
  // State to store the fetched order details
  const [orderDetails, setOrderDetails] = useState(null);
  // State to manage loading status during search
  const [isLoading, setIsLoading] = useState(false);
  // State to store and display any error messages
  const [errorMessage, setErrorMessage] = useState('');

  // --- Initial Setup and Firebase Instance Check ---
  useEffect(() => {
    // Check if the Firestore 'db' instance is available
    if (!db) {
      setErrorMessage('Firebase Firestore instance not initialized. Please ensure your firebase.js setup is correct.');
    } else {
      setErrorMessage(''); // Clear error if db is available
    }
  }, []); // Empty dependency array means this effect runs once on component mount

  /**
   * Fetches order details from Firestore based on the entered Order ID.
   * Handles validation, loading states, and error messages.
   */
  const trackOrder = async () => {
    const trimmedOrderId = orderId.trim();

    if (trimmedOrderId.length === 0) {
      setErrorMessage('Please enter an Order ID.');
      setOrderDetails(null); // Clear any previously displayed order
      return;
    }
    if (!db) {
      setErrorMessage('Firebase Firestore not initialized. Cannot fetch order.');
      return;
    }

    setIsLoading(true); // Set loading state to true
    setErrorMessage(null); // Clear any previous errors
    setOrderDetails(null); // Clear previous order data

    try {
      // Construct the Firestore collection reference for Canvas public data.
      const ordersCollectionRef = collection(db, 'orders');

      // Create a query to find the order by its 'orderId' field
      const q = query(ordersCollectionRef, where('orderId', '==', trimmedOrderId));
      const querySnapshot = await getDocs(q);

      // Check if any documents were found
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const data = orderDoc.data();
        setOrderDetails(data);
      } else {
        setErrorMessage('Order not found. Please check the Order ID.');
      }
    } catch (e) {
      console.error('Error fetching order:', e);
      setErrorMessage(`Error fetching order. This might be due to security rules preventing access, an incorrect Order ID, or a network issue: ${e.message || e.toString()}`);
    } finally {
      setIsLoading(false); // Reset loading state when fetching is complete
    }
  };

  /**
   * Determines the active step in the order timeline based on the order's status.
   * @param {string} status - The current status of the order (e.g., 'Pending', 'Confirmed').
   * @returns {number} The index of the active step in the 'steps' array.
   */
  const getActiveStep = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'On the Way': return 2;
      case 'Delivered': return 3;
      default: return -1;
    }
  };

  // Define the order status steps for the timeline visualization
  const steps = ['Pending', 'Confirmed', 'On the Way', 'Delivered'];
  // Determine the current active step index based on the fetched order's status
  const currentStep = orderDetails ? getActiveStep(orderDetails.status) : -1;

  /** Helper for status styling to match Flutter's _getStatusColor */
  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-orange-600';
      case 'confirmed': return 'text-green-600';
      case 'on the way': return 'text-blue-600';
      case 'delivered': return 'text-black';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  /** Helper for status icons to match Flutter's _getStatusIcon */
  const getStatusDisplayIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return FaRegListAlt;
      case 'confirmed': return FaCheckCircle;
      case 'on the way': return FaTruck;
      case 'delivered': return FaClipboardCheck;
      case 'cancelled': return FaTimesCircle;
      default: return FaExclamationCircle;
    }
  };

  // Responsive detail item component
  const DetailItem = ({ label, value }) => (
    <div className="w-full sm:w-1/2 py-1.5 px-2">
      <span className="text-sm font-medium text-gray-600">{label}: </span>
      <span className="text-sm font-semibold text-gray-800 break-words">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 md:px-12 lg:px-24 py-4 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Track Your Order</h1>

        {/* Order ID Input Section */}
        <div className="mb-6 bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-100">
          <label htmlFor="orderId" className="block text-gray-700 text-sm font-medium mb-2">
            Enter Order ID:
          </label>
          <div className="flex flex-col sm:flex-row rounded-md overflow-hidden shadow-sm">
            <input
              type="text"
              id="orderId"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-t-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400 mb-2 sm:mb-0"
              placeholder="e.g., 2cDhvnGr2cC940ilZ7C5"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  trackOrder();
                }
              }}
            />
            <button
              onClick={trackOrder}
              className="px-6 py-2 bg-black text-white font-semibold rounded-b-md sm:rounded-r-md sm:rounded-b-none hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin text-lg mr-2" />
              ) : (
                <FaSearch className="text-lg mr-2" />
              )}
              {isLoading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        </div>

        {/* Error Message Display Section */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg shadow-sm flex items-center" role="alert">
            <FaExclamationCircle className="text-xl mr-3" />
            <p className="font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Order Details Display Section */}
        {orderDetails && (
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-100">
            {/* Status Icon and Text */}
            {/* <div className="flex flex-col items-center mb-6">
              {React.createElement(getStatusDisplayIcon(orderDetails.status), {
                className: `${getStatusColorClass(orderDetails.status)} text-6xl mb-2`
              })}
              <p className={`text-3xl font-bold ${getStatusColorClass(orderDetails.status)}`}>
                {orderDetails.status}
              </p>
            </div> */}

             <div className="mb-10 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Timeline</h3>
              <div className="relative flex flex-wrap justify-between items-start gap-y-4 sm:gap-x-4">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center flex-1 min-w-[100px] sm:min-w-[unset]">
                      {/* Timeline Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${index <= currentStep ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'}
                      `}>
                        {index < currentStep && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                        {index === currentStep && (
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                      {/* Step Name (e.g., "Pending", "Delivered") */}
                      <div className={`mt-2 text-center text-sm font-medium whitespace-nowrap
                          ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                      `}>
                        {step}
                      </div>
                    </div>
                    {/* Horizontal line connecting timeline steps (only for horizontal layout) */}
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block flex-grow mx-2 h-0.5
                        ${index < currentStep ? 'bg-black' : 'bg-gray-300'}
                      `}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Details</h2>
            {/* Responsive Grid for order details */}
            <div className="flex flex-wrap -mx-2 mb-4">
              {/* <DetailItem label="Order ID" value={orderDetails.orderId} /> */}
              <DetailItem label="Customer Name" value={orderDetails.customerName} />
              <DetailItem label="Mobile" value={orderDetails.customerMobile} />
              <DetailItem label="Address" value={`${orderDetails.deliveryAddress}, ${orderDetails.deliveryDistrict}`} />
              {/* {orderDetails.promoCode && orderDetails.promoCode.length > 0 &&
                <DetailItem label="Promo Code" value={orderDetails.promoCode} />}
              <DetailItem label="Payment Method" value={orderDetails.paymentMethod.replace(/_/g, ' ')} /> */}
              {orderDetails.transactionId && orderDetails.transactionId.length > 0 &&
                <DetailItem label="Transaction ID" value={orderDetails.transactionId} />}
              {/* <DetailItem label="Order Date" value={new Date(orderDetails.orderDate.seconds * 1000).toLocaleString('en-BD', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                  hour12: true, timeZone: 'Asia/Dhaka' // Specify Bangladesh time zone
                })} /> */}
              {/* <DetailItem label="Sub-Total" value={`TK. ${orderDetails.subTotal.toFixed(2)}`} /> */}
              <DetailItem label="Delivery Charge" value={`TK. ${orderDetails.deliveryCharge.toFixed(2)}`} />
              <DetailItem label="Total Amount" value={`TK. ${orderDetails.totalAmount.toFixed(2)}`} />
            </div>
            {/* Horizontal Divider Line */}
            <hr className="border-t border-gray-200 my-4" />


            <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">Items Ordered</h3>
            {/* Enhanced Items Ordered Section */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
                {/* Table-like header for larger screens */}
                <div className="hidden sm:flex bg-gray-50 p-3 text-sm font-semibold text-gray-600 border-b border-gray-200">
                    <span className="w-3/4 pr-2">Item Description</span>
                    <span className="w-1/4 text-right">Total Price</span>
                </div>
                <ul className="divide-y divide-gray-100"> {/* Use divide-y for internal lines */}
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                        orderDetails.items.map((item, index) => (
                            <li key={index} className="flex flex-wrap justify-between items-center px-3 py-3 hover:bg-gray-50 transition-colors duration-150">
                                <span className="text-gray-800 text-base font-medium flex-grow sm:flex-grow-0 sm:w-3/4 pr-2">
                                    {item.name} <span className="text-gray-500 text-sm">(Size: {item.size || 'N/A'})</span> x {item.quantity}
                                </span>
                                <span className="text-black font-bold text-lg flex-shrink-0 sm:w-1/4 text-right">
                                    TK.&nbsp;{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-3 text-center text-gray-500">No items found for this order.</li>
                    )}
                </ul>
            </div>

            {/* Horizontal Divider Line */}
            <hr className="border-t border-gray-200 my-4" />


            {/* Order Timeline Visualization - RESPONSIVE HORIZONTAL/VERTICAL */}
           
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
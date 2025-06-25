// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // For Authentication
import { getFirestore } from 'firebase/firestore'; // For Firestore Database

// Your Firebase configuration (copy from Firebase Console)
// For security, it's highly recommended to use environment variables for these.
// Example for Vite: import.meta.env.VITE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSyDHTn9ZXpcttOtavM2F1z-4x_vqOoCBovs",
  authDomain: "mun-seahawks.firebaseapp.com",
  projectId: "mun-seahawks",
  storageBucket: "mun-seahawks.appspot.com",
  messagingSenderId: "814046254672",
  appId: "1:814046254672:web:c29db9bb24c0eadbc3e355"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Export auth for authentication operations
export const db = getFirestore(app); // Export db for database operations

// You can export other services like getStorage(app), getFunctions(app), etc. as needed.
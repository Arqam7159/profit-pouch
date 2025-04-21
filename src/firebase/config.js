import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLAG_8L9wZ7IY9sFN_b1t0KEv_5luv7mY",             // From Firebase Console
  authDomain: "profitpouch-a8354.firebaseapp.com",        // From Firebase Console
  projectId: "profitpouch-a8354",                  // From Firebase Console
  storageBucket: "profitpouch-a8354.firebasestorage.app",        // From Firebase Console
  messagingSenderId: "597301544659",          // From Firebase Console
  appId: "1:597301544659:web:1d774b8828fb7282b87626",   
  measurementId: "G-ELSR0KBNST"                      // From Firebase Console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 
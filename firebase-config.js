  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    enableIndexedDbPersistence 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
// https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDVyQOMcXKriHNrywZX_Adcnb_mT2bz4m0",
    authDomain: "eplq-lbs-project.firebaseapp.com",
    projectId: "eplq-lbs-project",
    storageBucket: "eplq-lbs-project.firebasestorage.app",
    messagingSenderId: "990899497191",
    appId: "1:990899497191:web:8bdb20c7346e4317d31a42",
    measurementId: "G-1TBJ3QFB3N"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const analytics = getAnalytics(app);
  
  // Encryption key (in a real app, this should be securely managed)
  export const ENCRYPTION_KEY = "EPLQ-SECURE-ENCRYPTION-KEY-2025-v1";
  
  // Enable offline persistence
  try {
    enableIndexedDbPersistence(db);
  } catch (err) {
    console.error("Firestore persistence error:", err);
  }
  
  // Logger setup
  export const logEvent = async (userId, action, details) => {
    if (!userId) return; // Don't log if no user ID
    try {
      await addDoc(collection(db, "logs"), {
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Logging failed:", error);
    }
  };


// js/auth-admin.js
import { auth, db, ENCRYPTION_KEY, logEvent } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
  doc, 
  setDoc,
  collection,
  addDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { encryptData } from './js/encryption.js';

const registerBtn = document.getElementById("adminRegisterBtn");
const loginBtn = document.getElementById("adminLoginBtn");

// REGISTER
registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Store user data in Firestore
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "admins", uid), {
      email: email,
      createdAt: new Date().toISOString(),
      role: "admin"
    });
    await logEvent(uid, "admin_register", { email });
    alert("Admin registered successfully!");
    document.getElementById("authSection").style.display = "none";
    document.getElementById("dataSection").style.display = "block";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// LOGIN
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Check if user is admin
    const adminDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
    
    if (adminDoc.exists()) {
      alert("Admin login successful!");
      document.getElementById("authSection").style.display = "none";
      document.getElementById("dataSection").style.display = "block";
    } else {
      alert("Error: Not authorized as admin");
      await auth.signOut();
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Handle POI Upload
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const poiData = {
    name: document.getElementById("poiName").value,
    details: document.getElementById("poiDetails").value,
    latitude: parseFloat(document.getElementById("poiLatitude").value),
    longitude: parseFloat(document.getElementById("poiLongitude").value),
    timestamp: new Date().toISOString()
  };

  try {
    // Encrypt the POI data
    const encryptedData = encryptData(poiData, ENCRYPTION_KEY);
    
    // Store in Firestore
    const docRef = await addDoc(collection(db, "pois"), encryptedData);
    
    // Log the action
    await logEvent(auth.currentUser.uid, "poi_upload", {
      poiId: docRef.id,
      name: poiData.name // Only log non-sensitive data
    });

    document.getElementById("uploadStatus").textContent = "POI uploaded successfully!";
    document.getElementById("uploadForm").reset();
  } catch (err) {
    console.error("Upload error:", err);
    document.getElementById("uploadStatus").textContent = "Error uploading POI: " + err.message;
  }
});


import { auth, db, ENCRYPTION_KEY, logEvent } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
  doc, 
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { decryptData, calculateDistance } from './js/encryption.js';

const registerBtn = document.getElementById("userRegisterBtn");
const loginBtn = document.getElementById("userLoginBtn");
const searchForm = document.getElementById("searchForm");

// REGISTER
registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Store user data in Firestore
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      email: email,
      createdAt: new Date().toISOString(),
      role: "user"
    });
    await logEvent(uid, "user_register", { email });
    alert("User registered successfully!");
    document.getElementById("authSection").style.display = "none";
    document.getElementById("searchSection").style.display = "block";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// LOGIN
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await logEvent(userCredential.user.uid, "user_login", { email });
    alert("User login successful!");
    document.getElementById("authSection").style.display = "none";
    document.getElementById("searchSection").style.display = "block";
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Search POIs
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);
  const radius = parseFloat(document.getElementById("radius").value);

  try {
    const poisRef = collection(db, "pois");
    const querySnapshot = await getDocs(poisRef);
    const results = [];

    querySnapshot.forEach((doc) => {
      const encryptedData = doc.data();
      const decryptedData = decryptData(encryptedData, ENCRYPTION_KEY);
      
      const distance = calculateDistance(
        latitude,
        longitude,
        decryptedData.latitude,
        decryptedData.longitude
      );

      if (distance <= radius) {
        results.push({
          name: decryptedData.name,
          distance: distance.toFixed(2),
          details: decryptedData.details
        });
      }
    });

    // Display results
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = results.length > 0 
      ? results.map(poi => `
          <div class="poi-result">
            <h3>${poi.name}</h3>
            <p>Distance: ${poi.distance} km</p>
            <p>${poi.details}</p>
          </div>
        `).join('')
      : '<p>No POIs found within the specified radius.</p>';

    await logEvent(auth.currentUser.uid, "search_pois", { 
      latitude, 
      longitude, 
      radius,
      resultsCount: results.length 
    });
  } catch (err) {
    console.error("Search error:", err);
    alert("Error performing search: " + err.message);
  }
});


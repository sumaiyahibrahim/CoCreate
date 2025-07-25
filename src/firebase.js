import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // ✅ Correct

// (Optional) Only include Analytics if needed
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (keep as-is)
const firebaseConfig = {
  apiKey: "AIzaSyD5Zx8fROhB8OZFwJWBWXADi2voioSvqx4",
  authDomain: "cocreate-b49e1.firebaseapp.com",
  projectId: "cocreate-b49e1",
  storageBucket: "cocreate-b49e1.firebasestorage.app",
  messagingSenderId: "140645548335",
  appId: "1:140645548335:web:cae1c7e5f20c04120161da",
  measurementId: "G-VL4ZL1PTJM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);    // ✅ Correct
const auth = getAuth(app);      // ✅ Correct
// (Optional)
// const analytics = getAnalytics(app);

export { db, auth };            // ✅ Correct

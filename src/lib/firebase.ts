import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug environment variable

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjukFwbhBevU34dq5AjnB5fWRJAvCG7FI",
  authDomain: "chatbot-7c47b.firebaseapp.com",
  databaseURL: "https://chatbot-7c47b-default-rtdb.firebaseio.com",
  projectId: "chatbot-7c47b",
  storageBucket: "chatbot-7c47b.firebasestorage.app",
  messagingSenderId: "697718207287",
  appId: "1:697718207287:web:11ebc684ee873605b3e0b2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

console.log("✅ Firebase initialized successfully");

export default app;

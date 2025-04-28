// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjRoaloH6it4ZXrkgOewdJAyq4zTkl3R4",
  authDomain: "where-in-the-world-a80f9.firebaseapp.com",
  projectId: "where-in-the-world-a80f9",
  storageBucket: "where-in-the-world-a80f9.firebasestorage.app",
  messagingSenderId: "1081915218587",
  appId: "1:1081915218587:web:1c6cdabf4089ec8459443e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_URL,
  authDomain: "opengpt-5adaa.firebaseapp.com",
  projectId: "opengpt-5adaa",
  storageBucket: "opengpt-5adaa.firebasestorage.app",
  messagingSenderId: "371260546773",
  appId: "1:371260546773:web:995642fe77f08d9b944c5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
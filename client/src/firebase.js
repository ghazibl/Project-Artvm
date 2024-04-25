// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "artvm-92c29.firebaseapp.com",
  projectId: "artvm-92c29",
  storageBucket: "artvm-92c29.appspot.com",
  messagingSenderId: "70361793315",
  appId: "1:70361793315:web:724be4fa017b090a08c296",
  measurementId: "G-QK04QX5J8S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

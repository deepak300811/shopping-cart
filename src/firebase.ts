// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhENQWrW0t0bC58Bb2rnnL2qAwuCN8F4o",
  authDomain: "shoppingcart-9a7f8.firebaseapp.com",
  projectId: "shoppingcart-9a7f8",
  storageBucket: "shoppingcart-9a7f8.appspot.com",
  messagingSenderId: "471074850533",
  appId: "1:471074850533:web:8df49e3d7fd9397c68b60c",
  measurementId: "G-NN2659CERD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
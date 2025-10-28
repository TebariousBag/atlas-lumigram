// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZnBH7Vcsbe3kpPvKIrTpsERgAlgl7My0",
  authDomain: "lumigram-tristian.firebaseapp.com",
  projectId: "lumigram-tristian",
  storageBucket: "lumigram-tristian.firebasestorage.app",
  messagingSenderId: "1050001029351",
  appId: "1:1050001029351:web:ac30955aa63621bf9c0a42",
  measurementId: "G-6XMK0YHES6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// initialize auth
export const auth = initializeAuth(app);

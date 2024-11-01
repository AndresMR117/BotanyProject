// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBAFXSYa0vOPLuzQOGem8XQqZBIfFXYYM",
  authDomain: "botanyproject-b1ff7.firebaseapp.com",
  projectId: "botanyproject-b1ff7",
  storageBucket: "botanyproject-b1ff7.appspot.com",
  messagingSenderId: "490421576236",
  appId: "1:490421576236:web:51562524b0a91e80656789",
  measurementId: "G-XJHK62P1CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
export const db=getFirestore(appFirebase);
export const storage=getStorage(appFirebase);
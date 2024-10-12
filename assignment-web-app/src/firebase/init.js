import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'dotenv/config';

// Firebase Config
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "azho0003-5032.firebaseapp.com",
    projectId: "azho0003-5032",
    storageBucket: "azho0003-5032.appspot.com",
    messagingSenderId: "101945142707",
    appId: "1:101945142707:web:a04187b001489b4d6fafc6"
  };
  
  // Initialise Firebase
initializeApp(firebaseConfig);
const db = getFirestore()
export default db
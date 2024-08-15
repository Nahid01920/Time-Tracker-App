/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// ,query, getDocs, collection, where, addDoc
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBYkMUQ6TsyVOhMEBNr23-9IWAqn5HzDuI",
  authDomain: "time-tracker-web-applica-c22d2.firebaseapp.com",
  projectId: "time-tracker-web-applica-c22d2",
  storageBucket: "time-tracker-web-applica-c22d2.appspot.com",
  messagingSenderId: "957638745359",
  appId: "1:957638745359:web:462e19c1d5a48d3a59b27a",
  measurementId: "G-22WB9NSV9L"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYkMUQ6TsyVOhMEBNr23-9IWAqn5HzDuI",
  authDomain: "time-tracker-web-applica-c22d2.firebaseapp.com",
  databaseURL: "https://time-tracker-web-applica-c22d2-default-rtdb.firebaseio.com",
  projectId: "time-tracker-web-applica-c22d2",
  storageBucket: "time-tracker-web-applica-c22d2.appspot.com",
  messagingSenderId: "957638745359",
  appId: "1:957638745359:web:462e19c1d5a48d3a59b27a",
  measurementId: "G-22WB9NSV9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


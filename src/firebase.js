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
// Firestore limit on the number of documents
// export const getAll = (userId) => {
//   const ref = db.collection("users")
//                 .doc(userId)
//                 .collection("notes");

//   getPagedResults(ref, null);
// };

// const getPagedResults = (ref, lastVisible) => {
//   let query = ref.limit(1000);

//   if (lastVisible) {
//     query = query.startAfter(lastVisible);
//   }

//   query.get().then((results) => {
//     console.log("results size:", results.size);

//     if (results.size === 1000) {
//       // There might be more documents, so get the next page
//       const lastDoc = results.docs[results.size - 1];
//       getPagedResults(ref, lastDoc);
//     } else {
//       console.log("All documents retrieved");
//     }
//   }).catch((error) => {
//     console.error("Error getting documents:", error);
//   });
// };

// Initialize Firebase Authentication and get a reference to the service

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

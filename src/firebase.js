// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw1z3GpgIB-ABB10NQ4v93HGts-L2b7uA",
  authDomain: "crud-bookstore-a030d.firebaseapp.com",
  projectId: "crud-bookstore-a030d",
  storageBucket: "crud-bookstore-a030d.appspot.com",
  messagingSenderId: "172109020518",
  appId: "1:172109020518:web:ba7b532454d4f78bc45ca7",
  measurementId: "G-3ZTBZL4X9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize firebase analytics
const analytics = getAnalytics(app);

//connect to firestore
export const db = getFirestore(app)

//connect to realtime database
export const RealtimeDatabase = getDatabase(app)
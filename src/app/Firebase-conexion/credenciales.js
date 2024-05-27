

//////////////////////////////////////////////////////////////////////
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxdNd0AGWPNVsbYFfB-_GL3EzraZMY57s",
  authDomain: "project-xander-a93c4.firebaseapp.com",
  projectId: "project-xander-a93c4",
  storageBucket: "project-xander-a93c4.appspot.com",
  messagingSenderId: "1085309927395",
  appId: "1:1085309927395:web:f44afb6a219a10323c2ad6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
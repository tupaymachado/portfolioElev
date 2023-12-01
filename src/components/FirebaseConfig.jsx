import { getFirestore, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, get } from 'firebase/database';

const firestoreConfig = {
  apiKey: "AIzaSyCkGKoV1nzylCOQu7l48cxjehhQveZsDqw",
  authDomain: "portfolioportfolio-95534.firebaseapp.com",
  projectId: "portfolioportfolio-95534",
  storageBucket: "portfolioportfolio-95534.appspot.com",
  messagingSenderId: "1025417886211",
  appId: "1:1025417886211:web:04c550866131025c1e6c36",
  measurementId: "G-PR1E4LY8WT"
};

const app = initializeApp(firestoreConfig);
const db = getFirestore(app);
const realtime = getDatabase(app);
const auth = getAuth(app);

export { app, db, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, 
  getDocs, query, where, deleteDoc, signInWithEmailAndPassword, getAuth, auth, onAuthStateChanged, signOut, sendPasswordResetEmail, realtime, ref, set, get
};
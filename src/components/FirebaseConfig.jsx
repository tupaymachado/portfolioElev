import { getFirestore, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRjWsAAB5gaQgf5MgHvGj5yZ7hg_bSJ7c",
  authDomain: "portfolioelevato.firebaseapp.com",
  projectId: "portfolioelevato",
  storageBucket: "portfolioelevato.appspot.com",
  messagingSenderId: "716144958454",
  appId: "1:716144958454:web:57bf0401b1cd41625005d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, getDocs, query, where, deleteDoc, signInWithEmailAndPassword, getAuth, auth, onAuthStateChanged, signOut };
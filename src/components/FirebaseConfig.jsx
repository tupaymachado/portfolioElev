import { getFirestore, connectFirestoreEmulator, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, getDocs, query, where, deleteDoc, deleteField } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, signInWithEmailAndPassword, getAuth, onAuthStateChanged, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get, onValue } from 'firebase/database';

const firestoreConfig = {
  apiKey: "AIzaSyBRjWsAAB5gaQgf5MgHvGj5yZ7hg_bSJ7c",
  authDomain: "portfolioelevato.firebaseapp.com",
  databaseURL: "https://portfolioelevato-default-rtdb.firebaseio.com",
  projectId: "portfolioelevato",
  storageBucket: "portfolioelevato.appspot.com",
  messagingSenderId: "716144958454",
  appId: "1:716144958454:web:57bf0401b1cd41625005d7"
};

const app = initializeApp(firestoreConfig);
const db = getFirestore(app);

const realtime = getDatabase(app);
const auth = getAuth(app);
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { connectAuthEmulator, connectFirestoreEmulator, app, db, collection, addDoc, writeBatch, doc, runTransaction, getDoc, updateDoc, setDoc, deleteField,
  getDocs, query, where, deleteDoc, signInWithEmailAndPassword, getAuth, auth, onAuthStateChanged, signOut, sendPasswordResetEmail, realtime, ref, set, get,
  createUserWithEmailAndPassword, onValue
};
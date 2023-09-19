
import { getFirestore, collection, addDoc, writeBatch, doc, runTransaction, getDocs, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

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
const collectionRef = collection(db, "portfolio");

const buttonReads = document.getElementsByClassName('reads')[0];
//selecionar o button dentro do form 'pesquisaForm'
const buttonPesquisa = document.querySelector('#pesquisaForm button');

buttonPesquisa.addEventListener('click', ((e) => {
    e.preventDefault();
    const pesquisaValue = document.getElementById('pesquisa').value;
    readDoc(pesquisaValue);
})
);

async function readDoc(item) {
    const itemRef = doc(collectionRef, item)
    const docSnap = await getDoc(itemRef)
    if (docSnap.data() !== undefined) {
        console.log('Infos do Documento:', docSnap.data())
    } else {
        console.log('Documento não existe')
    }
}

buttonReads.addEventListener('click', docReads);
const portfolio = [];

async function docReads() {
    const queryPortfolio = await getDocs(collectionRef);
    queryPortfolio.forEach((item => {
        portfolio.push(item);
    }))
    console.log(portfolio.length)
    console.log(portfolio)
}
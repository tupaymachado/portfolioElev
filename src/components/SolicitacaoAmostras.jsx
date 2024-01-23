import styles from './SolicitacaoAmostras.module.css';
import { db } from './FirebaseConfig.jsx';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';

export function SolicitacaoAmostras() {

    const csvAmostras = async (event) => {
        const file = event.target.files[0];
        let csvData = [];
        const reader = new FileReader();
        reader.onload = async function (e) {
            const contents = e.target.result;
            const lines = contents.split('\n');
            const data = lines.map(line => line.split(','));
            data.splice(0, 2);
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] === '') {
                    break;
                }
                let obj = {
                    codigo: data[i][1],
                    linha: i + 2,
                };
                csvData.push(obj);
            }
            checkPortfolio(csvData);
        };
        reader.readAsText(file);
    };

    async function checkPortfolio(csvData) {
        let faltas = [];
        for (let item of csvData) {
            const docRef = doc(db, 'portfolio', item.codigo);
            await getDoc(docRef).then((docSnap) => {
                if (!docSnap.exists()) {
                    faltas.push(item);
                }
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    if (docData.localizacao?.Laranjal === undefined) {
                        faltas.push(item);
                    }
                }
            });
        }
        console.log(faltas);
        printTxt(faltas);
    };

    const printTxt = (data) => {
        let txt = '';
        for (let i = 0; i < data.length; i++) {
            txt += 'Código: ' + data[i].codigo + ' - Linha: ' + data[i].linha + '\n';
        }
        const element = document.createElement("a");
        const file = new Blob([txt], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "amostras.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <div className={styles.container}>
            <h1>Solicitação de Amostras</h1>
            <input type="file" onChange={csvAmostras} />
        </div>
    )
}
import styles from './SolicitacaoAmostras.module.css';
import { collection, query, where, getDocs, db } from './firebaseConfig.jsx';
import { useState } from 'react';

export function SolicitacaoAmostras({ setPrecos }) {

    const csvAmostras = async (event) => {
        const file = event.target.files[0];
        let csvData = [];
        const reader = new FileReader();
        reader.onload = async function (e) {
            const contents = e.target.result;
            const lines = contents.split('\n');
            const data = lines.map(line => line.split(','));
            data.shift();
            for (let i = 0; i < data.length; i++) {
                if (data[i][0] === '') {
                    break;
                }
                const stringWithCarriageReturn = data[i][0];
                const stringWithoutCarriageReturn = stringWithCarriageReturn.replace(/\r$/, '');
                let obj = {
                    codigo: stringWithoutCarriageReturn,
                };
                csvData.push(obj);
            }
            console.log(csvData);
            searchPortfolioSetPrecos(csvData);
        };
        reader.readAsText(file);
    };

    async function searchPortfolioSetPrecos(csvData) {
        let temosAmostras = [];
        for (let i = 0; i < csvData.length; i++) {
            console.log(csvData.length - i);
            const q = query(collection(db, 'portfolio'), where('codigo', '==', csvData[i].codigo));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                temosAmostras.push(docData);
            });
        }
        console.log(temosAmostras);
        setPrecos(temosAmostras);
    };

    /* async function checkPortfolio(csvData) {
        let temosAmostras = [];
        for (let i = 0; i < csvData.length; i++) {
            console.log(csvData.length - i);
            const docRef = doc(db, 'portfolio', csvData[i].codigo);
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    if (docData.localizacao?.Laranjal) {
                        const item = {
                            codigo: csvData[i].codigo,
                            descricao: csvData[i].descricao,
                            local: `${docData.localizacao.Laranjal.expositor} - ${docData.localizacao.Laranjal.posicao}`
                        };
                        temosAmostras.push(item);
                    }
                }
            });
        }
        console.log(temosAmostras);
        printTxt(temosAmostras);
    }; */

    const printTxt = (data) => {
        let txt = '';
        for (let i = 0; i < data.length; i++) {
            txt += 'Código: ' + data[i].codigo + '- ' + data[i].descricao + '/ ' + data[i].local + '\n';
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
import { useState } from 'react';
import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';

export function CsvHandling() {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    let csvData = [];
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const lines = contents.split('\n');
      const data = lines.map(line => line.split(','));
      data.shift();
      for (let line of data) {
        let obj = {
          codigo: line[0],
          expositor: line[1],
          posicao: line[2],
          unidade: line[3],
          referencia: line[4],
          quantidade: line[5],
        };
        csvData.push(obj);
      }
      updateFirebase(csvData);
    };
    reader.readAsText(file);
  };

  //fazer update no Firebase
  async function updateFirebase(csvData) {
    console.log()
    const portfolioRef = collection(db, 'portfolio');
    let counter = 0;
    for (let item of csvData) {
      if (item.codigo === '') {
        continue;
      }
      const docRef = doc(portfolioRef, item.codigo);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        delete item.codigo;
        await updateDoc(docRef, item);
      } else {
        await setDoc(docRef, item);
      }
    }
    console.log(`Foram atualizados ${counter} itens.`)
    console.log('Dados atualizados com sucesso!')
  }


    return (
      <>
        <h1>Insira um arquivo CSV padronizado</h1>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </>
    )
  }
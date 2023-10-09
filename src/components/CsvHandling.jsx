import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';
import styles from './CsvHandling.module.css';
import { ProgressBar } from './ProgressBar.jsx';
import { useState } from 'react';

export function CsvHandling() {

  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    let csvData = [];
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const lines = contents.split('\n');
      const data = lines.map(line => line.split(','));
      let filial = data[0][0];
      data.splice(0, 2);
      for (let line of data) {
        if (line.length === 0) {
          break;
        }
        let obj = {
          codigo: line[0] ? line[0] : line[4],
          localizacao: {
            [filial]: {
              posicao: `${line[2]}`,
              expositor: `${line[1]}`
            }
          },
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
    const portfolioRef = collection(db, 'portfolio');
    let counter = 0;
    for (let item of csvData) {
      counter++
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
      setProgress(((counter / csvData.length) * 100).toFixed(2));
    }
    console.log('Dados atualizados com sucesso!')
  }

  return (
    <div className={styles.CsvHandling}>
      <h4>Insira um arquivo CSV padronizado</h4>
      <input type="file" accept=".csv" onChange={handleFileUpload} />      
      <ProgressBar progress={progress} />
    </div>
  )
}
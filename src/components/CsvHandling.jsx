import { db, collection, doc, getDoc, setDoc, updateDoc, addDoc } from './firebaseConfig.jsx';
import styles from './CsvHandling.module.css';
import { ProgressBar } from './ProgressBar.jsx';
import { useState } from 'react';

export function CsvHandling() {

  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    let csvData = [];
    let semCodigo = [];
    const reader = new FileReader();
    reader.onload = async function (e) {
      const contents = e.target.result;
      const lines = contents.split('\n');
      const data = lines.map(line => line.split(','));
      let filial = data[0][0];
      data.splice(0, 2);
      for (let line of data) {
        if (line.length === 1) {
          break;
        }
        let obj = {
          codigo: line[0],
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
        if (line[0] === '0') {
          semCodigo.push(obj);
        } else {
          csvData.push(obj);
        }
      }
      verificarRepetidos(csvData);
    };
    reader.readAsText(file);
  };

  async function verificarRepetidos(dados) {
    let repetidos = [];
    let counter = 0;
    for (let item of dados) {
      counter++;
      let codigo = item.codigo;
      let index = dados.findIndex(item => item.codigo === codigo);
      if (index !== counter - 1) {
        repetidos.push(item);
        dados.splice(index, 1);
      }
    }
    console.log('Repetidos: ', repetidos);
    console.log('Dados: ', dados);
    await updateFirebase(dados, 'portfolio');
    /* updateFirebase(semCodigo, 'sem-codigo'); */
  }

  //fazer update no Firebase
  async function updateFirebase(dados, ref) {
    const portfolioRef = collection(db, ref);
    let counter = 0;
    for (let item of dados) {
      counter++
      if (item.codigo === '0') {
        await addDoc(portfolioRef, item);
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
      setProgress(((counter / dados.length) * 100).toFixed(2));
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

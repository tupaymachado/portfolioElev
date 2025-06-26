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
        console.log('Line: ', line);
        if (line.length === 1) {
          break;
        }
        let obj = {
          codigo: line[0],
          localizacao: {
            [filial]: {
              posicao: `${line[2]}`,
              expositor: `${line[1]}`,
              quantidade: line[5],
            }
          },
          unidade: line[3],
          referencia: line[4],
        };
        if (line.length > 6) {
          if (line[6]) {
            obj.precoAtual = Number(line[6]);
          }
          if (line[7].length > 4) {
            obj.descricao = line[7];
          }
        }
        if (line[0] === '0') {
          semCodigo.push(obj);
        } else {
          csvData.push(obj);
        }
      }
      console.log('Dados: ', csvData);
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
      let index = Number(dados.findIndex(item => item.codigo === codigo));
      if (index !== counter - 1) {
        item = {...item, index: index};
        repetidos.push(item);
        dados.splice(index, 1);
      }
    }
    console.log('dados: ', dados);
    if (repetidos.length > 0) {
      alert(`O(s) iten(s) com código(s) ${repetidos.map(item => item.codigo).join(', ')}, na(s) linha(s) ${repetidos.map(item => Number(item.index)+3).join(', ')} estão repetidos, exclua um e adicione +1 à quantidade.`);
    } else {
      await updateFirebase(dados, 'portfolio');
    }
    //updateFirebase(semCodigo, 'sem-codigo');
  }

  //fazer update no Firebase
  async function updateFirebase(dados, ref) {
    const portfolioRef = collection(db, ref);
    let counter = 0;
    console.log('Dados: ', dados);
    for (let item of dados) {
      counter++
      if (item.codigo === '0') {
        await addDoc(portfolioRef, item);
        continue;
      }
      const docRef = doc(portfolioRef, item.codigo);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const docSnapshotData = docSnapshot.data();
        item = {...item,
          localizacao: { ...item.localizacao, ...docSnapshotData.localizacao }
        }
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
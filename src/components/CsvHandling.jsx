import { db, collection, doc, getDoc, setDoc, updateDoc, addDoc } from './FirebaseConfig.jsx';
import styles from './CsvHandling.module.css';
import { ProgressBar } from './ProgressBar.jsx';
import { useState } from 'react';

export function CsvHandling() {

  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    let csvData = [];
    const reader = new FileReader();
    reader.onload = async function (e) {
      const contents = e.target.result;
      const lines =  contents.split('\n');
      const data = lines.map(line => line.split(','));
      let filial = data[0][0]; //verificar se filial é === à filial do usuário, gerar aviso
      data.splice(0, 2); 
      for (let i = 0; i < data.length; i++) {
        let line = data[i];
        if (line.length === 1) {
          break;
        }
        let obj = {
          codigo: line[0] ? line[0] : '0',
          localizacao: {
            [filial]: {
              posicao: `${line[2]}`,
              expositor: `${line[1]}`,
              quantidade: `${line[5]}`
            }
          },
          unidade: line[3],
          referencia: line[4],
          pf: Number(line[6]) ? Number(line[6]) : 0,
        };
        if (obj.codigo === '0' && !obj.referencia) {
          console.log(`Item sem código e sem referência no arquivo, na linha: ${i+3}`);
          continue;
        }
        csvData.push(obj);
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
      if (index !== counter - 1 && item.codigo !== '0') {
        repetidos.push(item);
        dados.splice(index, 1);
      }
    }
    await organizarPosicoes(dados);
  }

  async function organizarPosicoes(dados) {
  //fazer query do expositor nas duas coleções e salvar em um array showroom, em ordem crescente determinada pela posição
  //excluir do array showroom posições menores do que a menor de 'dados', essas posições não serão modificadas
  //rodar um loop decrescente de dados, em que cada item vai atualizar sua posição da seguinte forma:
  //descobrir quantos itens com posição menor que i existem no array dados (variavelNovaPosicao), e somar esse número ao item i
  //
  }

  async function updateFirebase(dados) {
    let counter = 0;
    for (let item of dados) {
      counter++;
      const ref = item.codigo === '0' ? 'semcadastro' : 'portfolio';
      const portfolioRef = collection(db, ref);
      const docRef = item.codigo === '0' ? doc(portfolioRef, item.referencia) : doc(portfolioRef, item.codigo);
     await setDoc(docRef, item, { merge: true });
      setProgress(((counter / dados.length) * 100).toFixed(2));
    }
    console.log('Dados atualizados com sucesso!');
  }

  return (
    <div className={styles.CsvHandling}>
      <h4>Insira um arquivo CSV padronizado</h4>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <ProgressBar progress={progress} />
    </div>
  )
}

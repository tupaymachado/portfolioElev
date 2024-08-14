import { db, collection, doc, getDoc, setDoc, updateDoc, addDoc } from './FirebaseConfig.jsx';
import styles from './CsvHandling.module.css';
import { ProgressBar } from './ProgressBar.jsx';
import { useState } from 'react';

/* 
REFATORAR TODO O COMPONENTE
Excluir a gravação através de CSV, e criar um formulário de cadastro de itens
Cada item vai ser cadastrado individualmente

propriedades:
codigo, unidade, referencia, pf, localização {filial: {posição, expositor, quantidade}}
*/

export function CsvHandling() {
  const [progress, setProgress] = useState(0);

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
    await updateFirebase(dados);
  }

  async function organizarPosicoes(dados) { //A FUNÇÃO DEVE DIFERENCIAR ENTRE EXPOSITORES COM ORDEM (APENAS NUMEROS) E SEM ORDEM (GAVETA DECA, VASOS DOCOL, ETC ) 
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
      <form className={styles.form}>
        <input type='text' placeholder='Código' />
        <input type='text' placeholder='Unidade' />
        <input type='text' placeholder='Referência' />
        <ProgressBar progress={progress} />
      </form>
    </div>
  )
}

import { useState } from 'react';
import { collection, query, where, getDocs, db } from './firebaseConfig.jsx';
import styles from './SearchBar.module.css';

export function SearchBar({ setPrecos, setPromos }) {
  let [searchTerm, setSearchTerm] = useState('');
  let [filter, setFilter] = useState('codigo');
  let [operator, setOperator] = useState('==');

  async function handleSearch(event) {
    event.preventDefault();
    const collectionRef = collection(db, 'portfolio');
    if (filter === 'precoAtual') {
      searchTerm = Number(searchTerm.replace(',', '.'));
    }
    console.log(searchTerm, filter)
    const queryTerm = await query(collectionRef, where(filter, operator, searchTerm));
    const docs = await getDocs(queryTerm);
    docs.forEach((doc) => {
      let data = doc.data();
      data.dataPrecoAtual = data.dataPrecoAtual ? data.dataPrecoAtual.toDate() : null;
      data.dataPromocao = data.dataPromocao ? data.dataPromocao.toDate() : null;
      if (data.localizacao) {
        if (data.precoAtual) {
          setPrecos(prevPrecos => [...prevPrecos, data]);
        }
        if (data.promocao === true) {
          setPromos(prevPromos => [...prevPromos, data]);
        }
      } else {
        alert('O item não consta em mostruário e/ou não tem informações de preço e promoção.')
      }
    })
  }

  function renderInput() {
    switch (filter) {
      case 'promocao':
        return (
          <div>
            <select onChange={(event) => setSearchTerm(event.target.value)} className={styles.selectFilter}>
              <option value='true'>Sim</option>
              <option value='false'>Não</option>
            </select>
            &nbsp;
            <input />
          </div>
        );
      case 'precoAtual':
        return (
          <div>
            <select>
              <option value='=='>Igual à</option>
              <option value='>'>Maior que</option>
              <option value='<'>Menor que</option>
            </select>
            &nbsp;
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              placeholder="Pesquisar"
            />
          </div>
        );
      default:
        return (
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            type="text"
            placeholder="Pesquisar"
          />
        );
    }
  }

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <label htmlFor="search">Campo de busca:</label>
      &nbsp;
      <select onChange={(event) => setFilter(event.target.value)} className={styles.selectFilter}>
        <option value='codigo'>Código</option>
        <option value='promocao'>Em promoção</option>
        <option value='precoAtual'>Preço Atual</option>
        <option value='localizacao.Laranjal.expositor'>Expositor</option>
      </select>
      &nbsp;
      {renderInput()}
      &nbsp;
      <button type="submit">Pesquisar</button>
    </form>
  );
}
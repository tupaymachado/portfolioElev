import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs, db } from './firebaseConfig.jsx';
import styles from './SearchBar.module.css';

export function SearchBar({ setPrecos, setPromos }) {
  let [searchTerm, setSearchTerm] = useState('');
  let [filter, setFilter] = useState('codigo');
  let [operator, setOperator] = useState('==');
  const inputRef = useRef(null);

  async function handleSearch(event) {
    event.preventDefault();
    searchTerm = searchTerm.toUpperCase();
    const collectionRef = collection(db, 'portfolio');
    if (filter === 'precoAtual') {
      searchTerm = Number(searchTerm.replace(',', '.'));
    }
    console.log(searchTerm, filter, operator);
    const queryTerm = await query(collectionRef, where(filter, operator, searchTerm));
    const docs = await getDocs(queryTerm);
    if (docs.empty) {
      alert('A busca não retornou resultados');
      return;
    }
    docs.forEach((doc) => {
      let data = doc.data();
      data.dataPrecoAtual = data.dataPrecoAtual ? data.dataPrecoAtual.toDate() : null;
      data.dataPromocao = data.dataPromocao ? data.dataPromocao.toDate() : null;
      if (data.localizacao) { //configurar pra pegar a filial específica do usuário, e não todas
        setPrecos(prevPrecos => [...prevPrecos, data]);
        if (data.promocao === true) {
          setPromos(prevPromos => [...prevPromos, data]);
        }
        //LIMPAR O ELEMENTO HTML (input) DE BUSCA

      }
    })
    reset();
  }

  function renderInput() {
    switch (filter) {
      case 'codigo':
        return (
          <div>
            <input
              ref={inputRef}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="text"
              placeholder="Pesquisar"
            />
          </div>
        );
      default:
        return (
          <input
            ref={inputRef}
            onChange={(event) => setSearchTerm(event.target.value)}
            type="text"
            placeholder="Pesquisar"
          />
        );
    }
  }

  function reset() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSearchTerm('');
  }

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <label htmlFor="search">Campo de busca:</label>
      &nbsp;
      <select onChange={(event) => setFilter(event.target.value)} className={styles.selectFilter}>
        <option value='codigo'>Código</option>
        <option value='marca'>Marca</option>
        <option value='localizacao.Laranjal.expositor'>Expositor</option>
      </select>
      &nbsp;
      {renderInput()}
      &nbsp;
      <button type="submit">Pesquisar</button>
    </form>
  );
}
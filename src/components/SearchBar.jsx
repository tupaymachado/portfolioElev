import { useState } from 'react';
import { collection, query, where, getDocs, db } from './firebaseConfig.jsx';
import styles from './SearchBar.module.css';
import { set } from 'react-hook-form';

export function SearchBar({ setPrecos, setPromos }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('codigo');

  async function handleSearch(event) {
    event.preventDefault();
    console.log(`SearchTerm: ${searchTerm}`);
    console.log(`filter: ${filter}`);
    const collectionRef = collection(db, 'portfolio');
    const queryTerm = await query(collectionRef, where(filter, '==', searchTerm));
    const docs = await getDocs(queryTerm);
    docs.forEach((doc) => {
      let data = doc.data();
      console.log(data.codigo)
      data.dataPrecoAtual = data.dataPrecoAtual ? data.dataPrecoAtual.toDate() : null;
      data.dataPromocao = data.dataPromocao ? data.dataPromocao.toDate(): null;
      if (data.precoAtual) {
      setPrecos(prevPrecos => [...prevPrecos, data]);
      }
      if (data.promocao === true) {
      setPromos(prevPromos => [...prevPromos, data]);
      }
    })
  }

  return (
    <form onSubmit={handleSearch}>
      <input
        onChange={function handleSearch(event) {
          setSearchTerm(event.target.value)
        }
        }
        type="text"
        placeholder="Pesquisar"
      />

      <select onChange={() => setFilter(event.target.value)}>
        <option value='codigo'>Código</option>
        <option value='acabamento'>Acabamento</option>
        <option value='promocao'>Em promoção</option>
        <option value='precoAtual'>Preço Atual</option>
        <option value='localizacao.Laranjal.expositor'>Expositor</option>
      </select>
      <button type="submit">Pesquisar</button>
    </form>
  );
}
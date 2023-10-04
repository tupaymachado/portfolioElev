import { useState } from 'react';
import { collection, query, where, getDocs, db } from './firebaseConfig.jsx';
import styles from './SearchBar.module.css';

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');

  async function handleSearch(event) { //não preciso passar o event como parâmetro quando chamar a função
    event.preventDefault();
    console.log(`SearchTerm: ${searchTerm}`);
    console.log(`filter: ${filter}`);
    const collectionRef = collection(db, 'portfolio');
    const queryTerm = await query(collectionRef, where(filter, '==', true));
    const docs = await getDocs(queryTerm);
    docs.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
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
        <option value='categoria'>Categoria</option>
        <option value='promocao'>promocao</option>
      </select>
      <button type="submit">Pesquisar</button>
    </form>
  );
}
import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; // assumindo que você já configurou o firebase

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore();

  const handleSearch = async (e) => {
    e.preventDefault();

    const portfolioQuery = query(collection(db, 'portfolio'), where('codigo', '==', searchTerm));
    const querySnapshot = await getDocs(portfolioQuery);

    if (querySnapshot.empty) {
      console.log('Nenhum documento correspondente.');
      return;
    }  

    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Digite o código do item"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Pesquisar</button>
    </form>
  );
};
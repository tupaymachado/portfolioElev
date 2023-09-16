import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; // assumindo que você já configurou o firebase

const handleSearch = async (searchTerm) => {
  const portfolioQuery = query(collection(db, 'portfolio'), where('codigo', '==', searchTerm));
  const querySnapshot = await getDocs(portfolioQuery);
  if (querySnapshot.empty) {
    console.log('Nenhum documento correspondente.');
    return;
  }
  querySnapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });

}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const db = getFirestore();
  const onSubmit = async (e) => {
    e.preventDefault();
    // Chame a nova função handleSearch
    await handleSearch(searchTerm);
  }

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
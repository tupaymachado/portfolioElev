import React from 'react';
import { useForm } from 'react-hook-form';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();

async function searchDocs(searchTerm) {
  const portfolioRef = collection(db, 'portfolio');
  const q = query(portfolioRef, where('codigo', '==', searchTerm));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    console.log('Nenhum documento correspondente.');
    return [];
  }
  
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.data());
  });
  
  return results;
}

export function SearchBar() {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const results = await searchDocs(data.searchTerm);
      console.log(results);
    } catch (error) {
      console.error(error);
      // mostra mensagem de erro para o usuário
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('searchTerm')} 
        type="text"
        placeholder="Pesquisar"  
      />
      <button type="submit">Pesquisar</button>
    </form>
  );
}

export default SearchBar;
import { useState } from 'react';
import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';

export function CsvHandling() {

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(e) {
          const contents = e.target.result;
          const lines = contents.split('\n');
          const data = lines.map(line => line.split(','));
          setCsvData(data);
          console.log(data);
        };
    
        reader.readAsText(file);
      };


    return (
        <>
            <h1>Insira um arquivo CSV padronizado</h1>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
        </>
    )
}
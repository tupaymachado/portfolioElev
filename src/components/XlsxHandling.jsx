import { useState } from 'react';
import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';
import { readFileAndConvertToJson, processarDados } from './helpers/readAndProcessReport.jsx'; 

import * as XLSX from 'xlsx';

export function XlsxHandling({ onEtiquetasPreco, onEtiquetasPromo, onEtiquetasForaPromo }) {

    const handleFileChange = async (event) => {
        try {
            const rows = await readFileAndConvertToJson(event);
            processarDados(rows, onEtiquetasPreco, onEtiquetasPromo, onEtiquetasForaPromo);
        } catch (error) {
            console.error('Erro ao ler o arquivo:', error);
        }
    };
    

    return (
        <>  <h1>Inserir Relatório '10449 - Preços Alterados nas Últimas 24 horas II' em formato .xls</h1>
            <input type="file" id="fileInput" onChange={handleFileChange} />
        </>
    );
}
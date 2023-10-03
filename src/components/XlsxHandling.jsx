import React, { useState } from 'react';
import { readFileAndConvertToJson, processarDados } from './helpers/readAndProcessReport.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { set } from 'react-hook-form';

export function XlsxHandling({ setPrecos, setPromos, setForaPromos }) {
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (event) => {
        try {
            const rows = await readFileAndConvertToJson(event);
            processarDados(rows, setPrecos, setPromos, setForaPromos, setProgress);
        } catch (error) {
            console.error('Erro ao ler o arquivo:', error);
        }
    };

    return (
        <>
            <h1>Inserir Relatório '10449 - Preços Alterados nas Últimas 24 horas II' em formato .xls</h1>
            <input type="file" id="fileInput" onChange={handleFileChange} />
            <ProgressBar progress={progress} />
        </>
    );
}
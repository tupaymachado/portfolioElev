import React, { useState } from 'react';
import { readFileAndConvertToJson, processarDados } from './helpers/readAndProcessReport.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import styles from './XlsxHandling.module.css';

export function XlsxHandling({ setPrecos, setPromos, setForaPromos, setMostrarPrecos, setMostrarPromos, setMostrarForaPromos }) {
    const [progress, setProgress] = useState(0);

    const [inicioPrecos, setInicioPrecos] = useState(false);
    const [inicioPromos, setInicioPromos] = useState(false);
    const [inicioForaPromos, setInicioForaPromos] = useState(false);

    function handlePrecos() {
        setInicioPrecos(!inicioPrecos);
        setMostrarPrecos(!inicioPrecos);
        setMostrarPromos(false);
        setMostrarForaPromos(false);
        setInicioPromos(false);
        setInicioForaPromos(false);
    };

    function handlePromos() {
        setInicioPromos(!inicioPromos);
        setMostrarPromos(!inicioPromos);
        setMostrarPrecos(false);
        setMostrarForaPromos(false);
        setInicioPrecos(false);
        setInicioForaPromos(false);
    };

    function handleForaPromos() {
        setInicioForaPromos(!inicioForaPromos);
        setMostrarForaPromos(!inicioForaPromos);
        setMostrarPrecos(false);
        setMostrarPromos(false);
        setInicioPrecos(false);
        setInicioPromos(false);
    };

    const handleFileChange = async (event) => {
        try {
            const rows = await readFileAndConvertToJson(event);
            processarDados(rows, setPrecos, setPromos, setForaPromos, setProgress);
        } catch (error) {
            console.error('Erro ao ler o arquivo:', error);
        }
    };

    return (
        <div className={styles.xlsxHandling}>
            <h4>Insira o Relatório '10449 - Preços Alterados nas Últimas 24 horas II' em formato .xls</h4>
            <input type="file" id="fileInput" onChange={handleFileChange} />
            <ProgressBar progress={progress} />
            <button onClick={handlePrecos}>Mudanças de Preço</button>
            <button onClick={handlePromos}>Entrada em Promoção</button>
            <button onClick={handleForaPromos}>Saída de promoção</button>
        </div>
    );
}
import { useState } from 'react';
import styles from './EtiquetasPreco.module.css';

export function EtiquetasPreco({ etiquetas = [] }) {
    const handlePrint = () => {
        window.print();
    }

    return (
        <>
            <button onClick={handlePrint}>Imprimir Etiquetas de Preço</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>

                {etiquetas.map((etiqueta, index) => {
                    return (
                        <>
                            <div className={styles.etiqueta} key={etiqueta.codigo}>
                                <div className={styles.etiquetaUnidade}>Metro Quadrado</div>
                                <div className={styles.etiquetaPosicao}>eti</div>
                                <div className={styles.etiquetaPreco}>R$ {String(etiqueta.precoAtual).replace('.', ',')}</div>
                                <div className={styles.etiquetaCodigo}>{etiqueta.codigo}</div>
                                <div className={styles.etiquetaDescricao}>{etiqueta.descricao}</div>
                                <div className={styles.etiquetaData}>{new Date(etiqueta.dataPrecoAtual).toLocaleDateString('pt-BR')}</div>
                            </div>
                            {(index + 1) % 16 === 0 && <div className={styles.pageBreak}></div>}
                        </>
                    )
                })}
            </div >
        </>
    )
}

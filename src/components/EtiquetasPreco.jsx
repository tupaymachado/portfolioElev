import { useState } from 'react';
import styles from './EtiquetasPreco.module.css';

export function EtiquetasPreco({ etiquetas = [] }) {
    const handlePrint = () => {
        window.print();
    }

    return (
        <>
            <h1>ETIQUETAS PREÇO:</h1>
            <button onClick={handlePrint}>Imprimir Etiquetas de Preço</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>
                {etiquetas.map((etiqueta, index) => {
                    return (
                        <table key={etiqueta.codigo}>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descrição</th>
                                    <th>Posição</th>
                                    <th>Preço</th>
                                    <th>Unidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={styles.etiqueta}>
                                    <td className={styles.etiquetaCodigo}>{etiqueta.codigo}</td>
                                    <td className={styles.etiquetaDescricao}>{etiqueta.descricao}</td>
                                    <td className={styles.etiquetaPosicao}>{etiqueta.localizacao.Laranjal.expositor}-{etiqueta.localizacao.Laranjal.posicao}</td>
                                    <td className={styles.etiquetaPreco}>R$ {String(etiqueta.precoAtual).replace('.', ',')}</td>
                                    <td className={styles.etiquetaUnidade}>{etiqueta.unidade}</td>
                                </tr>
                            </tbody>
                        </table>
                    )
                })}
            </div>
        </>
    )
}
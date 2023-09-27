import { useState } from 'react';
import styles from './EtiquetasPreco.module.css';

export function EtiquetasPreco({ etiquetas = [] }) {

    function selecionarEtiquetas(etiquetas) {
        
    }

    return (
        <div className={styles.etiquetasContainer}>
            {etiquetas.map((etiqueta) => {
                return (
                    <div className={styles.etiqueta} key={etiqueta.codigo}>
                        <div className={styles.etiquetaUnidade}>{etiqueta.unidade}</div>
                        <div className={styles.etiquetaPosicao}>{etiqueta.expositor}.{etiqueta.posicao}</div>
                        <div className={styles.etiquetaPreco}>R$ {etiqueta.precoAtual}</div>
                        <div className={styles.etiquetaCodigo}>{etiqueta.codigo}</div>
                        <div className={styles.etiquetaDescricao}>{etiqueta.descricao}</div>                       
                    </div>
                )
            })
            }
        </div>
    )
}


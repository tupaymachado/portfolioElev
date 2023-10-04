import styles from './EtiquetasForaPromo.module.css';

export function EtiquetasForaPromo({ etiquetas }) {

    return (
        <>
            <h1>ETIQUETAS FORA DE PROMOÇÃO:</h1>
            {etiquetas.map((etiquetas) => {
                return (
                    <div>
                        <div className={styles.etiqueta} key={etiquetas.codigo}>{/* 
                            <div className={styles.etiquetaPosicao}>{etiquetas.localizacao.Laranjal.expositor}-{etiquetas.localizacao.Laranjal.posicao}</div> */}
                            <div className={styles.etiquetaCodigo}>{etiquetas.codigo}</div>
                            <div className={styles.etiquetaDescricao}>{etiquetas.descricao}</div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
import styles from './EtiquetasForaPromo.module.css';

export function EtiquetasForaPromo({ etiquetas }) {

    return (
        <>
            <h1>ETIQUETAS FORA DE PROMOÇÃO:</h1>
            <div className={styles.etiquetasContainer}>
                {etiquetas.map((etiqueta) => {
                    return (
                        <div className={styles.etiqueta} key={etiqueta.codigo}>
                            <div className={styles.etiquetaPosicao}>{etiqueta.localizacao.Laranjal.expositor}-{etiqueta.localizacao.Laranjal.posicao}1-25</div>
                            <div className={styles.etiquetaCodigo}>{etiqueta.codigo}</div>
                            <div className={styles.etiquetaDescricao}>{etiqueta.descricao}</div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

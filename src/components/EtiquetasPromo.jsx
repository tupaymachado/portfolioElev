import styles from './EtiquetasPromo.module.css';

export const EtiquetasPromo = ({ etiquetas }) => {
    const handlePrint = () => {
        window.print();
    }

    return (
        <div className={styles.etiquetasPromoWrapper}>
            <h1>ETIQUETAS PROMOÇÃO:</h1>
            <button onClick={handlePrint}>Imprimir Etiquetas de Promoção</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>

                {etiquetas.map((etiqueta, index) => {
                    return (
                        <>
                            <div className={styles.etiqueta} key={etiqueta.codigo}>
                                <div className={styles.etiquetaCodigo}>{etiqueta.codigo}</div>
                                <div className={styles.etiquetaDescricao}>{etiqueta.descricao}</div>
                                <div className={styles.etiquetaPromocao}>PROMOÇÃO</div>
                                <div className={styles.etiquetaUnidade}>{etiqueta.unidade}</div>
                                <div className={styles.etiquetaPosicao}>{etiqueta.localizacao.Laranjal.expositor}-{etiqueta.localizacao.Laranjal.posicao}1-25</div>
                                <div className={styles.etiquetaPreco}>R$ {Number(etiqueta.precoPromocao).toFixed(2).replace('.', ',')}</div>
                                <p className={styles.etiquetaAVista}>À Vista</p>
                                <p className={styles.etiquetaAviso}>Promoção válida enquanto durarem os estoques</p>
                                <div className={styles.etiquetaData}>{new Date(etiqueta.dataPromocao).toLocaleDateString('pt-BR')}</div>
                            </div>
                            {(index + 1) % 8 === 0 && <div className={styles.pageBreak}></div>}
                        </>
                    )
                }
                )}
            </div>
        </div>
    )
}

/* import styles from './EtiquetasPromo.module.css';

export const EtiquetasPromo = ({ etiquetas }) => {
    const handlePrint = () => {
        window.print();
    }

    return (
        <>
            <button onClick={handlePrint}>Imprimir Etiquetas de Promoção</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>

                {etiquetas.map((etiqueta, index) => {
                    return (
                        <div className={styles.etiqueta} key={etiqueta.codigo}>
                            <div className={styles.etiquetaPromocao}>PROMOÇÃO</div>
                            <div className={styles.etiquetaUnidade}>{etiqueta.unidade == 'm2' ? 'Metro Quadrado' : 'Derp'}</div>
                            <div className={styles.etiquetaPosicao}>{etiqueta.expositor}-{etiqueta.posicao}</div>
                            <div className={styles.etiquetaPreco}>R$ {Number(etiqueta.precoPromocao).toFixed(2).replace('.', ',')}</div>
                            <p className={styles.etiquetaAVista}>À Vista</p>
                            <div className={styles.etiquetaCodigo}>{etiqueta.codigo}</div>
                            <div className={styles.etiquetaDescricao}>{etiqueta.descricao}</div>
                            <p className={styles.etiquetaAviso}>Promoção válida enquanto durarem os estoques</p>
                            <div className={styles.etiquetaData}>{new Date(etiqueta.dataPromocao).toLocaleDateString('pt-BR')}</div>
                            {(index + 1) % 8 === 0 && <div className={styles.pageBreak}></div>}
                        </div>
                    )
                })}
            </div>
        </>
    )
} */
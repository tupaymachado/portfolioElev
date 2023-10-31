import styles from './EtiquetasForaPromo.module.css';

export function EtiquetasForaPromo({ etiquetas }) {

    return (
        <div className={`${styles.etiquetasContainer} etiquetasContainer`}>
            <h1>ETIQUETAS FORA DE PROMOÇÃO:</h1>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Posição</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    {etiquetas.map((etiqueta) => {
                        return (
                            <tr className={styles.etiqueta} key={etiqueta.codigo}>
                                <td className={styles.etiquetaCodigo}>{etiqueta.codigo}</td>
                                <td className={styles.etiquetaPosicao}>{etiqueta.localizacao.Laranjal.expositor}-{etiqueta.localizacao.Laranjal.posicao}</td>
                                <td className={styles.etiquetaDescricao}>{etiqueta.descricao}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

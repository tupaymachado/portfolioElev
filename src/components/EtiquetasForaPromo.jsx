import styles from './EtiquetasForaPromo.module.css';
import tabelaStyles from './Tabelas.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';

export function EtiquetasForaPromo({ etiquetas }) {
    const etiquetasOrdenadas = [...etiquetas].sort(ordenarEtiquetas);

    return (
        <div className={`${styles.etiquetasContainer} ${tabelaStyles.etiquetasContainer} etiquetasContainer`}>
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
                    {etiquetasOrdenadas.map((etiqueta) => {
                        return (
                            <tr className={`${styles.etiqueta} ${tabelaStyles.etiqueta}`} key={etiqueta.codigo}>
                                <td className={`${styles.etiquetaCodigo} ${tabelaStyles.etiquetaCodigo}`}>{etiqueta.codigo == '0' ? etiqueta.referencia : etiqueta.codigo}</td>
                                <td className={`${styles.etiquetaPosicao} ${tabelaStyles.etiquetaPosicao}`}>{etiqueta.localizacao.Laranjal.expositor}-{etiqueta.localizacao.Laranjal.posicao}</td>
                                <td className={`${styles.etiquetaDescricao} ${tabelaStyles.etiquetaDescricao}`}>{etiqueta.descricao}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

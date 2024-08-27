import tabelaStyles from './Tabelas.module.css';
import styles from './EtiquetasForaPromo.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';

export function EtiquetasForaPromo({ etiquetas, user }) {
    const etiquetasOrdenadas = [...etiquetas].sort(ordenarEtiquetas);

    function handlePrint() {
        window.print();
    }

    return (
        <div className={`${tabelaStyles.etiquetasWrapper} ${styles.etiquetasWrapper} `}>
            <p>Itens Fora de Promoção</p>
            <button onClick={handlePrint} className={`${tabelaStyles.printButton} ${styles.printButton}`}>Imprimir Relatório de Fora de Promoção</button>
            <div className={` ${tabelaStyles.etiquetasContainer} ${styles.etiquetasContainer} ${etiquetas.length < 1 ? tabelaStyles.tableMinHeight : ' '} etiquetasContainer`}>
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
                                    <td className={`${tabelaStyles.etiquetaCodigo} ${styles.etiquetaCodigo}`}>{etiqueta.codigo == '0' ? etiqueta.referencia : etiqueta.codigo}</td>
                                    <td className={`${tabelaStyles.etiquetaPosicao} ${styles.etiquetaPosicao}`}>
                                        {`${etiqueta.localizacao.Laranjal?.expositor ?? ''}-${etiqueta.localizacao.Laranjal?.posicao ?? ''}`}
                                    </td>
                                    <td className={`${tabelaStyles.etiquetaDescricao} ${styles.etiquetaDescricao}`}>{etiqueta.descricao}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
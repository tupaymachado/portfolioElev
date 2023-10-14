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
                <table>
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
                        {etiquetas.flatMap((etiqueta, index) => {
                            const quantidade = etiqueta.quantidade || 1;
                            const localizacao = etiqueta.localizacao?.Laranjal || {};
                            return Array.from({ length: quantidade }, (_, i) => (
                                <tr key={`${etiqueta.codigo}-${i}`} className={styles.etiqueta}>
                                    <td className={styles.etiquetaCodigo}>{etiqueta.codigo}</td>
                                    <td className={styles.etiquetaDescricao}>{etiqueta.descricao}</td>
                                    <td className={styles.etiquetaPosicao}>{localizacao.expositor}-{localizacao.posicao}</td>
                                    <td className={styles.etiquetaPreco}>R$ {String(etiqueta.precoAtual).replace('.', ',')}</td>
                                    <td className={styles.etiquetaUnidade}>{etiqueta.unidade}</td>
                                    <td className={styles.etiquetaData}>{new Date(etiqueta.dataPrecoAtual).toLocaleDateString('pt-BR')}
                                    
                                    </td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

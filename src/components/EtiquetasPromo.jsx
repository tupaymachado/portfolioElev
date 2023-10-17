import styles from './EtiquetasPromo.module.css';

export const EtiquetasPromo = ({ etiquetas = [], setEtiquetas }) => {
    const handlePrint = () => {
        window.print();
    }

    const handleDelete = (index) => {
        const newEtiquetas = [...etiquetas];
        newEtiquetas.splice(index, 1);
        setEtiquetas(newEtiquetas);
    }

    return (
        <>
            <h1>ETIQUETAS PROMOÇÃO:</h1>
            <button onClick={handlePrint}>Imprimir Etiquetas de Promoção</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Promoção</th>
                            <th>Posição</th>
                            <th>Preço</th>
                            <th>Data</th>
                            <th>Deletar etiquetas</th>
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
                                    <td className={styles.etiquetaPromocao}>PROMOÇÃO</td>
                                    <td className={styles.etiquetaUnidade}>{etiqueta.unidade}</td>
                                    <td className={styles.etiquetaPosicao}>{localizacao.expositor} - {localizacao.posicao}</td>
                                    <td className={styles.etiquetaPreco}>R$ {Number(etiqueta.precoPromocao).toFixed(2).replace('.', ',')}</td>
                                    <td className={styles.etiquetaData}>{new Date(etiqueta.dataPromocao).toLocaleDateString('pt-BR')}</td>
                                    <td><button onClick={() => handleDelete(index)}>Deletar</button></td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}
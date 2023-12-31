import styles from './EtiquetasPromo.module.css';
import tabelaStyles from './Tabelas.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';
import { doc, deleteDoc, db } from './firebaseConfig.jsx';

export const EtiquetasPromo = ({ etiquetas = [], setEtiquetas }) => {
    const handlePrint = () => {
        window.print();
    }

    function handleDelete(codigo) {
        const newEtiquetas = etiquetas.filter(etiqueta => etiqueta.codigo !== codigo);
        setEtiquetas(newEtiquetas);
    }

    function handleExclusao(codigo) {
        confirm(`Deseja excluir a amostra ${codigo} do Banco de Dados?`)
        if (confirm) {
            const newEtiquetas = etiquetas.filter(etiqueta => etiqueta.codigo !== codigo);
            setEtiquetas(newEtiquetas);
            const docRef = doc(db, 'portfolio', codigo);
            deleteDoc(docRef);
            console.log(`Amostra ${codigo} excluída.`)
        }
    }

    const etiquetasOrdenadas = [...etiquetas].sort(ordenarEtiquetas);

    return (
        <div className={`${tabelaStyles.etiquetasWrapper} ${styles.etiquetasWrapper} `}>
            <p>Etiquetas Promoção</p>
            <button onClick={handlePrint} className={`${styles.printButton} ${tabelaStyles.printButton}`}>Imprimir Etiquetas de Promoção</button>
            <div className={`${styles.etiquetasContainer} ${tabelaStyles.etiquetasContainer} ${etiquetas.length < 1 ? tabelaStyles.tableMinHeight : ' '} etiquetasContainer`}>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descrição</th>
                            <th>Posição</th>
                            <th>Preço</th>
                            <th>Deletar etiqueta</th>
                            <th>Excluir amostra</th>
                        </tr>
                    </thead>
                    <tbody>
                        {etiquetasOrdenadas.flatMap((etiqueta) => {
                            const quantidade = etiqueta.quantidade || 1;
                            const localizacao = etiqueta.localizacao?.Laranjal || {};
                            return Array.from({ length: quantidade }, (_, i) => (
                                <tr key={`${etiqueta.codigo}-${i}`} className={`${styles.etiqueta} ${tabelaStyles.etiqueta}`}>
                                    <td className={`${styles.etiquetaCodigo} ${tabelaStyles.etiquetaCodigo}`}>{etiqueta.codigo}</td>
                                    <td className={`${styles.etiquetaDescricao} ${tabelaStyles.etiquetaDescricao}`}>{etiqueta.descricao}</td>
                                    <td className={`${styles.etiquetaPosicao} ${tabelaStyles.etiquetaPosicao}`}>{localizacao.expositor} - {localizacao.posicao}</td>
                                    <td className={`${styles.etiquetaPromocao} ${tabelaStyles.etiquetaPromocao}`}>PROMOÇÃO</td>
                                    <td className={`${styles.etiquetaUnidade} ${tabelaStyles.etiquetaUnidade}`}>{etiqueta.unidade}</td>
                                    <td className={`${styles.etiquetaAviso} ${tabelaStyles.etiquetaAviso}`}>Promoção válida enquanto durarem os estoques</td>
                                    <td className={`${styles.etiquetaAVista} ${tabelaStyles.etiquetaAVista}`}>À Vista</td>
                                    <td className={`${styles.etiquetaPreco} ${tabelaStyles.etiquetaPreco}`}>R$ {Number(etiqueta.precoPromocao).toFixed(2).replace('.', ',')}</td>
                                    <td className={`${styles.etiquetaData} ${tabelaStyles.etiquetaData}`}>{new Date(etiqueta.dataPromocao).toLocaleDateString('pt-BR')}</td>
                                    <td><button onClick={() => handleDelete(index)}>Deletar</button></td>
                                    <td><button onClick={() => handleExclusao(etiqueta.codigo)}>Excluir amostra</button></td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
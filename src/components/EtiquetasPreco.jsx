import styles from './EtiquetasPreco.module.css';
import tabelaStyles from './Tabelas.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';
import { doc, deleteDoc, db } from './firebaseConfig.jsx';

export function EtiquetasPreco({ etiquetas = [], setEtiquetas }) {
    function handlePrint() {
        window.print();
    }

    function handleDelete(index) {
        const newEtiquetas = [...etiquetas];
        newEtiquetas.splice(index, 1);
        setEtiquetas(newEtiquetas);
    }

    function handleExclusao(codigo, index) {
        confirm(`Deseja excluir a amostra ${codigo} do Banco de Dados?`)
        if (confirm) {
            const newEtiquetas = [...etiquetas];
            newEtiquetas.splice(index, 1);
            setEtiquetas(newEtiquetas);
            const docRef = doc(db, 'portfolio', codigo);
            deleteDoc(docRef);
            console.log(`Amostra ${codigo} excluída.`)
        }
    }

    const etiquetasOrdenadas = [...etiquetas].sort(ordenarEtiquetas);

    return (
        <div className={`${styles.precosWrapper} ${tabelaStyles.precosWrapper}`}>
            <h1>ETIQUETAS PREÇO:</h1>
            <button onClick={handlePrint} className={`${styles.printButton} ${tabelaStyles.printButton}`}>Imprimir Etiquetas de Preço</button>
            <div className={`${styles.etiquetasContainer} ${tabelaStyles.etiquetasContainer} etiquetasContainer`}>
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
                        {etiquetasOrdenadas.flatMap((etiqueta, index) => {
                            const quantidade = etiqueta.quantidade || 1;
                            const localizacao = etiqueta.localizacao?.Laranjal || {};
                            return Array.from({ length: quantidade }, (_, i) => (
                                <tr key={`${etiqueta.codigo}-${i}`} className={`${styles.etiqueta} ${tabelaStyles.etiqueta}`}>
                                    <td className={`${styles.etiquetaCodigo} ${tabelaStyles.etiquetaCodigo}`}>{etiqueta.codigo}</td>
                                    <td className={`${styles.etiquetaDescricao} ${tabelaStyles.etiquetaDescricao}`}>{etiqueta.descricao}</td>
                                    <td className={`${styles.etiquetaPosicao} ${tabelaStyles.etiqueta}`}>{localizacao.expositor} - {localizacao.posicao}</td>
                                    <td className={`${styles.etiquetaPreco} ${tabelaStyles.etiqueta}`}>R$ {etiqueta.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className={`${styles.etiquetaUnidade} ${tabelaStyles.etiqueta}`}>{etiqueta.unidade}</td>
                                    <td className={`${styles.etiquetaData} ${tabelaStyles.etiqueta}`}>{new Date(etiqueta.dataPrecoAtual).toLocaleDateString('pt-BR')}</td>
                                    <td><button onClick={() => handleDelete(index)}>Deletar</button></td>
                                    <td><button onClick={() => handleExclusao(etiqueta.codigo, index)}>Excluir amostra</button></td>
                                </tr>
                            ))
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

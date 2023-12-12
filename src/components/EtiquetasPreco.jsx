import styles from './EtiquetasPreco.module.css';
import tabelaStyles from './Tabelas.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';
import { doc, deleteDoc, db, getDoc, updateDoc, deleteField } from './firebaseConfig.jsx';

export function EtiquetasPreco({ etiquetas = [], setEtiquetas }) {
    function handlePrint() {
        window.print();
    }

    function handleDelete(codigo) {
        const newEtiquetas = etiquetas.filter(etiqueta => etiqueta.codigo !== codigo);
        setEtiquetas(newEtiquetas);
    }

    async function handleExclusao(codigo) {
        const userConfirmed = window.confirm(`Deseja excluir a amostra ${codigo} do Banco de Dados?`);

        if (userConfirmed) {
            try {
                const docRef = doc(db, 'portfolio', codigo);
                await updateDoc(docRef, {
                    'localizacao.Laranjal': deleteField()
                });
                console.log(`Amostra ${codigo} excluída com sucesso.`);
                /* const docSnapshot = await getDoc(docRef);
                const existingData = docSnapshot.data();
                if (docSnapshot.exists()) {
                  const newData = { ...existingData };
                  console.log(newData.localizacao.Laranjal);
                  delete newData.localizacao.Laranjal;
                  console.log(newData);
                  await updateDoc(docRef, newData);
                } else {
                  console.log(`Amostra ${codigo} não encontrada.`);
                }*/
            } catch (error) {
                console.error('Erro ao excluir o campo "acabamento":', error);
            }
        }
    }

    const etiquetasOrdenadas = [...etiquetas].sort(ordenarEtiquetas);

    return (
        <div className={`${styles.etiquetasWrapper} ${tabelaStyles.etiquetasWrapper}`}>
            <p>Etiquetas Preço</p>
            <button onClick={handlePrint} className={`${styles.printButton} ${tabelaStyles.printButton}`}>Imprimir Etiquetas de Preço</button>
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
                                    <td className={`${styles.etiquetaPosicao} ${tabelaStyles.etiqueta}`}>{localizacao.expositor} - {localizacao.posicao}</td>
                                    <td className={`${styles.etiquetaPreco} ${tabelaStyles.etiqueta}`}>R$ {etiqueta.precoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td className={`${styles.etiquetaUnidade} ${tabelaStyles.etiqueta}`}>{etiqueta.unidade}</td>
                                    <td className={`${styles.etiquetaData} ${tabelaStyles.etiqueta}`}>{new Date(etiqueta.dataPrecoAtual).toLocaleDateString('pt-BR')}</td>
                                    <td><button onClick={() => handleDelete(etiqueta.codigo)}>Deletar</button></td>
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

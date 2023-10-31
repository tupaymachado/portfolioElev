import styles from './EtiquetasPromo.module.css';
import { ordenarEtiquetas } from './helpers/ordenarEtiquetas.jsx';
import { doc, deleteDoc, db } from './firebaseConfig.jsx';

export const EtiquetasPromo = ({ etiquetas = [], setEtiquetas }) => {
    const handlePrint = () => {
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
        <div className={styles.promoWrapper}>
            <h1>ETIQUETAS PROMOÇÃO:</h1>
            <button onClick={handlePrint} className={styles.printButton}>Imprimir Etiquetas de Promoção</button>
            <div className={`${styles.etiquetasContainer} etiquetasContainer`}>
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
                                <tr key={`${etiqueta.codigo}-${i}`} className={styles.etiqueta}>
                                    <td className={styles.etiquetaCodigo}>{etiqueta.codigo}</td>
                                    <td className={styles.etiquetaDescricao}>{etiqueta.descricao}</td>
                                    <td className={styles.etiquetaPosicao}>{localizacao.expositor} - {localizacao.posicao}</td>
                                    <td className={styles.etiquetaPromocao}>PROMOÇÃO</td>
                                    <td className={styles.etiquetaUnidade}>{etiqueta.unidade}</td>
                                    <td className={styles.etiquetaAviso}>Promoção válida enquanto durarem os estoques</td>
                                    <td className={styles.etiquetaAVista}>À Vista</td>
                                    <td className={styles.etiquetaPreco}>R$ {Number(etiqueta.precoPromocao).toFixed(2).replace('.', ',')}</td>
                                    <td className={styles.etiquetaData}>{new Date(etiqueta.dataPromocao).toLocaleDateString('pt-BR')}</td>
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
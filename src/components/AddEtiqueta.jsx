import styles from './AddEtiqueta.module.css';
import { useState } from 'react';

export function AddEtiqueta() {
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [data, setData] = useState('');
    const [unidade, setUnidade] = useState('');

    function handleAddEtiqueta(event) {
        event.preventDefault();
        console.log('Etiqueta adicionada!');
        console.log(`Código: ${codigo}`);
        console.log(`Descrição: ${descricao}`);
        console.log(`Preço: ${preco}`);
        console.log(`localizacao: ${localizacao}`);
        console.log(`Data: ${data}`);
        console.log(`Unidade: ${unidade}`);
    }

    return (
        <form className={styles.addEtiqueta} onSubmit={handleAddEtiqueta}>
            <h3>Adicionar etiqueta manualmente</h3>
            <div className={styles.radial}>
                <input type="radio" id="preco" name="tipoEtiqueta" value="preco" />
                <label htmlFor="preco">Preço</label>
                <input type="radio" id="promocao" name="tipoEtiqueta" value="promocao" />
                <label htmlFor="promocao">Promoção</label>
            </div>

            <input
                onChange={(event) => setCodigo(event.target.value)}
                type="text"
                placeholder="Código"
            />
            <input
                onChange={(event) => setDescricao(event.target.value)}
                type="text"
                placeholder="Descrição"
            />
            <input
                onChange={(event) => setPreco(event.target.value)}
                type="text"
                placeholder="Preço"
            />
            <input
                onChange={(event) => setLocalizacao(event.target.value)}
                type="text"
                placeholder="Localizacao"
            />
            <input
                onChange={(event) => setData(event.target.value)}
                type="text"
                placeholder="Data"
            />
            <input
                onChange={(event) => setUnidade(event.target.value)}
                type="text"
                placeholder="Unidade"
            />
            <button type="submit">Adicionar</button>
        </form>
    );
}
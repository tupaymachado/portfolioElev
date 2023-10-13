import styles from './AddEtiqueta.module.css';
import { useEffect, useState } from 'react';

export function AddEtiqueta({ precos, setPrecos, promos, setPromos }) {
    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [expositor, setExpositor] = useState('');
    const [posicao, setPosicao] = useState('');
    const [data, setData] = useState('');
    const [unidade, setUnidade] = useState('');
    const [tipoEtiqueta, setTipoEtiqueta] = useState('preco');

    function handleAddEtiqueta(event) {
        event.preventDefault();
        const etiqueta = {
            codigo,
            descricao,
            precoAtual: Number(preco.replace(',', '.')),
            localizacao: {
                Laranjal: {
                    expositor: expositor,
                    posicao: posicao
                }
            },
            data: new Date(),
            unidade
        };
        if (tipoEtiqueta === 'preco') {
            setPrecos(prevPrecos => [...prevPrecos, etiqueta]);
        } else if (tipoEtiqueta === 'promocao') {
            setPromos(prevPromos => [...prevPromos, etiqueta]);
        }
    }

    return (
        <form className={styles.addEtiqueta} onSubmit={handleAddEtiqueta}>
            <h3>Adicionar etiqueta manualmente</h3>
            <div className={styles.radial}>
                <input type="radio" id="preco" name="tipoEtiqueta" value="preco" checked={tipoEtiqueta === 'preco'} onChange={(e) => setTipoEtiqueta(e.target.value)} />
                <label htmlFor="preco">Preço</label>
                <input type="radio" id="promocao" name="tipoEtiqueta" value="promocao" checked={tipoEtiqueta === 'promocao'} onChange={(e) => setTipoEtiqueta(e.target.value)} />
                <label htmlFor="promocao">Promoção</label>
            </div>

            <input
                onChange={(event) => setCodigo(event.target.value)}
                type="number"
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
                onChange={(event) => setExpositor(event.target.value)}
                type="text"
                placeholder="Expositor"
            />
            <input
                onChange={(event) => setPosicao(event.target.value)}
                type="text"
                placeholder="Posição"
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

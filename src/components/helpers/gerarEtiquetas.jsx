function handlePrecos(preco, setPrecos) {
    setPrecos(prevPrecos => [...prevPrecos, preco]);
}

function handlePromos(promos, setPromos) {
    setPromos(prevPromos => [...prevPromos, promos]);
}

function handleForaPromos(foraPromos, setForaPromos) {
    setForaPromos(prevForaPromos => [...prevForaPromos, foraPromos]);
}

export function verificaEtiquetasPreco(docData, item, setPrecos) { //verifica se o item precisa ter uma etiqueta de preço impressa
    if (docData.localizacao) {
        if (item.precoAtual !== 0) {
            if (!docData.precoAtual || item.dataPrecoAtual.getTime() === docData.dataUltimoPreco.toDate().getTime() || Math.abs(item.precoAtual - docData.precoAtual) > 0.1) {
                let obj = {
                    ...item,
                    unidade: docData.unidade,
                    localizacao: docData.localizacao,
                }
                console.log(obj)
                handlePrecos(obj, setPrecos)
            }
        }
    };
};

export function verificaEtiquetasPromo(docData, item, setPromos, setForaPromos) { //verifica se o item precisa ter uma etiqueta de promoção impressa ou retirada
    if (docData.localizacao && item.promocao === true && item.precoPromocao !== 0) { //se o preço é 0, é pq tiraram de promoção mas não mudaram o status, não sei pq essa viagem
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handlePromos(obj, setPromos)
    } else if (docData.expositor && item.promocao === false || docData.expositor && item.precoPromocao === 0) { //se o preço é 0, será que eu retiro a etiqueta???
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handleForaPromos(obj, setForaPromos)
    }
}
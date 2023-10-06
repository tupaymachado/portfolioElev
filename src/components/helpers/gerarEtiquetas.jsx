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
    if (item.precoAtual > 0) {
        if (!docData.precoAtual || item.dataPrecoAtual.getTime() === docData.dataUltimoPreco.toDate().getTime() || Math.abs(item.precoAtual - docData.precoAtual) > 0.1 && item.dataPromocao.getTime() > docData.dataPromocao.toDate().getTime()) {
            let obj = {
                ...item,
                unidade: docData.unidade,
                localizacao: docData.localizacao,
            }
            handlePrecos(obj, setPrecos)
        }
    }
};

export function verificaEtiquetasPromo(docData, item, setPromos, setForaPromos) { //verifica se o item precisa ter uma etiqueta de promoção impressa ou retirada
    console.log(item.codigo); //if (item.promocao === false, nem rodar o resto)
    if (item.promocao === true && !docData.promocao || item.promocao === true && item.dataPromocao.getTime() >= docData.dataPromocao.toDate().getTime()) { //se o preço é 0, é pq tiraram de promoção mas não mudaram o status, não sei pq essa viagem
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handlePromos(obj, setPromos)
    } else if (!docData.promocao && item.promocaoStatus === false || item.dataPromocao.getTime() >= docData.dataPromocao.toDate().getTime() && item.promocao == false) { //se o preço é 0, será que eu retiro a etiqueta???
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handleForaPromos(obj, setForaPromos)
    }
}
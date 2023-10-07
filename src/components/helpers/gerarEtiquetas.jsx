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

export function verificaEtiquetasPromo(docData, item, setPromos, setForaPromos) {
    if (item.promocao === true && (!docData.promocao || (docData.dataPromocao && item.dataPromocao.getTime() >= docData.dataPromocao.toDate().getTime()))) {
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handlePromos(obj, setPromos)
    } else if (!docData.promocao && item.promocaoStatus === false || (docData.dataPromocao && item.dataPromocao.getTime() > docData.dataPromocao.toDate().getTime() && item.promocao == false)) {
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handleForaPromos(obj, setForaPromos)
    }
}

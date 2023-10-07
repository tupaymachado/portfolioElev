function handlePrecos(preco, setPrecos) {
    setPrecos(prevPrecos => [...prevPrecos, preco]);
}

function handlePromos(promos, setPromos) {
    setPromos(prevPromos => [...prevPromos, promos]);
}

function handleForaPromos(foraPromos, setForaPromos) {
    setForaPromos(prevForaPromos => [...prevForaPromos, foraPromos]);
}

export function verificaEtiquetasPreco(docData, item, setPrecos) {
    if (item.precoAtual > 0) {
        const dataPrecoAtual = item.dataPrecoAtual.getTime();
        const dataUltimoPreco = docData.dataUltimoPreco && docData.dataUltimoPreco.toDate().getTime();
        const dataPrecoAtualDoc = docData.dataPrecoAtual && docData.dataPrecoAtual.toDate().getTime();

        if (!docData.precoAtual || dataPrecoAtual === dataUltimoPreco === dataPrecoAtualDoc || Math.abs(item.precoAtual - docData.precoAtual) > 0.1 && dataPrecoAtual > dataPrecoAtualDoc) {
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
    let itemMaisRecente = '';
    const dataPromocao = docData.dataPromocao && docData.dataPromocao.toDate().getTime();
    const dataItemPromocao = item.dataPromocao.getTime();

    if (docData.promocao) {
        itemMaisRecente = dataItemPromocao > dataPromocao ? true : dataItemPromocao === dataPromocao ? false : '';
    }

    let obj = {
        ...item,
        unidade: docData.unidade,
        localizacao: docData.localizacao,
    }

    if (item.codigo == 1053962) {
        console.log('dataPromocao: ' + dataPromocao)
        console.log('dataItemPromocao: ' + dataItemPromocao)
        console.log('item.promocao: ' + item.promocao)
        console.log('docData.promocao: ' + docData.promocao)
    }

    if (item.promocao === true && (!docData.promocao || (itemMaisRecente && item.precoPromocao !== docData.precoPromocao) || (itemMaisRecente === false))) {
        handlePromos(obj, setPromos)
    } else if (!docData.promocao && item.promocaoStatus === false || (dataPromocao && dataItemPromocao > dataPromocao && item.promocao == false && docData.promocao == true)) {
        handleForaPromos(obj, setForaPromos) //não está pegando caso o relatório seja do mesmo dia do DB
    }
}


/* 
export function verificaEtiquetasPreco(docData, item, setPrecos) {
    if (item.precoAtual > 0) {
        if (!docData.precoAtual || item.dataPrecoAtual.getTime() === docData.dataUltimoPreco.toDate().getTime() === docData.dataPrecoAtual.toDate().getTime() || Math.abs(item.precoAtual - docData.precoAtual) > 0.1 && item.dataPrecoAtual.getTime() > docData.dataPrecoAtual.toDate().getTime()) {
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
    let itemMaisRecente = '';
    if (docData.promocao) {
        if (item.dataPromocao.getTime() > docData.dataPromocao.toDate().getTime()) { //relatório mais recente que o DB
            itemMaisRecente = true;
            console.log(docData.codigo, itemMaisRecente)
        } else if (item.dataPromocao.getTime() == docData.dataPromocao.toDate().getTime()) { //relatório e DB com mesma data (pessoa upando o mesmo relatório mais de uma vez no mesmo dia)
            itemMaisRecente = false;
            console.log(docData.codigo, itemMaisRecente)
        }
    }
    if (item.promocao === true && (!docData.promocao || (itemMaisRecente && item.precoPromocao !== docData.precoPromocao) || (itemMaisRecente === false))) {
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handlePromos(obj, setPromos)
    } else if (!docData.promocao && item.promocaoStatus === false || (docData.dataPromocao && item.dataPromocao.getTime() > docData.dataPromocao.toDate().getTime() && item.promocao == false && docData.promocao == true)) {
        let obj = {
            ...item,
            unidade: docData.unidade,
            localizacao: docData.localizacao,
        }
        handleForaPromos(obj, setForaPromos)
    }
} */
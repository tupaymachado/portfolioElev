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
        const dataPrecoAtualDoc = docData.dataPrecoAtual && docData.dataPrecoAtual.toDate().getTime();
        if (!docData.precoAtual || //caso não tenha nenhuma info de preço no DB, é obrigatório a sair etiqueta
            dataPrecoAtual === dataPrecoAtualDoc || //Basta que a data do DB seja igual a do relatório para determinar que é uma reimpressão
            Math.abs(item.precoAtual - docData.precoAtual) > 0.1) { //se já houver infos no DB, verifica se o preço tem diferença maior que 10 centavos
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
    const dataPromocao = docData.dataPromocao && docData.dataPromocao.toDate().getTime();
    const dataItemPromocao = item.dataPromocao.getTime();

    let obj = {
        ...item,
        unidade: docData.unidade,
        localizacao: docData.localizacao,
    }

    if (item.promocao === true && !docData.promocao || //se o promocao > 0, e o item não estiver em promoção no DB, quero que saia uma etiqueta de promoção
        item.promocao === true && item.precoPromocao !== docData.precoPromocao) { //se promocao > 0 e os preços forem diferentes, também quero etiqueta
        handlePromos(obj, setPromos) //não posso me basear em promocaoStatus, pois as vezes ela é true e o preço é 0
    } else if (!docData.promocao && item.promocaoStatus === false && item.promocao === false || //se não houver promoção no DB e no relatório estiver preço promo 0 e promocaoStatus false
        dataPromocao && item.promocao === false && docData.promocao === true //se houver promoção no DB, o preço promoção == 0 e o item estiver em promo no DB
        //em caso de reimpressão, vou precisar salvar uma cópia do relatório de retirada de etiquetas no DB para reimprimir
        ) { //preciso guardar a data de saída de promoção no terceiro caso
        handleForaPromos(obj, setForaPromos) //não está pegando caso o relatório seja do mesmo dia do DB
    }
}
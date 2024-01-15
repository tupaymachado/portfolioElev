function handlePrecos(preco, setPrecos) {
    setPrecos(prevPrecos => [...prevPrecos, preco]);
}

function handlePromos(promos, setPromos) {
    setPromos(prevPromos => [...prevPromos, promos]);
}

function handleForaPromos(foraPromos, setForaPromos) {
    setForaPromos(prevForaPromos => [...prevForaPromos, foraPromos]);
}
/* Há um problema com essa forma de verificar, no caso de haver diversas mudanças de preço sucessivas que sejam 
menores de 10 centavos cada. Nesse caso, o preço pode ir subindo sem parar e nunca vai sair uma etiqueta */
export function verificaEtiquetasPreco(user, docData, item, setPrecos) {
    if (item.precoAtual > 0) {
        const dataPrecoAtual = item.dataPrecoAtual.getTime();
        const dataPrecoAtualDoc = docData.dataPrecoAtual && docData.dataPrecoAtual.toDate().getTime(); 
        if (!docData.precoAtual || //caso não tenha nenhuma info de preço no DB, é obrigatório a sair etiqueta
            dataPrecoAtual === dataPrecoAtualDoc && Math.abs(item.precoAtual - docData.ultimoPreco) > 0.1 || //Se a data for igual, as infos do relatório já devem constar no DB. Portanto, o preçoAtual será igual para relatório e DB, assim deve ser verificado com ultimoPreco
            Math.abs(item.precoAtual - docData.precoAtual) > 0.1) { //se já houver infos no DB, verifica se o preço tem diferença maior que 10 centavos
            let obj = {
                ...item,
                unidade: docData.unidade,
                localizacao: docData.localizacao,
                quantidade: docData.quantidade,
            }
            handlePrecos(obj, setPrecos)
        }
    }
};

export function verificaEtiquetasPromo(user, docData, item, setPromos, setForaPromos) {
    const dataPromocao = item.dataPromocao.getTime();

    let obj = {
        ...item,
        unidade: docData.unidade,
        localizacao: docData.localizacao,
        quantidade: docData.quantidade,
    }
    if (item.codigo === '1126740') {
        console.log('item', item)
        console.log('docData', docData)
    }
    //sempre que o preço promoção for maior que 0, quero que saia uma etiqueta de promoção, exceto caso o preço não tenha mudado (o que é muito raro)
    //promoções não checam nada relacionado a data também, então podem reimprimir etiquetas
    if (item.promocao === true && !docData.promocao || //se o preço promocao > 0, e o item não estiver em promoção no DB, quero que saia uma etiqueta de promoção
        item.promocao === true && item.precoPromocao !== docData.precoPromocao && dataPromocao || //preco promo > 0, precos diferentes relatorio e db e dataPromocao existente
        item.promocao === true && dataPromocao == docData.dataPromocao.toDate().getTime() && item.precoPromocao !== docData.ultimoPrecoPromocao //preco promo > 0, mesma data de promoção (segunda vez que o relatório entra no sistema), preco item.promo diferente de ultimoPrecoPromo
        ) {
        handlePromos(obj, setPromos)
    } else if (item.promocaoStatus === false || //se o relatório estiver marcando pra retirar, sempre o preço promo é 0
        dataPromocao && item.promocao === false && item.promocaoStatus === true //se houver promoção no DB, o preço promoção == 0 e o item estiver em promo no DB
        ) {
        handleForaPromos(obj, setForaPromos) //não está pegando caso o relatório seja do mesmo dia do DB
    }
}
export function verificaEtiquetasPreco(docData, item, precosImprimir) { //verifica se o item precisa ter uma etiqueta de preço impressa
    if (docData.expositor) {
        if (item.precoAtual !== 0) {
            console.log()
            let dataComparacao = item.dataPrecoAtual === docData.dataPrecoAtual.toDate() ? docData.ultimoPreco : docData.precoAtual;
            if (Math.abs(item.precoAtual - dataComparacao) >= 0.1) {
                let obj = {
                    ...item,
                    localizacao: docData.localizacao,
                }
                precosImprimir.push(obj);
            }
        }
    };
};

export function verificaEtiquetasPromo(docData, item, promosImprimir, foraPromoImprimir) { //verifica se o item precisa ter uma etiqueta de promoção impressa ou retirada
    if (docData.expositor && item.promocao === true && item.precoPromocao !== 0) { //se o preço é 0, é pq tiraram de promoção mas não mudaram o status, não sei pq essa viagem
        let obj = {
            ...item,
            localizacao: docData.localizacao,
        }
        promosImprimir.push(obj);
    } else if (docData.expositor && item.promocao === false || docData.expositor && item.precoPromocao === 0) { //se o preço é 0, será que eu retiro a etiqueta???
        let obj = {
            ...item,
            localizacao: docData.localizacao,
        }
        foraPromoImprimir.push(obj);
    }
}
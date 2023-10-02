import { db } from '../firebaseConfig.jsx';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { verificaEtiquetasPreco, verificaEtiquetasPromo } from './gerarEtiquetas';

export async function updateData(jsonData, onEtiquetasPreco, onEtiquetasPromo, onEtiquetasForaPromo) { //aproveita o loop para já separar a intersecção entre jsonData e dadosDB
    const portfolioRef = collection(db, 'portfolio');
    const precosImprimir = [];
    const promosImprimir = [];
    const foraPromoImprimir = [];
    for (const item of jsonData) {
        const codigo = item.codigo;
        const docRef = doc(portfolioRef, codigo);
        const docSnapshot = await getDoc(docRef);
        let docData;
        if (docSnapshot.exists()) {
            docData = docSnapshot.data();
            if (docData.descricao) {
                await updateDoc(docRef, precoEPromo(docData, item)); //se o item já tiver sido gravado a partir do relatório, apenas atualiza os preços e promoções
            } else {
                await updateDoc(docRef, item); //se o item tiver sido gravado apenas a partir do CSV, atualiza com todos os dados do relatório
            }
            verificaEtiquetasPreco(docData, item, precosImprimir);
            verificaEtiquetasPromo(docData, item, promosImprimir, foraPromoImprimir);            
        } else {
            await setDoc(docRef, item); //se o item não existir no DB, grava todos os dados do relatório
        }
    }
    onEtiquetasPreco(precosImprimir);
    onEtiquetasPromo(promosImprimir);
    onEtiquetasForaPromo(foraPromoImprimir);
    console.log('PrecosImprimir:');
    console.log(precosImprimir);
    console.log('PromosImprimir:')
    console.log(promosImprimir)
    console.log('ForaPromoImprimir:')
    console.log(foraPromoImprimir)
    console.log('Dados atualizados com sucesso!');
};

export function precoEPromo(docData, item) { //executado apenas em escritas subsequentes de cada item
    const dataPromocaoItem = new Date(item.dataPromocao);
    const dataPromocaoDB = docData.dataPromocao.toDate();
    let precosEPromosUpdate = {};
    //update status de promoção
    if (dataPromocaoItem > dataPromocaoDB && item.promocao !== 'Sem mudança') {
        precosEPromosUpdate = {
            promocao: item.promocao,
        }
    }
    //update preço de promoção
    if (item.precoPromocao !== 0 && item.precoPromocao !== docData.precoPromocao || item.promocao === false) { //se preço promoção for diferente de 0 e diferente do preço atual no DB
        precosEPromosUpdate = {
            ...precosEPromosUpdate,
            precoPromocao: item.precoPromocao,
            dataPromocao: dataPromocaoItem
        }
        /* existe uma possibilidade remota de promocao ser true e precoPromocao ser 0,
        caso o item.promocao seja true por conta do status "prorrogado promo". Esse status seta, corretamente, o status de promocao como true,
        porém não necessariamente é informado um preço de promoção no relatório 10449. Se um dado item tiver a primeira escrita nesse caso, enquanto ele não sair
        de promoção, o preço de promoção será 0. Nesse caso deve haver uma verificação nas etiquetas e na implementação da pesquisa
        para que esse item seja analisado manualmente no CISS.  */
    }
    if (item.precoAtual !== 0 && item.precoAtual !== docData.precoAtual) { //se preço varejo for diferente de 0 e diferente do preço atual no DB
        precosEPromosUpdate = { //atualiza o preço atual, data do preço atual e anexa o último preço e data do último preço para update
            ...precosEPromosUpdate,
            precoAtual: item.precoAtual,
            dataPrecoAtual: new Date(item.dataPrecoAtual),
            ultimoPreco: docData.precoAtual,
            dataUltimoPreco: docData.dataPrecoAtual.toDate()
        }
    }
    return precosEPromosUpdate;
}
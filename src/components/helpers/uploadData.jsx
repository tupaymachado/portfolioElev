import { db } from '../firebaseConfig.jsx';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { verificaEtiquetasPreco, verificaEtiquetasPromo } from './gerarEtiquetas';

function handlePrecos(precos, setPrecos) {
    setPrecos(precos);
}

function handlePromos(promos, setPromos) {
    setPromos(promos);
}

function handleForaPromos(foraPromos, setForaPromos) {
    setForaPromos(foraPromos);
}

export async function updateData(jsonData, setPrecos, setPromos, setForaPromos, setProgress, data) { //aproveita o loop para já separar a intersecção entre jsonData e dadosDB
    const portfolioRef = collection(db, 'portfolio');
    let dataUltimaAtualizacao = await getDoc(doc(portfolioRef, 'dataAtualizacao'));
    if (!dataUltimaAtualizacao.exists() || dataUltimaAtualizacao.data().data.toMillis() <= data.getTime()) { //
        console.log('relatório mais novo ou não existe')
        let counter = 0;
        await setDoc(doc(portfolioRef, 'dataAtualizacao'), { data: data }, { merge: true });
        for (const item of jsonData) {
            counter++;
            const codigo = item.codigo;
            const docRef = doc(portfolioRef, codigo);
            const docSnapshot = await getDoc(docRef);
            let docData;
            if (docSnapshot.exists()) {
                docData = docSnapshot.data();
                if (docData.descricao && data >= new Date('2023-10-03')) {
                    await updateDoc(docRef, precoEPromo(docData, item)); //se o item já tiver sido gravado a partir do relatório, apenas atualiza os preços e promoções
                } else {
                    await updateDoc(docRef, item); //se o item tiver sido gravado apenas a partir do CSV, atualiza com todos os dados do relatório
                }
                if (docData.localizacao && item.dataPrecoAtual) {
                    verificaEtiquetasPreco(docData, item, setPrecos);
                    verificaEtiquetasPromo(docData, item, setPromos, setForaPromos);
                }
            } else {
                await setDoc(docRef, item); //se o item não existir no DB, grava todos os dados do relatório
            }
            setProgress(((counter / jsonData.length) * 100).toFixed(2));
        }
        console.log('Dados atualizados com sucesso!');
    } else {
        alert('O relatório selecionado é mais antigo que o último relatório carregado.')
    }
};

export function precoEPromo(docData, item) { //executado apenas em escritas subsequentes de cada item
    let precosEPromosUpdate = {};
    //update preço de promoção
    if (!docData.promocao || item.promocao === false || item.precoPromocao !== docData.precoPromocao) { //se preço promoção for diferente de 0 e diferente do preço atual no DB
        precosEPromosUpdate = {
            promocao: item.promocao,
            precoPromocao: item.precoPromocao,
            dataPromocao: item.dataPromocao
        }
    }
    if (!docData.precoAtual) {
        precosEPromosUpdate = {
            ...precosEPromosUpdate,
            precoAtual: item.precoAtual,
            dataPrecoAtual: item.dataPrecoAtual,
            ultimoPreco: item.precoAtual,
            dataUltimoPreco: item.dataPrecoAtual
        }
    } else if (item.precoAtual > 0 && item.precoAtual !== docData.precoAtual) { //se preço varejo for diferente de 0 e diferente do preço atual no DB
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
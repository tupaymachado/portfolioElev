import { db } from '../firebaseConfig.jsx';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { realtime, ref, set, get } from '../firebaseConfig.jsx';
import { verificaEtiquetasPreco, verificaEtiquetasPromo } from './gerarEtiquetas';

export async function updateData(user, jsonData, setPrecos, setPromos, setForaPromos, setProgress, data) { //aproveita o loop para já separar a intersecção entre jsonData e dadosDB
    const portfolioRef = collection(db, 'portfolio');
    const dataAttRef = ref(realtime, 'dataAtt');
    const dataUltimaAtualizacaoSnapshot = await get(dataAttRef);
    const dataUltimaAtualizacaoVal = dataUltimaAtualizacaoSnapshot.val();
    const dataUltimaAtualizacao = new Date(dataUltimaAtualizacaoVal);
    if (dataUltimaAtualizacao.getTime() <= data.getTime()) {
        let counter = 0;
        console.log(data)
        await set(dataAttRef, data.getTime());
        for (const item of jsonData) {
            counter++;
            const codigo = item.codigo;
            const docRef = doc(portfolioRef, codigo);
            const docSnapshot = await getDoc(docRef);
            let docData;
            if (docSnapshot.exists()) {
                docData = docSnapshot.data(); //inserir verificação de erro para users isAdmin = false                
                if (docData.descricao && data >= new Date('2023-10-03') && user.isAdmin === true) {
                    await updateDoc(docRef, precoEPromo(docData, item)); //se o item já tiver sido gravado a partir do relatório, apenas atualiza os preços e promoções
                } else if (user.isAdmin === true) {
                    await updateDoc(docRef, item); //se o item tiver sido gravado apenas a partir do CSV, atualiza com todos os dados do relatório
                }
                if (docData.localizacao?.[user.filial] && item.dataPrecoAtual) {
                    console.log(docData.localizacao[user.filial])
                    verificaEtiquetasPreco(user, docData, item, setPrecos);
                    verificaEtiquetasPromo(user, docData, item, setPromos, setForaPromos);
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

    if (!docData.promocao) {
        precosEPromosUpdate = {
            promocao: item.promocao,
            precoPromocao: item.precoPromocao,
            dataPromocao: item.dataPromocao,
            ultimoPrecoPromocao: 0,
        }
    } else if (
        item.promocaoStatus === false || //caso o status indique saída de promoção
        item.promocaoStatus === true && item.promocao === true //caso o status indique promoção e o preço promocao seja > 0
    ) {
        precosEPromosUpdate = {
            promocao: item.promocao,
            precoPromocao: item.precoPromocao,
            dataPromocao: item.dataPromocao,
            ultimoPrecoPromocao: docData.precoPromocao,
        }
    };
    if (!docData.precoAtual) { //caso não exista info sobre o preço atual, ultimoPreco === precoAtual e dataUltimoPreco === dataPrecoAtual
        precosEPromosUpdate = {
            ...precosEPromosUpdate,
            precoAtual: item.precoAtual,
            dataPrecoAtual: item.dataPrecoAtual,
            ultimoPreco: 0,
            dataUltimoPreco: item.dataPrecoAtual
        }
    } else if (item.precoAtual > 0 && item.precoAtual !== docData.precoAtual) { //se preço varejo for maior que 0 e diferente do preço atual no DB
        precosEPromosUpdate = { //atualiza o preço atual, data do preço atual e anexa o último preço e data do último preço para update
            ...precosEPromosUpdate,
            precoAtual: item.precoAtual,
            dataPrecoAtual: item.dataPrecoAtual,
            ultimoPreco: docData.precoAtual,
            dataUltimoPreco: docData.dataPrecoAtual.toDate()
        }
    }
    return precosEPromosUpdate;
}
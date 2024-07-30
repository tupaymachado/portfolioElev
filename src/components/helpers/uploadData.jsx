import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, realtime, ref, set, query, where, get, deleteDoc } from '../firebaseConfig.jsx';
import { verificaEtiquetasPreco, verificaEtiquetasPromo } from './gerarEtiquetas';

export async function updateData(user, jsonData, setPrecos, setPromos, setForaPromos, setProgress, data) { //aproveita o loop para já separar a intersecção entre jsonData e dadosDB
    console.log(jsonData[0]); //controle para ver se o relatório está sendo lido corretamente por conta de mudanças no formato
    const portfolioRef = collection(db, 'portfolio');
    const dataAttRef = ref(realtime, 'dataAtt');
    const dataUltimaAtualizacaoSnapshot = await get(dataAttRef);
    const dataUltimaAtualizacaoVal = dataUltimaAtualizacaoSnapshot.val();
    const dataUltimaAtualizacao = new Date(dataUltimaAtualizacaoVal);
    const diff = data.getTime() - dataUltimaAtualizacao.getTime();
    const diffInHours = diff / 1000 / 60 / 60;
    console.log(diffInHours);
    if (diffInHours >= -1) {
        let counter = 0;
        await set(dataAttRef, data.getTime()); //atualiza o realtime db com a data de atualização
        for (const item of jsonData) {
            counter++;
            const codigo = item.codigo;
            const docRef = doc(portfolioRef, codigo);
            const docSnapshot = await getDoc(docRef);
            let docData;
            if (docSnapshot.exists()) {
                docData = docSnapshot.data(); //inserir verificação de erro para users isAdmin = false                
                if (docData.descricao && data >= new Date('2023-10-03') && user.isAdmin === true) {
                    let updatePayload = precoEPromo(docData, item);
                    updatePayload = !docData.referencia ? { ...updatePayload, referencia: item.referencia } : updatePayload;
                    await updateDoc(docRef, updatePayload);
                } else if (user.isAdmin === true) {
                    await updateDoc(docRef, item); //se o item tiver sido gravado apenas a partir do CSV, atualiza com todos os dados do relatório
                }
                if (docData.localizacao?.[user.filial]) {
                    verificaEtiquetasPreco(user, docData, item, setPrecos);
                    verificaEtiquetasPromo(user, docData, item, setPromos, setForaPromos);
                }
            } else if (user.isAdmin === true) {
                await setDoc(docRef, item); //se o item não existir no DB, grava todos os dados do relatório
            }
            procuraRef(item);
            setProgress(((counter / jsonData.length) * 100).toFixed(2));
        }
        console.log('Dados atualizados com sucesso!');
    } else {
        alert('O relatório selecionado é mais antigo que o último relatório carregado.')
    }
};

async function procuraRef(item) {
    const searchTerm = item.referencia;
    const semCadastroRef = collection(db, 'semcadastro');
    const portfolioRef = collection(db, 'portfolio');
    const queryTerm = await query(semCadastroRef, where('referencia', '==', searchTerm));
    const docs = await getDoc(queryTerm);
    if (docs.exists()) {
        const docData = docs.data();
        const updatePayload = {...item, ...docData};
        const docRef = doc(portfolioRef, codigo);
        await updateDoc(docRef, updatePayload);
        await deleteDoc(docs.ref);
    }
}


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
        item.promocaoStatus === true && item.precoPromocao !== docData.precoPromocao //caso o status indique promoção e os preços sejam diferentes
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
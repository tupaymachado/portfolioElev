import { useState } from 'react';
import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';
import * as XLSX from 'xlsx';

export function XlsxHandling({ onEtiquetasChange }) {

    const handleFileChange = async (event) => {
        try {
            const rows = await readFileAndConvertToJson(event);
            processarDados(rows);
        } catch (error) {
            console.error('Erro ao ler o arquivo:', error);
        }
    };

    const readFileAndConvertToJson = (event) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                let rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                resolve(rows);
            };
            reader.onerror = reject;
            reader.readAsBinaryString(event.target.files[0]);
        });
    };

    const processarDados = (rows) => {
        if (rows[0][0] !== '10449 - Preços Alterados nas últimas 24 horas II') { //verifica se o arquivo é o correto
            alert('Arquivo inválido. Selecione o arquivo correto.');
            return;
        }
        let data = formatarData(rows[4][6]); //data da atualização, serve para preços e promoções
        rows = rows.slice(7);
        let marca = '';
        const newJsonData = [];
        for (let row of rows) {
            if (row.length === 1) {
                break;
            }
            if (row[0] === 'Marca/Fabricante') {
                marca = row[3];
                continue;
            }
            let piso = row[2].split(' ')[0] === 'PISO' ? true : false;
            let formatoRegex = /(\d+,\d+|\d+)X(\d+,\d+|\d+)/;
            let formatoMatch = row[2].match(formatoRegex);
            let formato = formatoMatch ? formatoMatch[0] : false;
            let obj = {
                codigo: row[1].toString(),
                descricao: row[2],
                formato: formato,
                marca: marca,
                ultimoPreco: Number(row[7]),
                dataUltimoPreco: data,
                precoAtual: Number(row[7]),
                dataPrecoAtual: data,
                categoria: piso ? categoria(row[2]) : 'não definido',
                promocao: promocao(row[11]),
                precoPromocao: promocao ? Number(row[8]) : false,
                dataPromocao: data
            };
            newJsonData.push(obj);
        }
        //setJsonData(newJsonData); // Atualizando o estado aqui
        verificarRepetidos(newJsonData);
    };

    const formatarData = (dataString) => {
        const [data, hora] = dataString.split(' ');
        const [dia, mes, ano] = data.split('/');
        const [horas, minutos, segundos] = hora.split(':');
        const dataFormatada = new Date(`${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`);
        return dataFormatada;
    };

    const categoria = (descricao) => {
        const termos = [
            { regex: /\b(ac|act|acet|acetinado)\b/gi, valor: 'Acetinado' },
            { regex: /\b(pol|lux|polido)\b/gi, valor: 'Polido' },
            { regex: /\b(nat|natural)\b/gi, valor: 'Natural' },
            { regex: /\b(rustico|hard|ext|externo|abs)\b/gi, valor: 'Externo' }
        ];
        const matches = termos.filter(termo => termo.regex.test(descricao));
        if (matches.length > 1) {
            return 'Erro: mais de um padrão correspondente encontrado';
        } else if (matches.length === 1) {
            return matches[0].valor;
        } else {
            return 'Não identificado';
        }
    };

    const promocao = (status) => {
        if (status === 'REMOVER ETQ' || status === 'ENCERRADO PROMO') {
            return false;
        } else if (status === 'PRORROGADO PROMO' || status === 'EM PROMO') {
            return true;
        } else {
            return 'Sem mudança';
        }
    };

    const verificarRepetidos = (jsonData) => {
        let mapa = {};
        let duplicados = {};
        // Primeiro, identifique todos os itens duplicados
        for (let i = 0; i < jsonData.length; i++) {
            if (mapa[jsonData[i].codigo]) {
                duplicados[jsonData[i].codigo] = true;
            } else {
                mapa[jsonData[i].codigo] = true;
            }
        }
        // Em seguida, filtre o array original para remover os itens duplicados
        jsonData = jsonData.filter(item => !duplicados[item.codigo]);
        //se duplicados contiver algum item, gerar um alert() com os itens duplicados
        if (Object.keys(duplicados).length > 0) {
            alert('Os seguintes itens estão duplicados e foram excluídos da atualização. Confira os dados pelo CISS e adicione manualmente: ' + Object.keys(duplicados).join(', '));
        }
        //setJsonData(jsonData); // Atualizando o estado aqui
        updateData(jsonData);
    };

    const updateData = async (jsonData) => { //aproveita o loop para já separar a intersecção entre jsonData e dadosDB
        const portfolioRef = collection(db, 'portfolio');
        const newIntersec = [];
        for (const item of jsonData) {
            const codigo = item.codigo;
            const docRef = doc(portfolioRef, codigo);
            const docSnapshot = await getDoc(docRef);
            let docData;
            if (docSnapshot.exists()) {
                docData = docSnapshot.data();
                if (docData.descricao) { 
                    await updateDoc(docRef, precoEPromo(docData, item));
                } else {
                    await updateDoc(docRef, item);
                }
            } else {
                await setDoc(docRef, item);
            }
            if (docData && docData.expositor && docData.codigo == item.codigo) { 
                console.log(docData.expositor)
                const combinedObject = { ...item, ...docData };
                newIntersec.push(combinedObject);
            }
        }
        onEtiquetasChange(newIntersec);
        console.log('Dados atualizados com sucesso!');
    };

    function precoEPromo(docData, item) { //executado apenas em escritas subsequentes de cada item
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

    return (
        <>  <h1>Inserir Relatório '10449 - Preços Alterados nas Últimas 24 horas II' em formato .xls</h1>
            <input type="file" id="fileInput" onChange={handleFileChange} />
        </>
    );
}
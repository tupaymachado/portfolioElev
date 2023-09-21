import React, { useState } from 'react';
import { db, collection, doc, getDoc, setDoc, updateDoc } from './firebaseConfig.jsx';
import * as XLSX from 'xlsx';
import { set } from 'react-hook-form';

export function XlsxHandling() {
    const [etiquetas, setEtiquetas] = useState([]);

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
        if (rows[0][0] !== '10449 - Preços Alterados nas últimas 24 horas II') {
            alert('Arquivo inválido. Selecione o arquivo correto.');
            return;
        }
        let data = formatarData(rows[4][6]);
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
                ultimoPreco: row[7],
                dataUltimoPreco: data,
                precoAtual: row[7],
                dataPrecoAtual: data,
                categoria: piso ? categoria(row[2]) : 'não definido',
                promocao: promocao(row[11]),
                precoPromocao: promocao ? row[8] : false,
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


    const updateData = async (jsonData) => {
        const portfolioRef = collection(db, 'portfolio');
        for (const item of jsonData) {
            const codigo = item.codigo;
            const docRef = doc(portfolioRef, codigo);
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) { //primeira escrita, item não existe no DB - escreve item tal como veio no RELATÓRIO (snapshot.exists() == false)
                await setDoc(docRef, item);
            } else if (docSnapshot.descricao) { //se snapshot.exists() == true e docSnapshot.descricao existir, já recebeu uma escrita do RELATÓRIO
                precosUpdate(docSnapshot, item);
            } else { //se docSnapshot existir, mas não tiver descrição, já recebeu uma escrita do CSV
                await updateDoc(docRef, item); //atualiza o DB com dados do relatório
            }
        }
        console.log('Dados atualizados com sucesso!');
    };

    function precosUpdate(docSnapshot, item) { //executado apenas em escritas subsequentes de cada item
        const docData = docSnapshot.data();
        const dataPromocaoItem = new Date(item.dataPromocao);
        const dataPromocaoDB = docData.dataPromocao.toDate();
        let updateData = {};
        if (dataPromocaoItem > dataPromocaoDB) {
            updateData = {
                promocao: item.promocao,
                precoPromocao: item.precoPromocao,
                dataPromocao: dataPromocaoItem
            }
        } else {
            alert('Você anexou um arquivo antigo. Os dados de preços e promoções no banco de dados são mais recentes que os do relatório anexado. Os dados de preços e promoções não irão gerar etiquetas, e apenas novos produtos serão cadastrados no Banco.')
        }
        if (item.precoAtual !== 0 && item.precoAtual !== docData.precoAtual) { //se preço varejo for diferente de 0 e diferente do preço no DB
            updateData = { //atualiza o preço atual, data do preço atual e anexa o último preço e data do último preço para update
                ...updateData,
                precoAtual: item.precoAtual,
                dataPrecoAtual: new Date(item.dataPrecoAtual),
                ultimoPreco: docData.precoAtual,
                dataUltimoPreco: new Date(docData.dataPrecoAtual)            
            }
            if ((item.precoAtual - docData.precoAtual) > 0.1) { //se o preço atual for maior que o último preço em mais de 10 centavos, também emite etiqueta
                setEtiquetas([...etiquetas, item]);
            }
        }
        console.log(etiquetas);
        return updateData;
    }
    
    return (
        <input type="file" id="fileInput" onChange={handleFileChange} />
    );
};
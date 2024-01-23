import * as XLSX from 'xlsx';
import { updateData } from './uploadData.jsx';

export function readFileAndConvertToJson(event) {
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

export function processarDados(user, rows, setPrecos, setPromos, setForaPromos, setProgress) {    
    setPromos([]);
    setForaPromos([]);
    setPrecos([]);
    setProgress(0);
    if (rows[0][0] !== '10449 - Preços Alterados nas últimas 24 horas II') { //verifica se o arquivo é o correto
        alert('Arquivo inválido. Selecione o arquivo correto.');
        return;
    }
    console.log(rows[4][7])
    let data = formatarData(rows[4][7]); //data da atualização, serve para preços e promoções
    rows = rows.slice(7);
    let marca = '';
    const jsonData = [];
    for (let row of rows) {
        if (row.length <= 1) {
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
            acabamento: piso ? categoria(row[2]) : 'não definido',
            promocaoStatus: promocao(row[10])
        };        
        if (data >= new Date('2023-10-03')) {
            obj.ultimoPreco = 0;
            obj.dataUltimoPreco = data;
            obj.precoAtual = Number(row[6]);
            obj.dataPrecoAtual = data;
            obj.precoPromocao = Number(row[8]);
            obj.promocao = Number(row[8]) ? true : false;
            obj.dataPromocao = data;
        }
        jsonData.push(obj);
    }
    //setJsonData(newJsonData); // Atualizando o estado aqui
    verificarRepetidos(user, jsonData, setPrecos, setPromos, setForaPromos, setProgress, data);
};

export function promocao(status) {
    if (status === 'REMOVER ETQ' || status === 'ENCERRADO PROMO') {
        return false; //preço promo sempre === 0
    } else if (status === 'PRORROGADO PROMO' || status === 'EM PROMO') {
        return true; //pode ter preço promoção === 0 ou > 0
    } else {
        return 'Sem mudança'; //sempre sai com preço === 0
    }
};

export function formatarData(dataString) {
    console.log(dataString)
    const [data, hora] = dataString.split(' ');
    const [dia, mes, ano] = data.split('/');
    const [horas, minutos, segundos] = hora.split(':');
    const dataFormatada = new Date(`${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`);
    return dataFormatada;
};

export function categoria(descricao) {
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

export function verificarRepetidos(user, jsonData, setPrecos, setPromos, setForaPromos, setProgress, data) {
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
    updateData(user, jsonData, setPrecos, setPromos, setForaPromos, setProgress, data);
};
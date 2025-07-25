import xlsx from 'xlsx'
import fs from 'fs'

export default function xlsxToJson() {
    
}
// Carrega o arquivo Excel
const workbook = xlsx.readFile('arquivo.xlsx');

// Pega o nome da primeira aba
const sheetName = workbook.SheetNames[0];

// Converte os dados da aba para JSON
const worksheet = workbook.Sheets[sheetName];
const jsonData = xlsx.utils.sheet_to_json(worksheet);

// Salva em arquivo JSON
fs.writeFileSync('saida.json', JSON.stringify(jsonData, null, 2));

console.log('Conversão concluída! JSON salvo em "saida.json"');

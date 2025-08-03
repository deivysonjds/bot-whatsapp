
export default function excelToJson(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    let data_array = []
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converte para JSON
        let data_json = XLSX.utils.sheet_to_json(worksheet);
        let dataTableBody = document.querySelector('#data-table tbody');
        
        for (const client of data_json) {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.nome}</td>
                <td>${client.numero}</td>
                <td></td>
            `;
            data_array.push(client)
            dataTableBody.appendChild(row);

        }
    };

    reader.readAsArrayBuffer(file);
    return data_array;
}

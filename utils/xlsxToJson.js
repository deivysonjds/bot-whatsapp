export default function excelToJson(e, data) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converte para JSON
        data = XLSX.utils.sheet_to_json(worksheet);
        let dataTableBody = document.querySelector('#data-table tbody');

        for (const client of data) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.name}</td>
                <td>${client.email}</td>
            `;
            dataTableBody.appendChild(row);

        }
    };

    reader.readAsArrayBuffer(file);
}

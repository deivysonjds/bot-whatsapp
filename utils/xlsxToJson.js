export default function excelToJson(e) {
    const file = e.target.files[0];

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                const data_json = XLSX.utils.sheet_to_json(worksheet);
                const dataTableBody = document.querySelector('#data-table tbody');

                dataTableBody.innerHTML = '';

                for (const client of data_json) {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${client.nome}</td>
                        <td>${client.numero}</td>
                        <td></td>
                    `;
                    dataTableBody.appendChild(row);
                }

                resolve(data_json);
            } catch (error) {
                reject(error); 
            }
        };

        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

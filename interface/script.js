import excelToJson from "../utils/xlsxToJson.js";

let data = [];
let interval;

window.addEventListener('DOMContentLoaded', () => {
	const status = document.getElementById('loading');
	const qrContainer = document.getElementById('qr-container');
	document.querySelector('.file-input').addEventListener('change', (e) => {
		data = excelToJson(e, data)
		document.querySelector('#start-btn').disabled = false
	});

	window.whatsappAPI.onLogged((data) => {
		console.log('Logged in:', data);
		
		interval = {
			minBreak: data.minBreak,
			maxBreak: data.maxBreak
		};

		document.querySelector('#root').classList.add('invisible');
		document.querySelector('#loading').classList.add('invisible');
		document.querySelector('.settings-section').classList.add('invisible');
		document.querySelector('.container').classList.remove('invisible');
		document.querySelector('.tabs').classList.remove('invisible');
		document.querySelector('#user-name').textContent = data.numberClient;
	});

	window.whatsappAPI.onQR((qrImage) => {
		console.log('QR Code received:');
		
		status.id = ''
		status.innerText = 'Escaneie o QR Code abaixo para iniciar';
		qrContainer.innerHTML = `<img src="${qrImage}" alt="QR Code">`;
	});
	
	window.whatsappAPI.onInactive((message) => {
		status.id = ''
		qrContainer.classList.add('invisible')
		status.innerText = message;
	});
	
	window.whatsappAPI.onError((message) => {
		status.id = ''
		qrContainer.classList.add('invisible')
		status.innerText = message;
	});
	
	window.whatsappAPI.onUnauthorized((message) => {
		status.id = ''
		qrContainer.classList.add('invisible')
		status.innerText = message;
	});

	window.whatsappAPI.iniciar();

	let btnStart = document.querySelector('#start-btn');
	btnStart.addEventListener('click', async () => {
		btnStart.disabled = true;
		let dataTableBody = document.querySelectorAll('#data-table tbody tr td:nth-child(3)');
		
		for (let index = 0; index < data.length; index++) {
			if (data[index].status) {
				continue;
			}

			let res = await window.whatsappAPI.sendMessage({
				number: JSON.stringify(data[index]),
				interval,
				text: `Olá, ${data[index].nome || 'amigo(a)'}!\n\nEsta é uma mensagem automática de teste enviada pelo bot.`
			});

			if (res.success) {
				dataTableBody[index].innerHTML = `<span class="success">✅ Enviado</span>`;
				data[index].status = 'Enviado';
				continue;
			}

			dataTableBody[index].innerHTML = `<span class="error">❌ erro </span>`;
			data[index].status = 'Erro';
		}
		window.alert('Mensagens enviadas!');
		btnStart.disabled = false;
	})

	document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', (event) => {
        toggleTab(event);
    });
	});

});

function toggleTab(event) {
// Previne o comportamento padrão de links
event.preventDefault();

// Remove a classe 'active' de todas as abas
document.querySelectorAll('.tab').forEach(tab => {
	tab.classList.remove('active');
});

// Adiciona 'active' na aba clicada
event.target.classList.add('active');

// Alterna entre os conteúdos
if (event.target.textContent === 'Configurações') {
	document.querySelector('.settings-section').classList.remove('invisible');
	document.querySelector('.container').classList.add('invisible');
	return;
}

document.querySelector('.container').classList.remove('invisible');
document.querySelector('.settings-section').classList.add('invisible');

}

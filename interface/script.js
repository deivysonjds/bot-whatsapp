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

	window.whatsappAPI.onLogged((e) => {
		interval = {
			minBreak: e.minBreak,
			maxBreak: e.maxBreak
		};

		document.querySelector('#root').classList.add('invisible');
		document.querySelector('.settings-section').classList.add('invisible');
		document.querySelector('.container').classList.remove('invisible');
		document.querySelector('.tabs').classList.remove('invisible');
		document.querySelector('#user-name').textContent = e.numberClient;
	});

	window.whatsappAPI.onQR((qrImage) => {
		status.id = ''
		status.innerText = 'Escaneie o QR Code abaixo para iniciar';
		qrContainer.innerHTML = `<img src="${qrImage}" alt="QR Code">`;
	});

	window.whatsappAPI.onInactive((message) => {
		qrContainer.classList.add('invisible')
		status.id = ''
		status.innerText = message;
	});

	window.whatsappAPI.onError((message) => {
		qrContainer.classList.add('invisible')
		status.id = ''
		status.innerText = message;
	});

	window.whatsappAPI.onUnauthorized((message) => {
		qrContainer.classList.add('invisible')
		status.id = ''
		status.innerText = message;
	});

	window.whatsappAPI.iniciar();

	let btnStart = document.querySelector('#start-btn');
	btnStart.addEventListener('click', () => {

		window.whatsappAPI.sendMessages({
			data: JSON.stringify(data),
			interval
		});
	})
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

import excelToJson from "../utils/xlsxToJson.js";

let data = [];
let interval;
let stopSendMessages = false

window.addEventListener('DOMContentLoaded', () => {
	const status = document.getElementById('loading');
	const qrContainer = document.getElementById('qr-container');
	document.querySelector('.file-input').addEventListener('change', (e) => {
		data = excelToJson(e, data)
		document.querySelector('#start-btn').disabled = false
	});

	window.whatsappAPI.onLogged((data) => {
		
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
		
		status.id = ''
		status.innerText = 'Escaneie o QR Code abaixo para iniciar';
		qrContainer.innerHTML = `<img src="${qrImage}" alt="QR Code">`;
	});
	
	window.whatsappAPI.onError((message) => {
		status.id = ''
		qrContainer.classList.add('invisible')
		status.innerText = message;
	});

	window.whatsappAPI.iniciar();

	let btnStop = document.querySelector('#stop-btn')
	let btnStart = document.querySelector('#start-btn');

	btnStart.addEventListener('click', async () => {
		btnStart.disabled = true;
		btnStop.disabled = false;
		let dataTableBody = document.querySelectorAll('#data-table tbody tr td:nth-child(3)');
		let amountMessages = 0;
		stopSendMessages = false

		for (let index = 0; index < data.length; index++) {
			if (data[index].status) {
				continue;
			}

			if (stopSendMessages) {
				break
			}

			let res = await window.whatsappAPI.sendMessage({
				number: JSON.stringify(data[index]),
				interval,
				text: `Olá, ${data[index].nome || 'amigo(a)'}!\n\nEsta é uma mensagem automática de teste enviada pelo bot.`
			});

			if (res.success) {
				dataTableBody[index].innerHTML = `<span class="success">✅ Enviado</span>`;
				data[index].status = 'Enviado';
				amountMessages++
				continue;
			}

			dataTableBody[index].innerHTML = `<span class="error">❌ erro </span>`;
			data[index].status = 'Erro';
		}
		if (amountMessages > 0) {
			window.whatsappAPI.postAmountMessages(amountMessages)
		}

		window.alert(`${amountMessages} mensagens enviadas!`);
		btnStart.disabled = false;
		btnStop.disabled = true
	})

	document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', (event) => {
        toggleTab(event);
    });
	});

	btnStop.addEventListener('click', ()=>{
		stopSendMessages = true
		window.alert('interrompendo envio de mensagens...')
	})

});

function toggleTab(event) {
event.preventDefault();

document.querySelectorAll('.tab').forEach(tab => {
	tab.classList.remove('active');
});

event.target.classList.add('active');

if (event.target.textContent === 'Configurações') {
	document.querySelector('.settings-section').classList.remove('invisible');
	document.querySelector('.container').classList.add('invisible');
	return;
}

document.querySelector('.container').classList.remove('invisible');
document.querySelector('.settings-section').classList.add('invisible');

}

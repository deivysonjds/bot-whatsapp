import excelToJson from "../utils/xlsxToJson.js";

let data = [];
let interval;
let stopSendMessages = false

window.addEventListener('DOMContentLoaded', () => {
	let progressFill = document.querySelector('.progress-fill')
	let progressText = document.querySelector('.progress-text')
	let sentCount = document.querySelector('#sent-count')
	const status = document.getElementById('text');
	const qrContainer = document.getElementById('qr-container');

	document.querySelector('.file-input').addEventListener('change', async (e) => {
		data = await excelToJson(e, data)
		document.querySelector('#data-count').textContent = `(${data.length} registros)`
		document.querySelector('#total-count').textContent = `${data.length}`
		progressFill.style.width = '0%'
		progressText.textContent = '0% concluído'
		sentCount.textContent = '0'
		document.querySelector('#start-btn').disabled = false
	});

	window.whatsappAPI.onLoading((data)=>{
		status.textContent = data
	})

	window.whatsappAPI.onLogged((data) => {
		
		interval = {
			minBreak: data.minBreak,
			maxBreak: data.maxBreak
		};

		status.textContent = ''
		document.querySelector('#root').classList.add('invisible');
		document.querySelector('.settings-section').classList.add('invisible');
		document.querySelector('.container').classList.remove('invisible');
		document.querySelector('.tabs').classList.remove('invisible');
		document.querySelector('#user-name').textContent = data.numberClient;

		document.querySelector("#minBreak").value = interval.minBreak
		document.querySelector("#maxBreak").value = interval.maxBreak
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
		let progress = 0;
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
			
			progress = ((index+1)/data.length*100).toFixed(2)
			progressFill.style.width = `${progress}%`
			progressText.innerHTML = `${progress}% concluído`

			if (res.success) {
				dataTableBody[index].innerHTML = `<span class="success">✅ Enviado</span>`;
				data[index].status = 'Enviado';
				amountMessages++
				sentCount.textContent = amountMessages
				continue;
			}
			console.log(res.error);
			
			dataTableBody[index].innerHTML = `<span><i title="${res.error}"><img class="errorIcon" src="../assets/iconExc.png" alt="erro"></i>Erro</span>`;
			data[index].status = res.error;
		}
		if (amountMessages > 0) {
			window.b4a.postAmountMessages(amountMessages)
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

	let btnSaveChanges = document.querySelector('#saveChanges')
	btnSaveChanges.addEventListener('click', async ()=>{
		let elementMinBreak = document.querySelector('#minBreak');
		let minBreak = elementMinBreak.value

		let elementMaxBreak = document.querySelector('#maxBreak');
		let maxBreak = elementMaxBreak.value
		
		let res = await window.b4a.putConfigData({
			minBreak: Number(minBreak),
			maxBreak: Number(maxBreak)
		})


		if(!res.success){
			window.alert(`Erro: ${res.error}`)
			return
		}
		
		interval.minBreak = minBreak
		interval.maxBreak = maxBreak
		window.alert('Dados salvos!')
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

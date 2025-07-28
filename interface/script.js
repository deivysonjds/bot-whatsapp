import excelToJson from "../utils/xlsxToJson.js";

const data = [];

window.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('loading');
  const qrContainer = document.getElementById('qr-container');
  
  window.whatsappAPI.onLogged((data) => {
    document.querySelector('#root').classList.add('invisible');
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

document.getElementById('file-input').addEventListener('change', (e)=>{
  excelToJson(e, data)
});
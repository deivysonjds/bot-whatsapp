window.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('loading');
  const qrContainer = document.getElementById('qr-container');
  const root = document.getElementById('root');

  window.whatsappAPI.onLogged((data) => {
    status.remove()
    qrContainer.remove()

    let {minBreak, maxBreak, numberClient} = data;

    let header = document.createElement('header');
    header.innerHTML = `
      <span>Número: ${numberClient}</span>
      <span>Min Intervalo: ${minBreak}</span>
      <span>Max Intervalo: ${maxBreak}</span>
    `;
    root.appendChild(header);
  });

  window.whatsappAPI.onQR((qrImage) => {
    status.id = ''
    status.innerText = 'Escaneie o QR Code abaixo para iniciar';
    qrContainer.innerHTML = `<img src="${qrImage}" alt="QR Code">`;
  });

  window.whatsappAPI.onInactive((message) => {
    status.id = ''
    status.innerText = message;
  });

  window.whatsappAPI.onError((message) => {
    status.id = ''
    status.innerText = message;
  });

  window.whatsappAPI.onUnauthorized((message) => {
    status.id = ''
    status.innerText = message;
  });

  window.whatsappAPI.iniciar();
});

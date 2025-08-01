const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('whatsappAPI', {
  iniciar: () => ipcRenderer.send('iniciar-whatsapp'),
  sendMessage: (data) => ipcRenderer.send('sendMessage', data),
  onQR: (callback) => ipcRenderer.on('qr', (_, data) => callback(data)),
  onLogged: (callback) => ipcRenderer.on('logged', (_, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('error', (_, data) => callback(data)),
  onUnauthorized: (callback) => ipcRenderer.on('unauthorized', (_, data) => callback(data)),
  onInactive: (callback) => ipcRenderer.on('inactive', (_, data) => callback(data)),
});


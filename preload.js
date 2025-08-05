const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('whatsappAPI', {
  iniciar: () => ipcRenderer.send('iniciar-whatsapp'),
  sendMessage: (data) => ipcRenderer.invoke('sendMessage', data),
  onQR: (callback) => ipcRenderer.on('qr', (_, data) => callback(data)),
  onLogged: (callback) => ipcRenderer.on('logged', (_, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('error', (_, data) => callback(data))
});

contextBridge.exposeInMainWorld('b4a', {
  postAmountMessages: (data) => ipcRenderer.send('postAmountMessages', data),
  putConfigData: (data) => ipcRenderer.invoke('putConfigData', data),
})


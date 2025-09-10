import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let splash;
let client;

import whatsappConnection from './utils/whatsappConection.js';
import sendMessages from './utils/sendMessages.js';
import postAmountMessages from './requests/postAmountMessages.js';
import putConfigData from './requests/putConfigData.js';

app.whenReady().then(() => {
  // Splash
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });
  splash.loadFile(join(__dirname, './interface/splash.html'));


  // Principal
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile(join(__dirname, './interface/index.html'));
  // mainWindow.webContents.openDevTools()

  // mostrar janela assim que carregar
  mainWindow.webContents.on('did-finish-load', () => {
    if (splash) splash.close();
    mainWindow.show();
  });

  // IPCs
  ipcMain.on('iniciar-whatsapp', async () => {
    
    client = await whatsappConnection(mainWindow);
  });

  ipcMain.handle('sendMessage', async (e, { number, interval, text }) => {
    try {
      await sendMessages(client, number, interval, text);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.on('postAmountMessages', async (e, amountMessages) => {
    
    await postAmountMessages(amountMessages);
  });

  ipcMain.handle('putConfigData', async (e, data) => {
  
    try {
      await putConfigData(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    client.destroy()
    app.quit()
  };
});

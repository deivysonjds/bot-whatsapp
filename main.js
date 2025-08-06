import { app, BrowserWindow, ipcMain } from 'electron';
import whatsappConnection from './utils/whatsappConection.js';
import sendMessage from './utils/sendMessages.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// env
import dotenv from 'dotenv';
import postAmountMessages from './requests/postAmountMessages.js';
import putConfigData from './requests/putConfigData.js';
dotenv.config();

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile('./interface/index.html');

  mainWindow.webContents.openDevTools();
  let client;

  ipcMain.on('iniciar-whatsapp', async () => {
    client = await whatsappConnection(mainWindow);
  });

  ipcMain.handle('sendMessage', async (e, { number, interval, text }) => {

    try {
      await sendMessage(
        client,
        number,
        interval,
        text
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.on('postAmountMessages', async (e,amountMessages)=>{
    await postAmountMessages(amountMessages)
  })

  ipcMain.handle('putConfigData', async (e,data)=>{
    try {
      await putConfigData(data)
      return {success: true}
    } catch (error) {
      return {success: false, error: error.message}
    }
  })

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

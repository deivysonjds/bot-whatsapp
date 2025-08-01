import { app, BrowserWindow, ipcMain } from 'electron';
import whatsappConnection from './utils/whatsappConection.js';
import sendMessage from './utils/sendMessages.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// env
import dotenv from 'dotenv';
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

  // mainWindow.webContents.openDevTools();
  let client;

  ipcMain.on('iniciar-whatsapp', async () => {
    client = await whatsappConnection(mainWindow);
  });

  ipcMain.on('sendMessage', async (e, { number, interval, text }) => {
    
    await sendMessage(
      client,
      number,
      interval,
      text
    );
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

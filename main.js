import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import whatsappConnection from './utils/whatsappConection.js';
import sendMessages from './utils/sendMessages.js';

// env
import dotenv from 'dotenv';
dotenv.config();

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(process.cwd(), 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile('./interface/index.html');

  mainWindow.webContents.openDevTools();
  let client;

  ipcMain.on('iniciar-whatsapp', () => {
    client = whatsappConnection(mainWindow);
  });

  ipcMain.on('sendMessages', async (e, { data, interval }) => {

    await sendMessages(
      client,
      data,
      interval
    );
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

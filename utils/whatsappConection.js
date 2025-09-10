import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { app, webContents } from 'electron';
import qrcode from 'qrcode';
import path from 'path';
import getConfigData from '../requests/getConfigData.js';
import log from 'electron-log';

export default async function whatsappConnection(mainWindow) {
  await app.whenReady();

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: path.join(app.getPath('userData'), 'wweb-session')
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox']
    }
  });

  // ========= Eventos de debug =========
  client.on('qr', async (qr) => {
    const qrImage = await qrcode.toDataURL(qr);
    // console.log("📲 QR code gerado, escaneie com o celular.");
    mainWindow.webContents.send('qr', qrImage);
  });

  client.on('auth_failure', (msg) => {
    log.error("❌ Falha na autenticação:", msg);
    mainWindow.webContents.send("❌ Falha na autenticação:")
  });

  client.on('loading_screen', (percent, message) => {
    mainWindow.webContents.send('loading', `⌛ Carregando: ${percent}%`)
  });

  client.on('error', (err) => {
    log.error(

    )
    mainWindow.webContents.send("error", 'erro do whatsapp-web.js')
    return;
  });

  // ========= Evento principal =========
  client.on('ready', async () => {

	let response;
	try {
	  response = await getConfigData();
	} catch (error) {
	  log.error('Erro ao obter dados de configuração:', error);
	  mainWindow.webContents.send('error', '❌ Erro ao obter dados de configuração');
	  return;
	}

	if (!response?.isActive) {
	  mainWindow.webContents.send('error', '❌ O bot está desativado!');
	  return;
	}

	if (response.numberClient !== client.info.wid.user) {
	  mainWindow.webContents.send(
		'error',
		`❌ O número configurado (${response.numberClient}) não corresponde ao conectado (${client.info.wid.user})`
	  );
	  return;
	}

	mainWindow.webContents.send('logged', response);
//   const clientReady = new Promise((resolve) => {
//       resolve(client);
//     });
  });

  try {
    client.initialize();
  } catch (err) {
    log.error('erro ao iniciar whatsapp', err)
  }

  return client;
}

import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { app } from 'electron';
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

	client.on('qr', async (qr) => {
		const qrImage = await qrcode.toDataURL(qr);
		mainWindow.webContents.send('qr', qrImage);
	});

	client.on('error', (err) => {
		console.error('[Erro WhatsApp]', err);
	});

	const clienReady = new Promise((resolve) => {
		client.on('ready', async () => {
			let response;
			try {
				response = await getConfigData()
			} catch (error) {
				log.error('Erro ao obter dados de configuração:', error);
			}
			if (!response) {
				mainWindow.webContents.send('error', '❌ Erro ao obter dados de configuração');
				return;
			}

			if (!response.isActive) {
				mainWindow.webContents.send('error', '❌ O bot está desativado!');
				return;
			}

			if (response.numberClient !== client.info.wid.user) {
				mainWindow.webContents.send('error', `❌ O número do cliente não corresponde ao número configurado: ${response.numberClient}`);
				return;
			}

			mainWindow.webContents.send('logged', response);
			resolve(client)
		});
	});

	client.initialize();
	return clienReady
}

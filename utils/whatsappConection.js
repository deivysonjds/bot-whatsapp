import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode';
import getConfigData from '../requests/getConfigData.js';

export default function whatsappConnection(mainWindow) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "sessionId" })
  });

  client.on('qr', async (qr) => {
    const qrImage = await qrcode.toDataURL(qr);
    mainWindow.webContents.send('qr', qrImage);
  });

  client.on('ready', async () => {
    let response = await getConfigData()
    
    if (!response) {
      mainWindow.webContents.send('error', '❌ Erro ao obter dados de configuração');
      return;
    }

    if (!response.isActive){
        mainWindow.webContents.send('inactive', '❌ O bot está desativado!');
        return;
    }

    if (response.numberClient !== client.info.wid.user) {
      mainWindow.webContents.send('unauthorized', `❌ O número do cliente não corresponde ao número configurado: ${response.numberClient}`);
      return;
    }

    mainWindow.webContents.send('logged',  response);
  });

  client.initialize();
  return client
}

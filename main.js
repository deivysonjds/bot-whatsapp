import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal'
import fs from 'fs'

// env
import dotenv from 'dotenv';
dotenv.config();

// utils
import sendMessages from './utils/sendMessages.js'

// requests
import getConfigData from './requests/getConfigData.js';

const client = new Client({
    authStrategy: new LocalAuth({clientId: "sessionId"})
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Client is ready!');
    let response = await getConfigData();

    if (!response.isActive) {
        console.log('Bot desativado!');
        process.exit(1);
    }

    if(response.numberClient !== client.info.wid.user) {
        console.log(`Número do cliente não corresponde ao número do bot: ${response.numberClient}`);
        process.exit(1);
    }

    sendMessages(
        client, 
        JSON.parse(fs.readFileSync('./listNumbers.json', 'utf-8')),
        {
            min: response.minBreak,
            max: response.maxBreak
        }
    )
});

client.initialize();
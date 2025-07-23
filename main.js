import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal'
import fs from 'fs'

// utils
import sendMessages from './utils/sendMessages.js'

const client = new Client({
    authStrategy: new LocalAuth({clientId: "sessionId"})
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    sendMessages(client, JSON.parse(fs.readFileSync('./listNumbers.json', 'utf-8')).map(item => `${item.number}@c.us`));
});

client.initialize();
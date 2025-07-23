const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// utils
const sendMessages = require('./utils/sendMessages') ;

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
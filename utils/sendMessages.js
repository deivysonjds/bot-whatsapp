import sleep from "./sleep.js";
import log from "electron-log";

export default async function sendMessages(client, number, interval, text) {
    number = JSON.parse(number);
    try {
        const isRegistered = await client.isRegisteredUser(`${number.numero}@c.us`);
        if (!isRegistered) {
            throw new Error(`Número não está registrado no WhatsApp.`);
        }

        // await client.sendMessage(`${number.numero}@c.us`, text);
        let seconds = Math.floor(Math.random() * (interval.maxBreak - interval.minBreak) + interval.minBreak);

        await sleep(seconds * 1000);
    } catch (error) {
        throw new Error(`Erro ao enviar mensagem para ${number.numero}: ${error.message}`);
    }

};

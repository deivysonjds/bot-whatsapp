import sleep from "./sleep.js";
import getRandomInt from "./getRandomInt.js";
import log from "electron-log";

export default async function sendMessages(client, number, interval, text) {
    number = JSON.parse(number);
    try {
        const isRegistered = await client.isRegisteredUser(`${number.numero}@c.us`);
        if (!isRegistered) {
            log.warn(`⚠️ Número ${number.numero} não está registrado no WhatsApp.`);
            return;
        }

        await client.sendMessage(`${number.numero}@c.us`, text);
        let seconds = getRandomInt(interval.minBreak, interval.maxBreak);

        await sleep(seconds * 1000);
    } catch (error) {
        log.error(`❌ Erro ao enviar mensagem para ${number.numero}:`, error);
    }

};

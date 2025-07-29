import sleep from "./sleep.js";
import getRandomInt from "./getRandomInt.js";

export default async function sendMessages(client, numbers, interval) {
    let text = ''
    
    for (const number of JSON.parse(numbers)) {

        text = `Olá, ${number.nome || 'amigo(a)'}!\n\nEsta é uma mensagem automática de teste enviada pelo bot. \n\nFuncionalidade em teste:\n - validação de usuário logado`;
        try {
            const isRegistered = await client.isRegisteredUser(`${number.numero}@c.us`);
            if (!isRegistered) {
                console.log(`⚠️ Número ${number.numero} não está registrado no WhatsApp.`);
                continue;
            }

            await client.sendMessage(`${number.numero}@c.us`, text);
            console.log(`✅ Mensagem enviada para ${number.numero}`);
            let seconds = getRandomInt(interval.minBreak, interval.maxBreak);
            console.log(`⏳ Aguardando ${seconds} segundos antes de enviar a próxima mensagem...\n\n`);
            
            await sleep(seconds * 1000);
        } catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${number.numero}:`, error);
        }
    }

    console.log('📤 Fim do envio.');
};

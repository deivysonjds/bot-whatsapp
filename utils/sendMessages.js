import sleep from "./sleep.js";
import getRandomInt from "./getRandomInt.js";

export default async function sendMessages(client, numbers, interval) {
    let text = ''
    console.log(interval);
    
    for (const { number, name } of numbers) {
        console.log(`Verificando número: ${number}`);

        text = `Olá, ${name || 'amigo(a)'}!\n\nEsta é uma mensagem automática de teste enviada pelo bot. \n\nFuncionalidade em teste:\n - validação de usuário logado`;
        try {
            const isRegistered = await client.isRegisteredUser(number);
            if (!isRegistered) {
                console.log(`⚠️ Número ${number} não está registrado no WhatsApp.`);
                continue;
            }

            // await client.sendMessage(`${number}@c.us`, text);
            console.log(`✅ Mensagem enviada para ${number}`);
            let seconds = getRandomInt(interval.min, interval.max);
            console.log(`⏳ Aguardando ${seconds} segundos antes de enviar a próxima mensagem...\n\n`);
            
            await sleep(seconds * 1000);
        } catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${number}:`, error);
        }
    }

    console.log('📤 Fim do envio.');
    process.exit(0);
};

import sleep from "./sleep.js";
import getRandomInt from "./getRandomInt.js";

export default async function sendMessages(client, numbers) {
    const text = 'Essa é uma mensagem de teste enviada pelo bot! \n\nTeste 2: Sucesso!';

    for (const number of numbers) {
        console.log(`Verificando número: ${number}`);

        try {
            const isRegistered = await client.isRegisteredUser(number);
            if (!isRegistered) {
                console.log(`⚠️ Número ${number} não está registrado no WhatsApp.`);
                continue;
            }

            await client.sendMessage(number, text);
            console.log(`✅ Mensagem enviada para ${number}`);
            let seconds = getRandomInt(3, 5);
            console.log(`⏳ Aguardando ${seconds} segundos antes de enviar a próxima mensagem...\n\n`);
            
            await sleep(seconds * 1000);
        } catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${number}:`, error);
        }
    }

    console.log('📤 Fim do envio.');
};

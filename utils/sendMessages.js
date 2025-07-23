module.exports = async function sendMessages(client, numbers) {
    const text = 'Essa é uma mensagem de teste enviada pelo bot! \n\nSucesso!';
    console.log('Iniciando envio de mensagens...');

    for (const number of numbers) {
        console.log(`Verificando número: ${number}`);

        try {
            const isRegistered = await client.isRegisteredUser(number);
            if (!isRegistered) {
                console.log(`⚠️ Número ${number} não está registrado no WhatsApp.`);
                continue; // pula para o próximo
            }

            await client.sendMessage(number, text);
            console.log(`✅ Mensagem enviada para ${number}`);
        } catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${number}:`, error);
        }
    }

    console.log('📤 Fim do envio.');
};

const express = require('express');
const app = express();
app.use(express.json());

let sockGlobal = null;

function setSocket(sock) {
    sockGlobal = sock;
}

function iniciarAPI() {
    app.post('/enviar', async (req, res) => {
        const { numero, mensaje } = req.body;

        console.log('📨 Petición recibida en /enviar');
        console.log('👉 Número:', numero);
        console.log('👉 Mensaje:', mensaje);

        if (!sockGlobal) {
            console.log("❌ Bot aún no está conectado.");
            return res.status(503).send('❌ Bot no conectado aún.');
        }

        try {
            const jid = `${numero}@s.whatsapp.net`;

            // ✅ Verificar si el número existe en WhatsApp
            const [result] = await sockGlobal.onWhatsApp(jid);
            if (!result?.exists) {
                console.log(`⚠️ El número ${numero} no existe en WhatsApp o no ha iniciado chat con el bot.`);
                return res.status(400).send(`⚠️ El número ${numero} no está disponible.`);
            }

            // ✅ Enviar mensaje
            await sockGlobal.sendMessage(jid, { text: mensaje });
            console.log(`✅ Mensaje enviado a ${numero}`);
            res.send('✅ Mensaje enviado.');
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error);
            res.status(500).send('❌ Error al enviar mensaje.');
        }
    });

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 API escuchando en http://0.0.0.0:${PORT}`);
    });
}

module.exports = { iniciarAPI, setSocket };

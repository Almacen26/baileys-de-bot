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

            // ✅ Verificación controlada de existencia
            let exists = true;
            try {
                const [result] = await sockGlobal.onWhatsApp(jid);
                exists = result?.exists ?? false;
            } catch (err) {
                console.warn('⚠️ Timeout o fallo en onWhatsApp, se continúa sin validar.');
                exists = true; // puedes ponerlo en false si quieres bloquearlo
            }

            if (!exists) {
                console.log(`⚠️ El número ${numero} no existe o no ha iniciado conversación con el bot.`);
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

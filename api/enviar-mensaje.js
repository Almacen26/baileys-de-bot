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
            await sockGlobal.sendMessage(`${numero}@s.whatsapp.net`, { text: mensaje });
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

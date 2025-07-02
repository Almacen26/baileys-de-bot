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
        if (!sockGlobal) {
            return res.status(503).send('❌ Bot no conectado aún.');
        }
        try {
            await sockGlobal.sendMessage(`${numero}@s.whatsapp.net`, { text: mensaje });
            res.send('✅ Mensaje enviado.');
        } catch (error) {
            res.status(500).send('❌ Error al enviar mensaje.');
        }
    });

    // ¡Aquí está la clave!
    const PORT = process.env.PORT || 10000;  // Render usa 10000 por defecto
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 API escuchando en http://0.0.0.0:${PORT}`);
    });
}

module.exports = { iniciarAPI, setSocket };

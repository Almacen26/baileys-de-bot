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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 API escuchando en http://localhost:${PORT}`);
    });
}

module.exports = { iniciarAPI, setSocket };

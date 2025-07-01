const http = require('http');

let sockGlobal = null;

function setSocket(sock) {
    sockGlobal = sock;
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/enviar-mensaje') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { numero, mensaje } = JSON.parse(body);
                if (!sockGlobal) {
                    res.writeHead(500);
                    return res.end('❌ El bot no está listo para enviar mensajes');
                }

                const numero_formateado = numero.includes('@s.whatsapp.net') ? numero : `${numero}@s.whatsapp.net`;

                await sockGlobal.sendMessage(numero_formateado, { text: mensaje });
                console.log(`✅ Mensaje enviado a ${numero}: ${mensaje}`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'enviado' }));
            } catch (err) {
                console.error('❌ Error al enviar mensaje:', err);
                res.writeHead(500);
                res.end('❌ Error al enviar mensaje');
            }
        });
    } else {
        res.writeHead(404);
        res.end('❌ Ruta no encontrada');
    }
});

function iniciarAPI() {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`📡 API escuchando en el puerto ${PORT}`);
    });
}

module.exports = { iniciarAPI, setSocket };

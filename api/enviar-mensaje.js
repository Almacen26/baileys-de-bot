const http = require('http');
const getSock = require('../index'); // Importa la función que retorna el socket

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/enviar-mensaje') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { numero, mensaje } = data;

                if (!numero || !mensaje) {
                    res.writeHead(400);
                    return res.end('Faltan datos (numero o mensaje)');
                }

                const sock = getSock();
                if (!sock) {
                    res.writeHead(500);
                    return res.end('El bot aún no está conectado');
                }

                const numeroFormateado = numero.includes('@s.whatsapp.net')
                    ? numero
                    : numero.replace(/\D/g, '') + '@s.whatsapp.net';

                await sock.sendMessage(numeroFormateado, { text: mensaje });

                res.writeHead(200);
                res.end('Mensaje enviado con éxito');
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end('Error al procesar la solicitud');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`📡 API escuchando en el puerto ${PORT}`);
});

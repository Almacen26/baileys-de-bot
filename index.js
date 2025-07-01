const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');

let sockGlobal = null; // ← Usaremos esto para exportar el socket

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
    });

    sockGlobal = sock; // ← Guardamos el socket global

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, qr, lastDisconnect }) => {
        if (qr) {
            const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
            console.log('📱 Escanea este código QR con WhatsApp en este link:');
            console.log(qrLink);
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('❌ Conexión cerrada. Reintentando:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Bot conectado a WhatsApp');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (text.toLowerCase() === 'hola') {
            await sock.sendMessage(msg.key.remoteJid, { text: '¡Hola! Soy tu bot 🤖' });
        }
    });
}

startBot();

// Exportamos una función para acceder al socket desde otros archivos
module.exports = () => sockGlobal;

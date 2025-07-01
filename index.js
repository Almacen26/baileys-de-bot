const { iniciarAPI, setSocket } = require('./api/enviar-mensaje');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }) });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', ({ connection, qr }) => {
        if (qr) {
            const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
            console.log('📱 Escanea el QR aquí:');
            console.log(qrLink);
        }

        if (connection === 'open') {
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

    setSocket(sock);
}

startBot();
iniciarAPI();

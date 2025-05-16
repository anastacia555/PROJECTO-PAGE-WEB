require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const WebSocket = require('ws');
const routes = require('./routes/routes');
const app = express();

// Configuração de middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração de sessões
app.use(session({
    secret: 'secret-key-planejamento-carreira',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Usar rotas definidas em routes.js
app.use('/', routes);

// WebSocket para chat e contagem de usuários online
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const wss = new WebSocket.Server({ server });
const onlineUsers = new Map();

wss.on('connection', (ws, req) => {
    const userId = req.url.split('userId=')[1];
    onlineUsers.set(userId, ws);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'online', count: onlineUsers.size, users: Array.from(onlineUsers.keys()) }));
        }
    });

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);
        const targetWs = onlineUsers.get(msg.toUserId);
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify(msg));
        }
        if (msg.toUserId === 'all') {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msg));
                }
            });
        }
    });

    ws.on('close', () => {
        onlineUsers.delete(userId);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'online', count: onlineUsers.size, users: Array.from(onlineUsers.keys()) }));
            }
        });
    });
});

app.get('/api/online', (req, res) => {
    res.json({ count: onlineUsers.size, users: Array.from(onlineUsers.keys()) });
});
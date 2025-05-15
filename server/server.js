const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let chatHistory = [];
let onlineUsers = new Map(); // Mapeia socket => nome

app.use(express.static('public'));

app.get('/api/chatHistory', (req, res) => {
    res.json(chatHistory);
});

app.get('/api/onlineUsers', (req, res) => {
    res.json([...onlineUsers.values()]);
});

wss.on('connection', (ws) => {
    let username = '';

    ws.on('message', (data) => {
        const msg = JSON.parse(data);

        if (msg.type === 'join') {
            username = msg.username;
            onlineUsers.set(ws, username);
            broadcast({ type: 'status', text: `${username} está online.` });
            sendOnlineUsers();
        }

        if (msg.type === 'message') {
            const chatMsg = {
                username,
                message: msg.text,
                timestamp: new Date().toLocaleTimeString()
            };
            chatHistory.push(chatMsg);
            broadcast({ type: 'message', ...chatMsg });

            // Simples resposta de bot
            if (msg.text.toLowerCase().includes('ajuda')) {
                const botMsg = {
                    username: 'MentorBot',
                    message: `Olá ${username}, como posso ajudar?`,
                    timestamp: new Date().toLocaleTimeString()
                };
                chatHistory.push(botMsg);
                broadcast({ type: 'message', ...botMsg });
            }
        }
    });

    ws.on('close', () => {
        onlineUsers.delete(ws);
        broadcast({ type: 'status', text: `${username} saiu do chat.` });
        sendOnlineUsers();
    });
});

function broadcast(msg) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

function sendOnlineUsers() {
    const users = [...onlineUsers.values()];
    broadcast({ type: 'users', users });
}

server.listen(3000, () => console.log('Servidor na porta 3000'));

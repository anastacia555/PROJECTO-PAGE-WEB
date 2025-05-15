const express = require('express');
const path = require('path');
const routes = require('./routes');
const WebSocket = require('ws');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'chat.html')));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} às ${new Date().toLocaleString('pt-BR', { timeZone: 'Africa/Luanda' })}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado ao WebSocket');
    routes.loadChatHistory().then(history => {
        history.forEach(msg => ws.send(JSON.stringify(msg)));
    }).catch(err => console.error('Erro ao carregar histórico:', err));

    ws.on('message', async (message) => {
        const msgStr = message.toString();
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msgStr);
            }
        });
        await routes.saveChatMessage(msgStr).catch(err => console.error('Erro ao salvar mensagem:', err));
    });

    ws.on('close', () => {
        console.log('Cliente desconectado do WebSocket');
    });
});
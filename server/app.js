const express = require('express');
const path = require('path');
const routes = require('./routes');
const WebSocket = require('ws');
const app = express();

// Configurar o diretório público para arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Usar as rotas definidas em routes.js
app.use('/', routes.router);

// Iniciar o servidor HTTP na porta 3000
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} às ${new Date().toLocaleString('pt-BR', { timeZone: 'Africa/Luanda' })}`);
});

// Configurar o servidor WebSocket
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
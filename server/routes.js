const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Middleware de autenticação básica
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== 'Bearer admin123') {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
};

// Rota para a página principal (index.html)
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

// Rota para a página de chat (chat.html)
router.get('/chat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'chat.html'));
});

// Rota para a página de admin (admin.html) com autenticação
router.get('/admin', authenticate, (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'admin.html'));
});

// Rota para carregar histórico de chat
router.get('/api/chatHistory', async (req, res) => {
    try {
        const history = await loadChatHistory();
        res.json(history);
    } catch (err) {
        console.error('Erro ao carregar histórico de chat:', err);
        res.status(500).json({ error: 'Erro ao carregar histórico de chat' });
    }
});

// Funções para gerenciar histórico de chat
async function loadChatHistory() {
    const filePath = path.join(__dirname, 'data', 'chatHistory.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) || [];
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]', 'utf-8');
            return [];
        }
        throw err;
    }
}

async function saveChatMessage(message) {
    const history = await loadChatHistory();
    const newMessage = { message, timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'Africa/Luanda' }) };
    history.push(newMessage);
    await fs.writeFile(path.join(__dirname, 'data', 'chatHistory.json'), JSON.stringify(history, null, 2));
    return newMessage;
}

// Rota para salvar usuário
router.post('/api/users', express.json(), async (req, res) => {
    try {
        console.log('Requisição recebida:', req.body); // Depuração
        const { name, email, type, course, educationLevel } = req.body;
        if (!name || !email || !type || !course || !educationLevel) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        const user = { name, email, type, course, educationLevel, id: Date.now().toString() };
        let users = await loadData('users.json');
        users.push(user);
        await saveData('users.json', users);
        await logAdminAction('add', 'user', user);
        console.log('Usuário salvo:', user); // Depuração
        res.json({ message: 'Usuário salvo com sucesso!', user });
    } catch (err) {
        console.error('Erro ao salvar usuário:', err); // Depuração
        res.status(500).json({ error: 'Erro ao salvar usuário' });
    }
});

// Rota para salvar meta
router.post('/api/goals', express.json(), async (req, res) => {
    try {
        const { description, startDate, deadline, category, status, userId } = req.body;
        if (!description || !startDate || !deadline || !category || !status || !userId) {
            return res.status(400).json({ error: 'Todos os campos da meta são obrigatórios, incluindo o usuário associado' });
        }
        const goal = { description, startDate, deadline, category, status, userId, id: Date.now().toString() };
        let goals = await loadData('goals.json');
        goals.push(goal);
        await saveData('goals.json', goals);
        await logAdminAction('add', 'goal', goal);
        res.json({ message: 'Meta salva com sucesso!', goal });
    } catch (err) {
        console.error('Erro ao salvar meta:', err);
        res.status(500).json({ error: 'Erro ao salvar meta' });
    }
});

// Rota para salvar progresso
router.post('/api/progress', express.json(), async (req, res) => {
    try {
        const { text, date, percentage, userId } = req.body;
        if (!text || !date || !userId) {
            return res.status(400).json({ error: 'Texto, data e usuário são obrigatórios' });
        }
        if (percentage && (percentage < 0 || percentage > 100)) {
            return res.status(400).json({ error: 'Percentagem deve estar entre 0 e 100' });
        }
        const progress = { text, date, percentage: percentage || 0, userId, id: Date.now().toString() };
        let progressReports = await loadData('progress.json');
        progressReports.push(progress);
        await saveData('progress.json', progressReports);
        await logAdminAction('add', 'progress', progress);
        res.json({ message: 'Progresso salvo com sucesso!', progress });
    } catch (err) {
        console.error('Erro ao salvar progresso:', err);
        res.status(500).json({ error: 'Erro ao salvar progresso' });
    }
});

// Rota para obter dados
router.get('/api/data', authenticate, async (req, res) => {
    try {
        const users = await loadData('users.json');
        const goals = await loadData('goals.json');
        const progress = await loadData('progress.json');
        const adminLogs = await loadData('adminLogs.json');
        const chatHistory = await loadChatHistory();
        res.json({ users, goals, progress, adminLogs, chatHistory });
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        res.status(500).json({ error: 'Erro ao carregar dados' });
    }
});

// Rota para atualizar meta
router.put('/api/goals/:id', express.json(), authenticate, async (req, res) => {
    try {
        const goalId = req.params.id;
        const { description, startDate, deadline, category, status, userId } = req.body;
        if (!description || !startDate || !deadline || !category || !status || !userId) {
            return res.status(400).json({ error: 'Todos os campos da meta são obrigatórios, incluindo o usuário associado' });
        }
        let goals = await loadData('goals.json');
        const index = goals.findIndex(g => g.id === goalId);
        if (index === -1) {
            return res.status(404).json({ error: 'Meta não encontrada' });
        }
        const updatedGoal = { id: goalId, description, startDate, deadline, category, status, userId };
        goals[index] = updatedGoal;
        await saveData('goals.json', goals);
        await logAdminAction('update', 'goal', updatedGoal);
        res.json({ message: 'Meta atualizada com sucesso!', goal: updatedGoal });
    } catch (err) {
        console.error('Erro ao atualizar meta:', err);
        res.status(500).json({ error: 'Erro ao atualizar meta' });
    }
});

// Rota para deletar meta
router.delete('/api/goals/:id', authenticate, async (req, res) => {
    try {
        const goalId = req.params.id;
        let goals = await loadData('goals.json');
        const index = goals.findIndex(g => g.id === goalId);
        if (index === -1) {
            return res.status(404).json({ error: 'Meta não encontrada' });
        }
        const deletedGoal = goals.splice(index, 1)[0];
        await saveData('goals.json', goals);
        await logAdminAction('delete', 'goal', deletedGoal);
        res.json({ message: 'Meta deletada com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar meta:', err);
        res.status(500).json({ error: 'Erro ao deletar meta' });
    }
});

// Funções auxiliares
async function loadData(filename) {
    const filePath = path.join(__dirname, 'data', filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) || [];
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]', 'utf-8');
            return [];
        }
        throw err;
    }
}

async function saveData(filename, data) {
    await fs.writeFile(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

async function logAdminAction(action, type, data) {
    let adminLogs = await loadData('adminLogs.json');
    adminLogs.push({ action, type, data, timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'Africa/Luanda' }), by: 'admin' });
    await saveData('adminLogs.json', adminLogs);
}

module.exports = { router, loadChatHistory, saveChatMessage };
let selectedUserId = null;

function updateUserSelection() {
    const userSelect = document.getElementById('selectUser');
    selectedUserId = userSelect.value;
}

function loadUsers() {
    fetch('/api/data', {
        headers: { 'Authorization': 'Bearer admin123' }
    })
    .then(response => response.json())
    .then(data => {
        const userSelect = document.getElementById('selectUser');
        userSelect.innerHTML = '<option value="">Selecione um usuário</option>';
        data.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erro ao carregar usuários:', error));
}

function saveUser() {
    const user = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        type: document.getElementById('userType').value,
        course: document.getElementById('userCourse').value,
        educationLevel: document.getElementById('userEducationLevel').value
    };
    if (!user.name || !user.email || !user.type || !user.course || !user.educationLevel) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('userForm').reset();
        loadUsers();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar usuário: ' + error.message);
    });
}

function saveGoal() {
    if (!selectedUserId) {
        alert('Por favor, selecione um usuário antes de cadastrar uma meta.');
        return;
    }
    const goal = {
        description: document.getElementById('goalDescription').value,
        startDate: document.getElementById('goalStartDate').value,
        deadline: document.getElementById('goalDeadline').value,
        category: document.getElementById('goalCategory').value,
        status: document.getElementById('goalStatus').value,
        userId: selectedUserId
    };
    if (!goal.description || !goal.startDate || !goal.deadline || !goal.category || !goal.status) {
        alert('Por favor, preencha todos os campos da meta.');
        return;
    }
    fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('goalForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar meta: ' + error.message);
    });
}

function saveProgress() {
    if (!selectedUserId) {
        alert('Por favor, selecione um usuário antes de cadastrar um progresso.');
        return;
    }
    const progress = {
        text: document.getElementById('progressText').value,
        date: document.getElementById('progressDate').value,
        percentage: document.getElementById('progressPercentage').value || 0,
        userId: selectedUserId
    };
    if (!progress.text || !progress.date) {
        alert('Por favor, preencha texto e data.');
        return;
    }
    if (progress.percentage && (progress.percentage < 0 || progress.percentage > 100)) {
        alert('Percentagem deve estar entre 0 e 100.');
        return;
    }
    fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('progressForm').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar progresso: ' + error.message);
    });
}

window.onload = loadUsers;
const ADMIN_PASSWORD = 'cs2rage2026';

let customServers = [];

function loadServersFromStorage() {
    const saved = localStorage.getItem('customServers');
    customServers = saved ? JSON.parse(saved) : [];
    renderServersList();
}

function saveServersToStorage() {
    localStorage.setItem('customServers', JSON.stringify(customServers));
}

function addServer() {
    const name = document.getElementById('srv-name')?.value.trim();
    if (!name) {
        alert('Введите название сервера');
        return;
    }
    
    const newServer = {
        id: Date.now(),
        name: name,
        mode: document.getElementById('srv-mode')?.value || 'public',
        map: document.getElementById('srv-map')?.value || 'de_mirage',
        region: document.getElementById('srv-region')?.value || 'ru',
        city: document.getElementById('srv-city')?.value || 'Москва',
        slots: parseInt(document.getElementById('srv-slots')?.value) || 32,
        players: parseInt(document.getElementById('srv-players')?.value) || 0,
        status: document.getElementById('srv-status')?.value || 'offline',
        ip: document.getElementById('srv-ip')?.value || '—'
    };
    
    customServers.unshift(newServer);
    saveServersToStorage();
    renderServersList();
    
    // Очищаем форму
    document.getElementById('srv-name').value = '';
    document.getElementById('srv-ip').value = '';
    document.getElementById('srv-players').value = '0';
    
    // Показываем JSON для вставки в data-servers.js
    const jsonLine = JSON.stringify(newServer, null, 4);
    const block = document.createElement('div');
    block.id = 'export-block';
    block.innerHTML = `
        <p style="color:var(--primary);margin-top:1rem;"><i class="fas fa-check"></i> Скопируй и добавь в массив SERVERS в файле data-servers.js:</p>
        <textarea style="width:100%;height:80px;background:#0f0f0f;color:#e8e6e3;border:1px solid #2a2a2a;border-radius:8px;padding:0.5rem;">${jsonLine},</textarea>
        <button class="admin-btn" style="margin-top:0.5rem;" onclick="copyToClipboard(this.previousElementSibling)">Копировать код</button>
    `;
    document.getElementById('add-server-btn')?.parentNode?.appendChild(block);
    
    setTimeout(() => {
        const existing = document.getElementById('export-block');
        if (existing && existing !== block) existing.remove();
    }, 5000);
}

function deleteServer(id) {
    if (!confirm('Удалить сервер?')) return;
    customServers = customServers.filter(s => s.id !== id);
    saveServersToStorage();
    renderServersList();
}

function renderServersList() {
    const container = document.getElementById('srv-list');
    if (!container) return;
    
    const search = document.getElementById('admin-search')?.value.toLowerCase() || '';
    const filtered = customServers.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.map.toLowerCase().includes(search)
    );
    
    document.getElementById('srv-count').textContent = filtered.length;
    document.getElementById('total-servers').textContent = filtered.length;
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">Нет добавленных серверов</p>';
        return;
    }
    
    container.innerHTML = filtered.map(s => `
        <div class="admin-mod-item">
            <div class="admin-mod-item-info">
                <h4>${escapeHtml(s.name)}</h4>
                <span>${s.mode.toUpperCase()} | ${s.map} | ${s.city} | ${s.status}</span>
            </div>
            <button class="admin-mod-item-del" onclick="deleteServer(${s.id})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}

function copyToClipboard(textarea) {
    textarea.select();
    document.execCommand('copy');
    showToast('JSON скопирован!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:90px;right:20px;background:#1a1a1a;border-left:4px solid #e0883a;border-radius:12px;padding:0.8rem 1.2rem;color:#e8e6e3;z-index:10000;animation:slideInRight 0.3s ease';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#e0883a;"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    
    if (sessionStorage.getItem('cs2rage-auth') === 'true') {
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        loadServersFromStorage();
    }
    
    document.getElementById('login-btn')?.addEventListener('click', () => {
        const pwd = document.getElementById('admin-password')?.value;
        if (pwd === ADMIN_PASSWORD) {
            sessionStorage.setItem('cs2rage-auth', 'true');
            if (loginScreen) loginScreen.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
            loadServersFromStorage();
        } else {
            const errorEl = document.getElementById('login-error');
            if (errorEl) errorEl.textContent = 'Неверный пароль';
        }
    });
    
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        sessionStorage.removeItem('cs2rage-auth');
        if (loginScreen) loginScreen.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
        location.reload();
    });
    
    document.getElementById('add-server-btn')?.addEventListener('click', addServer);
    document.getElementById('admin-search')?.addEventListener('input', renderServersList);
});
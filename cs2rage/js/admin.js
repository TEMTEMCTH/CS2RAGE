const ADMIN_PASSWORD = 'Alan13375267';
let allUsers = [];
let customServers = [];

async function loadUsers() {
    const container = document.getElementById('usersList');
    if (container) container.innerHTML = '<div class="loading-text"><i class="fas fa-spinner fa-pulse"></i> Загрузка пользователей...</div>';
    try {
        const response = await fetch('/api/get-users.php');
        const data = await response.json();
        if (data.success && data.users) { allUsers = data.users; renderUsers(); }
        else container.innerHTML = '<div class="loading-text">❌ Ошибка: ' + (data.error || 'Неизвестная ошибка') + '</div>';
    } catch(e) { container.innerHTML = '<div class="loading-text">❌ Ошибка соединения</div>'; }
}

async function updateBalance(steamid, newBalance) {
    try {
        const response = await fetch('/api/update-balance.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ steamid, balance: newBalance }) });
        const data = await response.json();
        if (data.success) { showToast('Баланс обновлён!'); loadUsers(); }
        else showToast('Ошибка: ' + data.error, true);
    } catch(e) { showToast('Ошибка соединения', true); }
}

function renderUsers() {
    const search = document.getElementById('searchUser')?.value.toLowerCase() || '';
    const filtered = allUsers.filter(u => (u.nickname?.toLowerCase() || '').includes(search) || (u.steamid?.includes(search)));
    const container = document.getElementById('usersList');
    if (!container) return;
    if (filtered.length === 0) { container.innerHTML = '<div class="loading-text">👤 Пользователи не найдены</div>'; return; }
    container.innerHTML = filtered.map(u => `
        <div class="user-row">
            <div class="user-info">
                <img src="${u.avatar || '/images/default-avatar.png'}" class="user-avatar" onerror="this.src='/images/default-avatar.png'">
                <div><strong>${escapeHtml(u.nickname || 'Unknown')}</strong><br><span style="font-size:0.7rem;color:#8a8a8a;">${u.steamid || '—'}</span></div>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                <span class="user-balance" id="balance-${u.steamid}">${u.balance || 0} ₽</span>
                <input type="number" id="input-${u.steamid}" class="balance-input" placeholder="Сумма" value="0">
                <div class="action-btns">
                    <button class="action-btn" onclick="updateBalance('${u.steamid}', (parseInt(document.getElementById('input-${u.steamid}').value) || 0) + (${u.balance || 0}))">➕</button>
                    <button class="action-btn" onclick="updateBalance('${u.steamid}', (${u.balance || 0}) - (parseInt(document.getElementById('input-${u.steamid}').value) || 0))">➖</button>
                    <button class="action-btn" onclick="updateBalance('${u.steamid}', parseInt(document.getElementById('input-${u.steamid}').value) || 0)">✏️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeftColor = isError ? '#e34d4d' : '#f5c518';
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i><div>${message}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;')); }

function checkAdminAuth() {
    const password = document.getElementById('adminPassword')?.value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsers(); loadServersFromStorage();
    } else document.getElementById('loginError').style.display = 'block';
}

function loadServersFromStorage() { const saved = localStorage.getItem('customServers'); customServers = saved ? JSON.parse(saved) : []; renderServersList(); }
function saveServersToStorage() { localStorage.setItem('customServers', JSON.stringify(customServers)); }

function addServer() {
    const name = document.getElementById('srvName')?.value.trim();
    if (!name) { showToast('Введите название сервера', true); return; }
    const newServer = {
        id: Date.now(), name,
        mode: document.getElementById('srvMode')?.value || 'public',
        map: document.getElementById('srvMap')?.value || 'de_mirage',
        region: document.getElementById('srvRegion')?.value || 'ru',
        city: document.getElementById('srvCity')?.value || 'Москва',
        slots: parseInt(document.getElementById('srvSlots')?.value) || 32,
        players: parseInt(document.getElementById('srvPlayers')?.value) || 0,
        status: document.getElementById('srvStatus')?.value || 'offline',
        ip: document.getElementById('srvIp')?.value || '—'
    };
    customServers.unshift(newServer); saveServersToStorage(); renderServersList(); showToast('Сервер добавлен!');
    document.getElementById('srvName').value = ''; document.getElementById('srvIp').value = ''; document.getElementById('srvPlayers').value = '0';
}

function deleteServer(id) { if (!confirm('Удалить сервер?')) return; customServers = customServers.filter(s => s.id !== id); saveServersToStorage(); renderServersList(); showToast('Сервер удалён'); }

function renderServersList() {
    const search = document.getElementById('searchServer')?.value.toLowerCase() || '';
    const filtered = customServers.filter(s => s.name.toLowerCase().includes(search) || s.map.toLowerCase().includes(search));
    const container = document.getElementById('serversList');
    const countSpan = document.getElementById('serversCount');
    if (!container) return;
    if (countSpan) countSpan.textContent = filtered.length;
    if (filtered.length === 0) { container.innerHTML = '<div class="loading-text">Нет добавленных серверов</div>'; return; }
    container.innerHTML = filtered.map(s => `
        <div class="user-row" style="justify-content:space-between;">
            <div><strong>${escapeHtml(s.name)}</strong><br><span style="font-size:0.7rem;color:#8a8a8a;">${s.map} · ${s.city} · ${s.status === 'online' ? '🟢 Online' : '⚫ Offline'} · 👥 ${s.players}/${s.slots}</span></div>
            <button class="action-btn" style="background:transparent;border-color:#e34d4d;" onclick="deleteServer(${s.id})"><i class="fas fa-trash"></i> Удалить</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('adminAuth') === 'true') { document.getElementById('loginScreen').style.display = 'none'; document.getElementById('adminPanel').style.display = 'block'; loadUsers(); loadServersFromStorage(); }
    document.getElementById('loginBtn')?.addEventListener('click', checkAdminAuth);
    document.getElementById('adminPassword')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAdminAuth(); });
    document.getElementById('addServerBtn')?.addEventListener('click', addServer);
    document.getElementById('refreshUsersBtn')?.addEventListener('click', loadUsers);
    document.getElementById('searchUser')?.addEventListener('input', renderUsers);
    document.getElementById('searchServer')?.addEventListener('input', renderServersList);
    document.querySelectorAll('.tab-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); if (btn.dataset.tab === 'users') { document.getElementById('usersTab').classList.add('active'); if (allUsers.length === 0) loadUsers(); } else document.getElementById('serversTab').classList.add('active'); }); });
});

window.updateBalance = updateBalance;
window.deleteServer = deleteServer;
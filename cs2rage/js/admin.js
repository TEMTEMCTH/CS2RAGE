const ADMIN_PASSWORD = 'Alan13375267';
let allUsers = [], customServers = [];

function checkAdminAuth() {
    var pwd = document.getElementById('adminPassword')?.value;
    if (pwd === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsers(); loadServersFromStorage();
    } else document.getElementById('loginError').style.display = 'block';
}

function showToast(msg, isError) {
    isError = isError || false;
    var t = document.createElement('div'); t.className = 'toast';
    t.style.borderLeftColor = isError ? '#e34d4d' : '#f5c518';
    t.innerHTML = '<i class="fas ' + (isError ? 'fa-exclamation-circle' : 'fa-check-circle') + '"></i><div>' + msg + '</div>';
    document.body.appendChild(t); setTimeout(function() { t.remove(); }, 3000);
}

async function loadUsers() {
    var c = document.getElementById('usersList');
    if (c) c.innerHTML = '<div class="loading-text"><i class="fas fa-spinner fa-pulse"></i> Загрузка...</div>';
    try {
        var r = await fetch('/api/get-users.php'); var d = await r.json();
        if (d.success && d.users) { allUsers = d.users; renderUsers(); }
        else c.innerHTML = '<div class="loading-text">❌ ' + (d.error || 'Ошибка') + '</div>';
    } catch(e) { c.innerHTML = '<div class="loading-text">❌ Ошибка соединения</div>'; }
}

async function updateBalance(steamid, newBalance) {
    try {
        var r = await fetch('/api/update-balance.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ steamid, balance: newBalance }) });
        var d = await r.json();
        if (d.success) { showToast('Баланс обновлён!'); loadUsers(); }
        else showToast('Ошибка: ' + d.error, true);
    } catch(e) { showToast('Ошибка соединения', true); }
}

function renderUsers() {
    var s = document.getElementById('searchUser')?.value.toLowerCase() || '';
    var f = allUsers.filter(function(u) { return (u.nickname?.toLowerCase() || '').includes(s) || (u.steamid?.includes(s)); });
    var c = document.getElementById('usersList'); if (!c) return;
    if (!f.length) { c.innerHTML = '<div class="loading-text">👤 Не найдено</div>'; return; }
    c.innerHTML = f.map(function(u) {
        return '<div class="user-row"><div class="user-info"><img src="' + (u.avatar || '/images/default-avatar.png') + '" class="user-avatar" onerror="this.src=\'/images/default-avatar.png\'"><div><strong>' + escapeHtml(u.nickname || 'Unknown') + '</strong><br><span style="font-size:0.7rem;color:#8a8a8a;">' + (u.steamid || '—') + '</span></div></div><div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span class="user-balance">' + (u.balance || 0) + ' ₽</span><input type="number" id="input-' + u.steamid + '" class="balance-input" placeholder="0" value="0"><div class="action-btns"><button class="action-btn" onclick="updateBalance(\'' + u.steamid + '\', ' + (u.balance || 0) + ' + (parseInt(document.getElementById(\'input-' + u.steamid + '\').value) || 0))">➕</button><button class="action-btn" onclick="updateBalance(\'' + u.steamid + '\', ' + (u.balance || 0) + ' - (parseInt(document.getElementById(\'input-' + u.steamid + '\').value) || 0))">➖</button><button class="action-btn" onclick="updateBalance(\'' + u.steamid + '\', parseInt(document.getElementById(\'input-' + u.steamid + '\').value) || 0)">✏️</button></div></div></div>';
    }).join('');
}

function loadServersFromStorage() { var s = localStorage.getItem('customServers'); customServers = s ? JSON.parse(s) : []; renderServersList(); }
function saveServersToStorage() { localStorage.setItem('customServers', JSON.stringify(customServers)); }

function addServer() {
    var name = document.getElementById('srvName')?.value.trim();
    if (!name) { showToast('Введите название', true); return; }
    customServers.unshift({ id: Date.now(), name, mode: document.getElementById('srvMode')?.value || 'public', map: document.getElementById('srvMap')?.value || 'de_mirage', region: document.getElementById('srvRegion')?.value || 'ru', city: document.getElementById('srvCity')?.value || 'Москва', slots: parseInt(document.getElementById('srvSlots')?.value) || 32, players: parseInt(document.getElementById('srvPlayers')?.value) || 0, status: document.getElementById('srvStatus')?.value || 'offline', ip: document.getElementById('srvIp')?.value || '—' });
    saveServersToStorage(); renderServersList(); showToast('Сервер добавлен!');
    document.getElementById('srvName').value = ''; document.getElementById('srvIp').value = ''; document.getElementById('srvPlayers').value = '0';
}

function deleteServer(id) { if (!confirm('Удалить?')) return; customServers = customServers.filter(function(s) { return s.id !== id; }); saveServersToStorage(); renderServersList(); showToast('Сервер удалён'); }

function renderServersList() {
    var s = document.getElementById('searchServer')?.value.toLowerCase() || '';
    var f = customServers.filter(function(srv) { return srv.name.toLowerCase().includes(s) || srv.map.toLowerCase().includes(s); });
    var c = document.getElementById('serversList'), cnt = document.getElementById('serversCount');
    if (!c) return; if (cnt) cnt.textContent = f.length;
    if (!f.length) { c.innerHTML = '<div class="loading-text">Нет серверов</div>'; return; }
    c.innerHTML = f.map(function(srv) {
        return '<div class="user-row"><div><strong>' + escapeHtml(srv.name) + '</strong><br><span style="font-size:0.7rem;color:#8a8a8a;">' + srv.map + ' · ' + srv.city + ' · ' + (srv.status === 'online' ? '🟢' : '⚫') + ' · 👥 ' + srv.players + '/' + srv.slots + '</span></div><button class="action-btn" style="color:#e34d4d;border-color:#e34d4d;" onclick="deleteServer(' + srv.id + ')">🗑️</button></div>';
    }).join('');
}

function escapeHtml(s) { if (!s) return ''; return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminAuth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsers(); loadServersFromStorage();
    }
    document.getElementById('loginBtn')?.addEventListener('click', checkAdminAuth);
    document.getElementById('adminPassword')?.addEventListener('keypress', function(e) { if (e.key === 'Enter') checkAdminAuth(); });
    document.getElementById('addServerBtn')?.addEventListener('click', addServer);
    document.getElementById('refreshUsersBtn')?.addEventListener('click', loadUsers);
    document.getElementById('searchUser')?.addEventListener('input', renderUsers);
    document.getElementById('searchServer')?.addEventListener('input', renderServersList);
    
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
            if (btn.dataset.tab === 'users') { document.getElementById('usersTab').classList.add('active'); if (!allUsers.length) loadUsers(); }
            else document.getElementById('serversTab').classList.add('active');
        });
    });
});

window.updateBalance = updateBalance;
window.deleteServer = deleteServer;
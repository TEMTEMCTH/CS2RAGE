// admin.js - Админ-панель CS2RAGE

const ADMIN_PASSWORD = 'cs2rage2026'; // Поменяй пароль

document.addEventListener('DOMContentLoaded', function() {
    
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    
    if (sessionStorage.getItem('cs2rage-auth') === 'true') showPanel();
    
    document.getElementById('login-btn').addEventListener('click', function() {
        if (document.getElementById('admin-password').value === ADMIN_PASSWORD) {
            sessionStorage.setItem('cs2rage-auth', 'true');
            showPanel();
        } else {
            document.getElementById('login-error').textContent = 'Неверный пароль';
        }
    });
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('cs2rage-auth');
        location.reload();
    });
    
    document.getElementById('admin-password').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') document.getElementById('login-btn').click();
    });
    
    function showPanel() {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        loadServers();
    }
    
    // ===== ДОБАВЛЕНИЕ СЕРВЕРА =====
    document.getElementById('add-server-btn').addEventListener('click', function() {
        const name = document.getElementById('srv-name').value.trim();
        const mode = document.getElementById('srv-mode').value;
        const map = document.getElementById('srv-map').value;
        const region = document.getElementById('srv-region').value;
        const city = document.getElementById('srv-city').value;
        const slots = parseInt(document.getElementById('srv-slots').value) || 32;
        const players = parseInt(document.getElementById('srv-players').value) || 0;
        const status = document.getElementById('srv-status').value;
        const ip = document.getElementById('srv-ip').value.trim();
        
        if (!name) { alert('Введите название сервера'); return; }
        
        const existingServers = JSON.parse(localStorage.getItem('custom-servers') || '[]');
        const newServer = {
            id: Date.now(),
            name,
            mode,
            map,
            region,
            city,
            slots,
            players,
            status,
            ip: ip || '—'
        };
        
        // Формируем JSON для вставки в data-servers.js
        const jsonLine = JSON.stringify(newServer, null, 4);
        
        const old = document.getElementById('export-block');
        if (old) old.remove();
        
        const block = document.createElement('div');
        block.id = 'export-block';
        block.innerHTML = `
            <p style="color:var(--primary);margin-bottom:8px;"><i class="fas fa-check"></i> Скопируй и добавь в массив <strong>SERVERS</strong> в файле <strong>data-servers.js</strong>:</p>
            <textarea readonly>${jsonLine},</textarea>
            <button class="admin-btn" style="margin-top:8px;" onclick="var t=this.previousElementSibling;t.select();document.execCommand('copy');this.textContent='Скопировано!';setTimeout(()=>this.textContent='Копировать код',1500)">Копировать код</button>
        `;
        this.parentNode.appendChild(block);
        block.scrollIntoView({ behavior: 'smooth' });
        
        // Очищаем форму
        document.getElementById('srv-name').value = '';
        document.getElementById('srv-players').value = '0';
        document.getElementById('srv-ip').value = '';
    });
    
    // ===== ПОИСК =====
    document.getElementById('admin-search').addEventListener('input', function() {
        loadServers(this.value.toLowerCase().trim());
    });
    
});

function loadServers(searchQuery = '') {
    const list = document.getElementById('srv-list');
    const customServers = JSON.parse(localStorage.getItem('custom-servers') || '[]');
    
    // Добавляем существующие серверы из SERVERS если они есть
    let allServers = customServers;
    if (typeof SERVERS !== 'undefined') {
        const customIds = new Set(customServers.map(s => s.id));
        const existingCustom = SERVERS.filter(s => customIds.has(s.id));
        allServers = [...customServers.filter(s => !customIds.has(s.id)), ...existingCustom];
    }
    
    if (searchQuery) {
        allServers = allServers.filter(s => 
            s.name.toLowerCase().includes(searchQuery) || 
            s.map.toLowerCase().includes(searchQuery)
        );
    }
    
    allServers.sort((a, b) => b.id - a.id);
    
    document.getElementById('srv-count').textContent = allServers.length;
    document.getElementById('total-servers').textContent = allServers.length;
    
    if (allServers.length === 0) {
        list.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">Нет добавленных серверов</p>';
        return;
    }
    
    list.innerHTML = allServers.map(srv => `
        <div class="admin-mod-item">
            <div class="admin-mod-item-info">
                <h4>${srv.name}</h4>
                <span>${srv.mode.toUpperCase()} | ${srv.map} | ${srv.city} | ${srv.status}</span>
            </div>
            <button class="admin-mod-item-del" onclick="deleteServer(${srv.id})"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}

function deleteServer(id) {
    if (!confirm('Удалить сервер?')) return;
    const servers = JSON.parse(localStorage.getItem('custom-servers') || '[]');
    const filtered = servers.filter(s => s.id !== id);
    localStorage.setItem('custom-servers', JSON.stringify(filtered));
    loadServers();
}
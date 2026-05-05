// servers.js - Логика главной страницы
let activeMode = "public";
let region = "all";
let mapFilter = "all";
let q = "";

// Команды для каждого режима
const MODE_COMMANDS = {
    public: [
        { cmd: "!ws", desc: "Открыть меню скинов" },
        { cmd: "!knife", desc: "Выбрать нож" },
        { cmd: "!glove", desc: "Выбрать перчатки" },
        { cmd: "!menu", desc: "Главное меню" },
        { cmd: "!rank", desc: "Показать свой ранг" },
        { cmd: "!top", desc: "Таблица лидеров" },
        { cmd: "!stats [ник]", desc: "Статистика игрока" },
        { cmd: "!votekick [ник]", desc: "Голосование за кик" },
        { cmd: "!votemute [ник]", desc: "Заглушить игрока" },
        { cmd: "!report [ник] [причина]", desc: "Пожаловаться" }
    ],
    awp: [
        { cmd: "!ws", desc: "Выбрать скин AWP" },
        { cmd: "!knife", desc: "Выбрать нож" },
        { cmd: "!glove", desc: "Выбрать перчатки" },
        { cmd: "!duel", desc: "Вызвать на дуэль" },
        { cmd: "!stats", desc: "Статистика дуэлей" },
        { cmd: "!reset", desc: "Сбросить оружие" },
        { cmd: "!zoom_sensitivity", desc: "Настройка чувствительности зума" }
    ],
    arena: [
        { cmd: "!ws", desc: "Выбрать скин" },
        { cmd: "!knife", desc: "Выбрать нож" },
        { cmd: "!glove", desc: "Выбрать перчатки" },
        { cmd: "!accept", desc: "Принять дуэль" },
        { cmd: "!decline", desc: "Отклонить дуэль" },
        { cmd: "!ready", desc: "Готов к бою" },
        { cmd: "!stats", desc: "Статистика побед/поражений" },
        { cmd: "!weapon [оружие]", desc: "Выбрать оружие для дуэли" },
        { cmd: "!map [название]", desc: "Выбрать карту (если доступно)" }
    ]
};

function modeServers() { return SERVERS.filter(s => s.mode === activeMode); }

function renderModes() {
    const el = document.getElementById("modes");
    if (!el) return;
    el.innerHTML = MODES.map(m => {
        const c = SERVERS.filter(s => s.mode === m.id).length;
        const active = m.id === activeMode;
        return `<button class="mode-btn ${active ? "active" : ""}" data-mode="${m.id}">
            <span class="bar"></span>
            <div class="num">${c}</div>
            <div class="name">${m.name}</div>
            <div class="lbl">режим</div>
        </button>`;
    }).join("");
    el.querySelectorAll("button").forEach(b => b.onclick = () => {
        activeMode = b.dataset.mode; 
        mapFilter = "all"; 
        renderAll();
        const commandsBtn = document.getElementById('mode-commands-btn');
        if (commandsBtn) {
            commandsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

function renderModeInfo() {
    const m = MODES.find(x => x.id === activeMode);
    const modeInfo = document.getElementById("mode-info");
    if (!modeInfo) return;
    modeInfo.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div>
                <h2>${m.name}</h2>
                <p>${m.desc}</p>
            </div>
            <button id="mode-commands-btn" class="btn-commands" style="background:var(--gradient-orange); border:none; color:var(--primary-fg); padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:700; text-transform:uppercase; letter-spacing:.1em; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-terminal"></i> Команды режима
            </button>
        </div>
    `;
    
    const commandsBtn = document.getElementById('mode-commands-btn');
    if (commandsBtn) {
        commandsBtn.onclick = showCommandsModal;
    }
}

function showCommandsModal() {
    const commands = MODE_COMMANDS[activeMode] || [];
    const modeName = MODES.find(x => x.id === activeMode)?.name || activeMode;
    
    const modalHtml = `
        <div id="commands-modal" class="commands-modal">
            <div class="commands-modal-content">
                <div class="commands-modal-header">
                    <h3><i class="fas fa-terminal"></i> ${modeName} — Команды режима</h3>
                    <button id="close-modal-btn" class="commands-modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="commands-modal-body">
                    ${commands.length === 0 ? `<p style="text-align:center;color:var(--muted);">Команды для этого режима не найдены</p>` : `
                        <table class="commands-table">
                            <thead>
                                <tr><th>Команда</th><th>Описание</th></tr>
                            </thead>
                            <tbody>
                                ${commands.map(cmd => `
                                    <tr><td><code style="background:rgba(224,136,58,.15); padding:4px 8px; border-radius:6px; color:var(--primary); font-weight:700;">${cmd.cmd}</code></td><td style="color:var(--muted);">${cmd.desc}</td></tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
                <div class="commands-modal-footer">
                    <button id="close-modal-footer-btn" class="admin-btn">Закрыть</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('commands-modal');
    
    const closeModal = () => {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove();
        }, 200);
    };
    
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('close-modal-footer-btn')?.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function renderFilters() {
    const maps = [...new Set(modeServers().map(s => s.map))];
    const mapFilterEl = document.getElementById("map-filter");
    if (!mapFilterEl) return;
    mapFilterEl.innerHTML = `<option value="all">Все карты</option>` +
        maps.map(m => `<option value="${m}" ${m === mapFilter ? "selected" : ""}>${mapLabel(m)}</option>`).join("");
}

function applyFilters() {
    let l = modeServers();
    if (region !== "all") l = l.filter(s => s.region === region);
    if (mapFilter !== "all") l = l.filter(s => s.map === mapFilter);
    if (q.trim()) {
        const n = q.toLowerCase();
        l = l.filter(s => s.name.toLowerCase().includes(n) || s.map.toLowerCase().includes(n));
    }
    return l;
}

function serverCard(s) {
    const pct = s.slots ? (s.players / s.slots) * 100 : 0;
    const statusClass = s.players > 0 ? "badge-on" : "badge-off";
    const statusText = s.players > 0 ? "ONLINE" : "OFFLINE";
    const playersText = s.players > 0 ? `${s.players} / ${s.slots}` : "0 / " + s.slots;
    return `<div class="server-card">
        <div class="top">
            <div>
                <div class="name">${s.name}</div>
                <div class="meta">${mapLabel(s.map)} · ${s.city}</div>
            </div>
            <span class="${statusClass}">${statusText}</span>
        </div>
        <div class="players-bar"><div style="width:${pct}%"></div></div>
        <div class="players-info"><span>Игроки</span><span><b>${playersText}</b></span></div>
        <button class="btn-connect" ${s.players === 0 ? 'disabled' : ''} ${s.players > 0 ? 'onclick="connectToServer(\'' + s.ip + '\')"' : ''}>
            ${s.players > 0 ? 'Подключиться' : 'Сервер выключен'}
        </button>
    </div>`;
}

function renderServers() {
    const filtered = applyFilters();
    const wrap = document.getElementById("servers");
    if (!wrap) return;
    if (filtered.length === 0) {
        wrap.innerHTML = `<div style="text-align:center;padding:4rem 0;color:var(--muted)">Нет серверов по выбранным фильтрам</div>`;
        return;
    }
    const groups = {};
    filtered.forEach(s => (groups[s.map] = groups[s.map] || []).push(s));
    wrap.innerHTML = Object.entries(groups)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([map, arr]) => `
            <div class="map-group">
                <div class="map-head">
                    <h3>${mapLabel(map)}</h3>
                    <span>(${arr.length} серверов)</span>
                </div>
                <div class="servers-grid">${arr.map(serverCard).join("")}</div>
            </div>
        `).join("");
}

function renderHeroStats() {
    const total = SERVERS.reduce((a, s) => a + s.players, 0);
    const heroStats = document.getElementById("hero-stats");
    if (!heroStats) return;
    heroStats.innerHTML = `
        <div class="stat"><b>${total}</b><span>Игроков</span></div>
        <div class="stat"><b>${SERVERS.length}</b><span>Серверов</span></div>
        <div class="stat"><b>24/7</b><span>Аптайм</span></div>
    `;
}

function renderAll() {
    renderHeroStats();
    renderModes();
    renderModeInfo();
    renderFilters();
    renderServers();
}

function animateNumbers() {
    const stats = document.querySelectorAll('.stat b, .online-pill b');
    stats.forEach(stat => {
        const final = parseInt(stat.innerText);
        if (isNaN(final)) return;
        let current = 0;
        const increment = final / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= final) {
                stat.innerText = final;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current);
            }
        }, 50);
    });
}

// Функция для подключения к серверу
function connectToServer(ip) {
    if (ip && ip !== '—') {
        window.location.href = `steam://connect/${ip}`;
    } else {
        alert('IP адрес сервера не указан');
    }
}

// Функция обновления реального онлайна с сервера
async function updateOnlineStats() {
    try {
        const response = await fetch('/api/get-online.php');
        const data = await response.json();
        
        if (data.success && data.servers) {
            // Обновляем онлайн в серверах
            data.servers.forEach(server => {
                const serverIndex = SERVERS.findIndex(s => s.id == server.id);
                if (serverIndex !== -1) {
                    SERVERS[serverIndex].players = server.players;
                    if (server.ip) SERVERS[serverIndex].ip = server.ip;
                }
            });
            
            // Обновляем общий онлайн
            const totalOnline = SERVERS.reduce((sum, s) => sum + s.players, 0);
            const onlinePills = document.querySelectorAll('.online-pill b');
            onlinePills.forEach(pill => {
                pill.textContent = totalOnline;
            });
            
            // Обновляем статистику в hero
            const heroStat = document.querySelector('#hero-stats .stat:first-child b');
            if (heroStat) heroStat.textContent = totalOnline;
            
            // Перерисовываем серверы
            renderServers();
        }
    } catch (error) {
        console.error('Ошибка обновления онлайна:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    
    const regionSelect = document.getElementById("region");
    const mapFilterSelect = document.getElementById("map-filter");
    const searchInput = document.getElementById("search");
    
    if (regionSelect) regionSelect.onchange = (e) => { region = e.target.value; renderServers(); };
    if (mapFilterSelect) mapFilterSelect.onchange = (e) => { mapFilter = e.target.value; renderServers(); };
    if (searchInput) searchInput.oninput = (e) => { q = e.target.value; renderServers(); };
    
    animateNumbers();
    
    // Запускаем обновление онлайна
    updateOnlineStats();
    setInterval(updateOnlineStats, 30000);
});

// Добавляем стили для модального окна если их нет
if (!document.querySelector('#modal-styles')) {
    const modalStyles = document.createElement('style');
    modalStyles.id = 'modal-styles';
    modalStyles.textContent = `
        .commands-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .commands-modal-content {
            background: var(--card);
            border: 1px solid var(--primary);
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        }
        .commands-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
        }
        .commands-modal-header h3 {
            font-family: 'Oswald', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--primary);
            margin: 0;
        }
        .commands-modal-close {
            background: none;
            border: none;
            color: var(--muted);
            font-size: 1.2rem;
            cursor: pointer;
            transition: 0.2s;
            padding: 5px;
        }
        .commands-modal-close:hover {
            color: var(--primary);
        }
        .commands-modal-body {
            padding: 20px 24px;
            overflow-y: auto;
            flex: 1;
        }
        .commands-table {
            width: 100%;
            border-collapse: collapse;
        }
        .commands-table th {
            text-align: left;
            padding: 10px 8px;
            color: var(--muted);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-bottom: 1px solid var(--border);
        }
        .commands-table td {
            padding: 12px 8px;
            border-bottom: 1px solid var(--border);
        }
        .commands-table tr:last-child td {
            border-bottom: none;
        }
        .commands-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: flex-end;
        }
        .commands-modal.closing {
            animation: fadeOutModal 0.2s ease forwards;
        }
        .commands-modal.closing .commands-modal-content {
            animation: slideDownModal 0.2s ease forwards;
        }
        @keyframes fadeOutModal {
            to { opacity: 0; backdrop-filter: blur(0px); }
        }
        @keyframes slideDownModal {
            to { transform: translateY(30px) scale(0.95); opacity: 0; }
        }
    `;
    document.head.appendChild(modalStyles);
}
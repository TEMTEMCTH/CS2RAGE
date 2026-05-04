// servers.js - Логика главной страницы
function getFlagIcon(lang) {
    return lang === 'ru' ? '🇷🇺' : '🇬🇧';
}

// Обновить функцию updateLanguageButton
function updateLanguageButton() {
    const btn = document.getElementById('lang-switch-btn');
    if (btn) {
        const currentFlag = getFlagIcon(currentLang);
        const nextLang = currentLang === 'ru' ? 'en' : 'ru';
        const nextFlag = getFlagIcon(nextLang);
        btn.innerHTML = `${currentFlag} → ${nextFlag} ${currentLang === 'ru' ? 'EN' : 'RU'}`;
    }
}
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
        { cmd: "!accept", desc: "Принять дуэль" },
        { cmd: "!decline", desc: "Отклонить дуэль" },
        { cmd: "!ready", desc: "Готов к бою" },
        { cmd: "!stats", desc: "Статистика побед/поражений" },
        { cmd: "!weapon [оружие]", desc: "Выбрать оружие для дуэли" },
        { cmd: "!map [название]", desc: "Выбрать карту (если доступно)" }
    ]
};

// Переводы интерфейса
const TRANSLATIONS = {
    ru: {
        players: "Игроков",
        servers: "Серверов",
        uptime: "Аптайм",
        all_regions: "Все",
        russia: "Россия",
        europe: "Европа",
        all_maps: "Все карты",
        search_placeholder: "Поиск сервера или карты...",
        no_servers: "Нет серверов по выбранным фильтрам",
        server_offline: "Сервер выключен",
        mode_commands: "Команды режима",
        commands_title: "Команды режима",
        close: "Закрыть",
        weapon: "Оружие",
        description: "Описание",
        no_commands: "Команды для этого режима не найдены"
    },
    en: {
        players: "Players",
        servers: "Servers",
        uptime: "Uptime",
        all_regions: "All",
        russia: "Russia",
        europe: "Europe",
        all_maps: "All maps",
        search_placeholder: "Search server or map...",
        no_servers: "No servers match your filters",
        server_offline: "Server offline",
        mode_commands: "Mode Commands",
        commands_title: "Mode Commands",
        close: "Close",
        weapon: "Weapon",
        description: "Description",
        no_commands: "No commands found for this mode"
    }
};

let currentLang = localStorage.getItem('cs2rage-lang') || 'ru';

function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

function switchLanguage() {
    currentLang = currentLang === 'ru' ? 'en' : 'en';
    localStorage.setItem('cs2rage-lang', currentLang);
    renderAll();
    updateLanguageButton();
}

function updateLanguageButton() {
    const btn = document.getElementById('lang-switch-btn');
    if (btn) {
        btn.innerHTML = currentLang === 'ru' ? '<i class="fas fa-globe"></i> EN' : '<i class="fas fa-globe"></i> RU';
    }
}

function modeServers() { return SERVERS.filter(s => s.mode === activeMode); }

function renderModes() {
    const el = document.getElementById("modes");
    el.innerHTML = MODES.map(m => {
        const c = SERVERS.filter(s => s.mode === m.id).length;
        const active = m.id === activeMode;
        return `<button class="mode-btn ${active ? "active" : ""}" data-mode="${m.id}">
            <span class="bar"></span>
            <div class="num">${c}</div>
            <div class="name">${m.name}</div>
            <div class="lbl">${currentLang === 'ru' ? 'режим' : 'mode'}</div>
        </button>`;
    }).join("");
    el.querySelectorAll("button").forEach(b => b.onclick = () => {
        activeMode = b.dataset.mode; 
        mapFilter = "all"; 
        renderAll();
        // Прокручиваем к кнопке команд после смены режима
        const commandsBtn = document.getElementById('mode-commands-btn');
        if (commandsBtn) {
            commandsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

function renderModeInfo() {
    const m = MODES.find(x => x.id === activeMode);
    const modeName = currentLang === 'ru' ? m.name : 
        (m.id === 'public' ? 'Public' : m.id === 'awp' ? 'AWP' : 'Arena 1v1');
    const modeDesc = currentLang === 'ru' ? m.desc :
        (m.id === 'public' ? 'Classic CS2 public servers — core of the project.' :
         m.id === 'awp' ? 'AWP-only arenas for sniper duel lovers.' :
         '1v1 duels with arena rotation system.');
    
    document.getElementById("mode-info").innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div>
                <h2>${modeName}</h2>
                <p>${modeDesc}</p>
            </div>
            <button id="mode-commands-btn" class="btn-commands" style="background:var(--gradient-orange); border:none; color:var(--primary-fg); padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:700; text-transform:uppercase; letter-spacing:.1em; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-terminal"></i> ${t('mode_commands')}
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
                    <h3><i class="fas fa-terminal"></i> ${modeName} — ${t('commands_title')}</h3>
                    <button id="close-modal-btn" class="commands-modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="commands-modal-body">
                    ${commands.length === 0 ? `<p style="text-align:center;color:var(--muted);">${t('no_commands')}</p>` : `
                        <table class="commands-table">
                            <thead>
                                <tr>
                                    <th>${t('weapon')}</th>
                                    <th>${t('description')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${commands.map(cmd => `
                                    <tr>
                                        <td><code style="background:rgba(224,136,58,.15); padding:4px 8px; border-radius:6px; color:var(--primary); font-weight:700;">${cmd.cmd}</code></td>
                                        <td style="color:var(--muted);">${cmd.desc}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}
                </div>
                <div class="commands-modal-footer">
                    <button id="close-modal-footer-btn" class="admin-btn">${t('close')}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('commands-modal');
    const closeByBtn = () => {
        modal.remove();
    };
    
    document.getElementById('close-modal-btn')?.addEventListener('click', closeByBtn);
    document.getElementById('close-modal-footer-btn')?.addEventListener('click', closeByBtn);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeByBtn();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeByBtn();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function renderFilters() {
    const maps = [...new Set(modeServers().map(s => s.map))];
    document.getElementById("map-filter").innerHTML =
        `<option value="all">${t('all_maps')}</option>` +
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
    return `<div class="server-card">
        <div class="top">
            <div>
                <div class="name">${s.name}</div>
                <div class="meta">${mapLabel(s.map)} · ${s.city}</div>
            </div>
            <span class="badge-off">OFFLINE</span>
        </div>
        <div class="players-bar"><div style="width:${pct}%"></div></div>
        <div class="players-info"><span>${currentLang === 'ru' ? 'Игроки' : 'Players'}</span><span><b>${s.players}</b> / ${s.slots}</span></div>
        <button class="btn-connect" disabled>${t('server_offline')}</button>
    </div>`;
}

function renderServers() {
    const filtered = applyFilters();
    const wrap = document.getElementById("servers");
    if (filtered.length === 0) {
        wrap.innerHTML = `<div style="text-align:center;padding:4rem 0;color:var(--muted)">${t('no_servers')}</div>`;
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
                    <span>(${arr.length} ${currentLang === 'ru' ? 'серверов' : 'servers'})</span>
                </div>
                <div class="servers-grid">${arr.map(serverCard).join("")}</div>
            </div>
        `).join("");
}

function renderHeroStats() {
    const total = SERVERS.reduce((a, s) => a + s.players, 0);
    document.getElementById("hero-stats").innerHTML = `
        <div class="stat"><b>${total}</b><span>${t('players')}</span></div>
        <div class="stat"><b>${SERVERS.length}</b><span>${t('servers')}</span></div>
        <div class="stat"><b>24/7</b><span>${t('uptime')}</span></div>
    `;
}

function renderAll() {
    renderHeroStats();
    renderModes();
    renderModeInfo();
    renderFilters();
    renderServers();
    updateRegionFilterText();
}

function updateRegionFilterText() {
    const regionSelect = document.getElementById("region");
    if (regionSelect) {
        const options = regionSelect.options;
        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            if (opt.value === "all") opt.textContent = t('all_regions');
            if (opt.value === "ru") opt.textContent = t('russia');
            if (opt.value === "eu") opt.textContent = t('europe');
        }
    }
    
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.placeholder = t('search_placeholder');
    }
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

document.addEventListener("DOMContentLoaded", () => {
    renderAll();
    
    document.getElementById("region").onchange = (e) => { region = e.target.value; renderServers(); };
    document.getElementById("map-filter").onchange = (e) => { mapFilter = e.target.value; renderServers(); };
    document.getElementById("search").oninput = (e) => { q = e.target.value; renderServers(); };
    
    animateNumbers();
    updateLanguageButton();
});

// Добавляем стили для модального окна
const modalStyles = document.createElement('style');
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
        animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
        animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
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
    .btn-commands {
        background: var(--gradient-orange);
        border: none;
        color: var(--primary-fg);
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: 0.2s;
    }
    .btn-commands:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-orange);
    }
`;
document.head.appendChild(modalStyles);

function getFlagIcon(lang) {
    return lang === 'ru' ? '🇷🇺' : '🇺🇸';
}

function updateLanguageButton() {
    const btn = document.getElementById('lang-switch-btn');
    if (btn) {
        btn.innerHTML = currentLang === 'ru' ? 'EN' : 'RU';
    }
}
const SERVERS = [];
let serverId = 1;

for (let i = 1; i <= 10; i++) { SERVERS.push({ id: serverId++, name: `CS2RAGE | MIRAGE #${i}`, mode: "public", map: "de_mirage", region: "ru", city: "Москва", slots: 32, players: i === 1 ? 0 : 0, status: i === 1 ? "online" : "offline", ip: `45.95.31.15:${27415 + i - 1}` }); }
for (let i = 1; i <= 5; i++) { SERVERS.push({ id: serverId++, name: `CS2RAGE | DUST2 #${i}`, mode: "public", map: "de_dust2", region: "ru", city: "Москва", slots: 32, players: 0, status: "offline", ip: `45.95.31.15:${27425 + i - 1}` }); }
for (let i = 1; i <= 5; i++) { SERVERS.push({ id: serverId++, name: `CS2RAGE | CACHE #${i}`, mode: "public", map: "de_cache", region: "ru", city: "Москва", slots: 32, players: 0, status: "offline", ip: `45.95.31.15:${27430 + i - 1}` }); }
for (let i = 1; i <= 5; i++) { SERVERS.push({ id: serverId++, name: `CS2RAGE | AWP #${i}`, mode: "awp", map: "awp_lego", region: "ru", city: "Москва", slots: 20, players: 0, status: "offline", ip: `45.95.31.15:${27435 + i - 1}` }); }
for (let i = 1; i <= 5; i++) { SERVERS.push({ id: serverId++, name: `CS2RAGE | ARENA #${i}`, mode: "arena", map: "aim_redline", region: "ru", city: "Москва", slots: 16, players: 0, status: "offline", ip: `45.95.31.15:${27440 + i - 1}` }); }

const MODES_LIST = [
    { id: "public", name: "PUBLIC", desc: "Классические публичные серверы CS2 — основа проекта." },
    { id: "awp", name: "AWP", desc: "AWP-only арены для любителей снайперских дуэлей." },
    { id: "arena", name: "ARENA 1V1", desc: "Дуэли 1 на 1 с системой ротации арен." }
];

const MODE_COMMANDS = {
    public: [{ cmd: "!ws", desc: "Открыть меню скинов" },{ cmd: "!knife", desc: "Выбрать нож" },{ cmd: "!glove", desc: "Выбрать перчатки" },{ cmd: "!menu", desc: "Главное меню" },{ cmd: "!rank", desc: "Показать свой ранг" },{ cmd: "!top", desc: "Таблица лидеров" },{ cmd: "!votekick", desc: "Голосование за кик" },{ cmd: "!report", desc: "Пожаловаться" }],
    awp: [{ cmd: "!ws", desc: "Выбрать скин AWP" },{ cmd: "!knife", desc: "Выбрать нож" },{ cmd: "!duel", desc: "Вызвать на дуэль" },{ cmd: "!stats", desc: "Статистика дуэлей" }],
    arena: [{ cmd: "!ws", desc: "Выбрать скин" },{ cmd: "!knife", desc: "Выбрать нож" },{ cmd: "!accept", desc: "Принять дуэль" },{ cmd: "!decline", desc: "Отклонить дуэль" },{ cmd: "!stats", desc: "Статистика побед" }]
};

let currentMode = "public", region = "all", mapFilter = "all", searchQuery = "";

function countUp(el, target, duration) { duration = duration || 1000; let start = 0, startTime = null; function animate(ts) { if (!startTime) startTime = ts; let p = Math.min((ts - startTime) / duration, 1); el.textContent = Math.floor(p * target); if (p < 1) requestAnimationFrame(animate); else el.textContent = target; } requestAnimationFrame(animate); }
function typeWriter(el, html, speed, cb) { speed = speed || 15; let div = document.createElement('div'); div.innerHTML = html; let text = div.textContent; el.innerHTML = ''; let span = document.createElement('span'); el.appendChild(span); let i = 0; function type() { if (i < text.length) { span.textContent += text.charAt(i); i++; setTimeout(type, speed); } else { el.innerHTML = html; if (cb) cb(); } } type(); }
function showToast(m) { let t = document.createElement('div'); t.className = 'toast'; t.innerHTML = '<i class="fas fa-check-circle" style="color:var(--primary);"></i> ' + m; document.body.appendChild(t); setTimeout(function() { t.remove(); }, 3000); }
function copyToClipboard(ip) { navigator.clipboard.writeText('connect ' + ip); showToast('IP скопирован'); }
function connectToServer(ip) { location.href = 'steam://connect/' + ip; }

function showCommandsModal() {
    var cmds = MODE_COMMANDS[currentMode] || [];
    var name = MODES_LIST.find(function(x) { return x.id === currentMode; })?.name || currentMode;
    var h = '<div class="commands-modal" id="commands-modal"><div class="commands-modal-content"><div class="commands-modal-header"><h3><i class="fas fa-terminal"></i> ' + name + ' — Команды</h3><button class="commands-modal-close" id="close-modal-btn"><i class="fas fa-times"></i></button></div><div class="commands-list">' + cmds.map(function(c) { return '<div class="command-item"><span class="command-cmd">' + c.cmd + '</span><span class="command-desc">' + c.desc + '</span></div>'; }).join('') + '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', h);
    document.getElementById('close-modal-btn').onclick = function() { document.getElementById('commands-modal').remove(); };
    document.getElementById('commands-modal').onclick = function(e) { if (e.target === e.currentTarget) e.currentTarget.remove(); };
}

function renderHeroStats() {
    var o = SERVERS.reduce(function(s, x) { return s + x.players; }, 0);
    var t = SERVERS.length;
    document.getElementById('heroStats').innerHTML = '<div class="hero-stat"><b id="count-players">0</b><span>ИГРОКОВ</span></div><div class="hero-stat"><b id="count-servers">0</b><span>СЕРВЕРОВ</span></div><div class="hero-stat"><b>24/7</b><span>АПТАЙМ</span></div>';
    setTimeout(function() { countUp(document.getElementById('count-players'), o, 1000); countUp(document.getElementById('count-servers'), t, 800); }, 200);
}

function renderModeInfo() {
    var container = document.getElementById('modeInfoContainer');
    if (!container) return;
    var m = MODES_LIST.find(function(x) { return x.id === currentMode; });
    container.innerHTML = '<div class="mode-info-card"><div><h2><i class="fas fa-tachometer-alt"></i> ' + m.name + '</h2><p>' + m.desc + '</p></div><button class="btn-commands" id="modeCommandsBtn"><i class="fas fa-terminal"></i> Команды</button></div>';
    document.getElementById('modeCommandsBtn')?.addEventListener('click', showCommandsModal);
}

function renderModes() {
    document.getElementById('modesContainer').innerHTML = MODES_LIST.map(function(m) { return '<button class="mode-btn ' + (currentMode === m.id ? 'active' : '') + '" data-mode="' + m.id + '"><div class="name">' + m.name + '</div><div class="lbl">режим</div></button>'; }).join('');
    document.querySelectorAll('.mode-btn').forEach(function(b) { b.addEventListener('click', function() { currentMode = b.dataset.mode; mapFilter = "all"; renderModes(); renderModeInfo(); renderFilters(); renderServers(); }); });
}

function renderFilters() {
    var maps = [...new Set(SERVERS.filter(function(s) { return s.mode === currentMode; }).map(function(s) { return s.map; }))];
    document.getElementById('mapFilter').innerHTML = '<option value="all">Все карты</option>' + maps.map(function(m) { return '<option value="' + m + '">' + m.replace('de_', '').replace('awp_', '').replace('aim_', '').toUpperCase() + '</option>'; }).join('');
}

function getMapImage(map) {
    var images = {
        'de_mirage': 'images/mirage.png',
        'de_dust2': 'images/dust2.webp',
        'de_cache': 'images/cache.jpeg',
        'awp_lego': 'images/mirage.png',
        'aim_redline': 'images/mirage.png'
    };
    return images[map] || 'images/mirage.png';
}

function renderServers() {
    var servers = SERVERS.filter(function(s) { return s.mode === currentMode; });
    if (region !== 'all') servers = servers.filter(function(s) { return s.region === region; });
    if (mapFilter !== 'all') servers = servers.filter(function(s) { return s.map === mapFilter; });
    if (searchQuery.trim()) { var q = searchQuery.toLowerCase(); servers = servers.filter(function(s) { return s.name.toLowerCase().includes(q) || s.map.toLowerCase().includes(q); }); }
    var grouped = {};
    servers.forEach(function(s) { if (!grouped[s.map]) grouped[s.map] = []; grouped[s.map].push(s); });
    var c = document.getElementById('serversContainer');
    if (!Object.keys(grouped).length) { c.innerHTML = '<div style="text-align:center;padding:3rem;color:#8a8a8a;">😔 Серверов не найдено</div>'; return; }
    var h = '';
    for (var map in grouped) {
        var arr = grouped[map];
        var md = map.replace('de_', '').replace('awp_', '').replace('aim_', '').toUpperCase();
        var mapImg = getMapImage(map);
        h += '<div class="map-group"><div class="map-head"><h3>' + md + '</h3><span>(' + arr.length + ')</span></div><div class="servers-grid">';
        arr.forEach(function(s) {
            h += '<div class="server-card" style="padding:0;overflow:hidden;">' +
                '<div class="server-map-top" style="height:110px;overflow:hidden;background:rgba(0,0,0,0.5);">' +
                    '<img src="' + mapImg + '" alt="' + md + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.background=\'linear-gradient(135deg,#1a1a1a,#0f0f0f)\';this.style.display=\'none\';">' +
                '</div>' +
                '<div style="padding:0.7rem;">' +
                    '<div class="top"><div class="name">' + s.name + '</div><div><button class="btn-copy-ip" onclick="copyToClipboard(\'' + s.ip + '\')"><i class="fas fa-copy"></i></button><button class="btn-copy-ip" onclick="connectToServer(\'' + s.ip + '\')" style="margin-left:0.3rem;"><i class="fas fa-plug"></i></button></div></div>' +
                    '<div class="meta">' + md + ' · ' + s.city + '</div>' +
                    '<div class="players-bar"><div style="width:' + ((s.players/s.slots)*100) + '%;height:100%;background:var(--gradient-orange);border-radius:2px;"></div></div>' +
                    '<div class="players-info"><span>Игроки</span><span><b>' + s.players + '</b>/' + s.slots + '</span></div>' +
                    '<div class="server-status" style="font-size:0.6rem;color:' + (s.status==='online'?'#00c853':'#e34d4d') + ';">' + (s.status==='online'?'● Online':'● Offline') + '</div>' +
                '</div>' +
            '</div>';
        });
        h += '</div></div>';
    }
    c.innerHTML = h;
}

async function updateRealOnline() {
    try {
        var r = await fetch('/api/get-servers-status.php'); var d = await r.json();
        if (d.success && d.servers.length) {
            var sd = d.servers[0]; var idx = SERVERS.findIndex(function(s) { return s.id === 1; });
            if (idx !== -1) { SERVERS[idx].players = sd.players; SERVERS[idx].status = sd.status; SERVERS[idx].map = sd.map; SERVERS[idx].slots = sd.max_players || 32; }
            renderHeroStats(); renderServers();
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    renderHeroStats(); renderModeInfo(); renderModes(); renderFilters(); renderServers(); updateRealOnline();
    setInterval(updateRealOnline, 30000);
    
    var t = document.querySelector('.hero-text h1');
    var d = document.querySelector('.hero-text p');
    if (t) { var h = t.innerHTML; t.innerHTML = ''; setTimeout(function() { typeWriter(t, h, 15); }, 200); }
    if (d) { var txt = d.textContent; d.textContent = ''; setTimeout(function() { typeWriter(d, txt, 10); }, 700); }
    
    document.getElementById('heroCommandsBtn')?.addEventListener('click', showCommandsModal);
    document.getElementById('region').addEventListener('change', function(e) { region = e.target.value; renderServers(); });
    document.getElementById('mapFilter').addEventListener('change', function(e) { mapFilter = e.target.value; renderServers(); });
    document.getElementById('search').addEventListener('input', function(e) { searchQuery = e.target.value; renderServers(); });
});
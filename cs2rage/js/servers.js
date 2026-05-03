// Логика главной страницы — серверы, фильтры
let activeMode = "public";
let region = "all";
let mapFilter = "all";
let q = "";

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
      <div class="lbl">режим</div>
    </button>`;
  }).join("");
  el.querySelectorAll("button").forEach(b => b.onclick = () => {
    activeMode = b.dataset.mode; mapFilter = "all"; renderAll();
  });
}

function renderModeInfo() {
  const m = MODES.find(x => x.id === activeMode);
  document.getElementById("mode-info").innerHTML =
    `<h2>${m.name}</h2><p>${m.desc}</p>`;
}

function renderFilters() {
  const maps = [...new Set(modeServers().map(s => s.map))];
  document.getElementById("map-filter").innerHTML =
    `<option value="all">Все карты</option>` +
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
    <div class="players-info"><span>Игроки</span><span><b>${s.players}</b> / ${s.slots}</span></div>
    <button class="btn-connect" disabled>Сервер выключен</button>
  </div>`;
}

function renderServers() {
  const filtered = applyFilters();
  const wrap = document.getElementById("servers");
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
  document.getElementById("hero-stats").innerHTML = `
    <div class="stat"><b>${total}</b><span>Игроков</span></div>
    <div class="stat"><b>${SERVERS.length}</b><span>Серверов</span></div>
    <div class="stat"><b>24/7</b><span>Аптайм</span></div>
  `;
}

function renderAll() {
  renderModes();
  renderModeInfo();
  renderFilters();
  renderServers();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeroStats();
  renderAll();
  document.getElementById("region").onchange = (e) => { region = e.target.value; renderServers(); };
  document.getElementById("map-filter").onchange = (e) => { mapFilter = e.target.value; renderServers(); };
  document.getElementById("search").oninput = (e) => { q = e.target.value; renderServers(); };
});

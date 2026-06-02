// Скинченджер CS2RAGE
let cat = "rifles";
let weapon = "AK-47";
let skin = "Vulcan";
let pattern = 661;
let wear = 0.07;

function renderCats() {
  document.getElementById("cats").innerHTML = WEAPON_CATEGORIES.map(c =>
    `<button data-id="${c.id}" class="${c.id === cat ? "active" : ""}">${c.name}</button>`
  ).join("");
  document.querySelectorAll("#cats button").forEach(b => b.onclick = () => {
    cat = b.dataset.id;
    weapon = WEAPONS[cat][0];
    skin = skinsForWeapon(weapon)[0];
    renderAll();
  });
}

function renderWeapons() {
  document.getElementById("weapons").innerHTML = WEAPONS[cat].map(w =>
    `<div class="weapon ${w === weapon ? "active" : ""}" data-w="${w}">
      <div class="nm">${w}</div>
      <div class="sk">${skinsForWeapon(w).length} скинов</div>
    </div>`
  ).join("");
  document.querySelectorAll(".weapon").forEach(el => el.onclick = () => {
    weapon = el.dataset.w;
    skin = skinsForWeapon(weapon)[0];
    renderConfig();
    renderWeapons();
  });
}

function wearLabel(v) {
  if (v < 0.07) return "Factory New";
  if (v < 0.15) return "Minimal Wear";
  if (v < 0.38) return "Field-Tested";
  if (v < 0.45) return "Well-Worn";
  return "Battle-Scarred";
}

function renderConfig() {
  const skins = skinsForWeapon(weapon);
  document.getElementById("config").innerHTML = `
    <div class="field">
      <label>Оружие</label>
      <select id="sel-weapon">${WEAPONS[cat].map(w => `<option ${w === weapon ? "selected" : ""}>${w}</option>`).join("")}</select>
    </div>
    <div class="field">
      <label>Скин</label>
      <select id="sel-skin">${skins.map(s => `<option ${s === skin ? "selected" : ""}>${s}</option>`).join("")}</select>
    </div>
    <div class="field">
      <label>Паттерн (Seed)</label>
      <div style="display:flex;gap:10px;align-items:center;">
        <input id="inp-pattern" type="number" min="0" max="1000" value="${pattern}" style="flex:1;">
        <button class="btn-random" id="btn-random" title="Случайный паттерн"><i class="fas fa-dice"></i></button>
      </div>
      <div class="row-val"><span>От 0 до 1000</span><b id="pattern-display">Seed: ${pattern}</b></div>
    </div>
    <div class="field">
      <label>Износ (Float): <span id="float-value">${wear.toFixed(3)}</span></label>
      <div style="display:flex;gap:8px;align-items:center;">
        <input id="inp-wear-range" type="range" min="0" max="1000" value="${Math.round(wear * 1000)}" style="flex:1;">
        <input id="inp-wear-number" type="number" min="0" max="1" step="0.001" value="${wear.toFixed(3)}" style="width:80px;text-align:center;">
      </div>
      <div class="row-val"><span id="wear-label">${wearLabel(wear)}</span><b>${wear.toFixed(3)}</b></div>
    </div>
    <button class="btn-apply" id="btn-apply">
      Применить: <span id="apply-weapon">${weapon}</span> | <span id="apply-skin">${skin}</span> | seed <span id="apply-pattern">${pattern}</span> | float <span id="apply-float">${wear.toFixed(3)}</span>
    </button>
  `;

  // Обработчики
  document.getElementById("sel-weapon").onchange = (e) => { 
    weapon = e.target.value; 
    skin = skinsForWeapon(weapon)[0]; 
    renderConfig(); 
    renderWeapons(); 
  };
  
  document.getElementById("sel-skin").onchange = (e) => { 
    skin = e.target.value; 
    updateApplyButton();
  };

  // Паттерн - ручной ввод
  document.getElementById("inp-pattern").oninput = (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (val > 1000) val = 1000;
    pattern = val;
    document.getElementById("pattern-display").textContent = `Seed: ${pattern}`;
    updateApplyButton();
  };

  // Случайный паттерн
  document.getElementById("btn-random").onclick = () => {
    pattern = Math.floor(Math.random() * 1001);
    document.getElementById("inp-pattern").value = pattern;
    document.getElementById("pattern-display").textContent = `Seed: ${pattern}`;
    updateApplyButton();
  };

  // Износ - ползунок
  document.getElementById("inp-wear-range").oninput = (e) => {
    wear = parseInt(e.target.value) / 1000;
    syncWearInputs();
  };

  // Износ - ручной ввод
  document.getElementById("inp-wear-number").oninput = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 1) val = 1;
    wear = val;
    syncWearInputs();
  };

  // Кнопка применить
  document.getElementById("btn-apply").onclick = () => {
    alert(`✅ Применено!\n\nОружие: ${weapon}\nСкин: ${skin}\nПаттерн (Seed): ${pattern}\nИзнос (Float): ${wear.toFixed(3)} (${wearLabel(wear)})`);
  };
}

function syncWearInputs() {
  document.getElementById("inp-wear-range").value = Math.round(wear * 1000);
  document.getElementById("inp-wear-number").value = wear.toFixed(3);
  document.getElementById("float-value").textContent = wear.toFixed(3);
  document.getElementById("wear-label").textContent = wearLabel(wear);
  updateApplyButton();
}

function updateApplyButton() {
  document.getElementById("apply-weapon").textContent = weapon;
  document.getElementById("apply-skin").textContent = skin;
  document.getElementById("apply-pattern").textContent = pattern;
  document.getElementById("apply-float").textContent = wear.toFixed(3);
}

function renderAll() { renderCats(); renderWeapons(); renderConfig(); }

document.addEventListener("DOMContentLoaded", renderAll);
// Скинченджер
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
      <label>Паттерн (Seed): 0–1000</label>
      <input id="inp-pattern" type="number" min="0" max="1000" value="${pattern}">
    </div>
    <div class="field">
      <label>Износ (Float): 0.00 – 1.00</label>
      <input id="inp-wear" type="range" min="0" max="1" step="0.001" value="${wear}">
      <div class="row-val"><span>${wearLabel(wear)}</span><b>${wear.toFixed(3)}</b></div>
    </div>
    <button class="btn-apply" onclick="alert('Применено: ${weapon} | ${skin} | seed ${pattern} | float ${wear.toFixed(3)}')">Применить настройки</button>
  `;
  document.getElementById("sel-weapon").onchange = (e) => { weapon = e.target.value; skin = skinsForWeapon(weapon)[0]; renderConfig(); renderWeapons(); };
  document.getElementById("sel-skin").onchange   = (e) => { skin = e.target.value; };
  document.getElementById("inp-pattern").oninput = (e) => { pattern = +e.target.value; };
  document.getElementById("inp-wear").oninput    = (e) => { wear = +e.target.value; renderConfig(); };
}

function renderAll() { renderCats(); renderWeapons(); renderConfig(); }

document.addEventListener("DOMContentLoaded", renderAll);

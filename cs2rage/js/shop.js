// Рендер привилегий
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tiers").innerHTML = TIERS.map(t => `
    <div class="tier tier-${t.id} ${t.featured ? "featured" : ""}">
      ${t.featured ? `<span class="label-top">Топ выбор</span>` : ""}
      <div class="name">${t.name}</div>
      <div class="price">${t.price} ₽<small>/мес</small></div>
      <ul>${t.perks.map(p => `<li>${p}</li>`).join("")}</ul>
      <button class="buy" onclick="alert('Демо: оплата отключена.')">Купить</button>
    </div>
  `).join("");
});

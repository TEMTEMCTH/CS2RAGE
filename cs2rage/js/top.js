// Демо-таблица топа игроков (статика)
const TOP = [
  { rank: 1, nick: "RAGE_King", kills: 18432, deaths: 7211, kd: 2.55, hours: 1240 },
  { rank: 2, nick: "AwpMaster", kills: 15981, deaths: 7045, kd: 2.27, hours: 1102 },
  { rank: 3, nick: "MirageGod", kills: 14211, deaths: 6890, kd: 2.06, hours: 980 },
  { rank: 4, nick: "ShadowOne", kills: 12877, deaths: 6710, kd: 1.92, hours: 905 },
  { rank: 5, nick: "ColdBlood", kills: 11540, deaths: 6233, kd: 1.85, hours: 870 },
  { rank: 6, nick: "RushB_Boy", kills: 10999, deaths: 6512, kd: 1.69, hours: 802 },
  { rank: 7, nick: "Phoenix77", kills: 9876,  deaths: 6011, kd: 1.64, hours: 750 },
  { rank: 8, nick: "Dust2Lord", kills: 9322,  deaths: 5874, kd: 1.59, hours: 712 },
  { rank: 9, nick: "NoScopeRu", kills: 8954,  deaths: 5901, kd: 1.52, hours: 690 },
  { rank: 10, nick: "FlashBang", kills: 8412, deaths: 5712, kd: 1.47, hours: 668 },
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("top-body").innerHTML = TOP.map(p => `
    <tr>
      <td class="rank">#${p.rank}</td>
      <td><b>${p.nick}</b></td>
      <td>${p.kills.toLocaleString("ru")}</td>
      <td>${p.deaths.toLocaleString("ru")}</td>
      <td>${p.kd.toFixed(2)}</td>
      <td>${p.hours} ч</td>
    </tr>
  `).join("");
});

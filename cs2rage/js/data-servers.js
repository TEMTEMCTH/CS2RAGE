// Данные серверов CS2RAGE — все серверы OFFLINE, отображается реальный онлайн = 0
const MODES = [
  { id: "public", name: "Public", desc: "Классические публичные серверы CS2 — основа проекта." },
  { id: "awp", name: "AWP", desc: "AWP-only арены для любителей снайперских дуэлей." },
  { id: "arena", name: "Arena 1v1", desc: "Дуэли 1 на 1 с системой ротации арен." },
];

// Карты для каждого режима. Mirage в Public получает 10 серверов, остальные — 3-4
const MAPS = {
  public:   ["de_mirage", "de_dust2", "de_inferno", "de_nuke"],
  awp:      ["awp_lego", "awp_india", "awp_dust"],
  arena:    ["aim_redline", "aim_map", "aim_botz"],
};

// Генерация серверов
const REGIONS = ["ru", "eu"];
const CITIES = { ru: ["Москва", "СПб"], eu: ["Frankfurt", "Amsterdam"] };
const SLOTS_BY_MODE = { public: 32, awp: 20, minigame: 24, jail: 28, arena: 16 };

const SERVERS = [];
let id = 1;
for (const mode of Object.keys(MAPS)) {
  for (const map of MAPS[mode]) {
    // 10 серверов только для Mirage в Public, иначе 3-4
    let count;
    if (mode === "public" && map === "de_mirage") count = 10;
    else count = 3 + Math.floor(Math.random() * 2); // 3 или 4
    for (let i = 1; i <= count; i++) {
      const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
      const city = CITIES[region][Math.floor(Math.random() * CITIES[region].length)];
      SERVERS.push({
        id: id++,
        name: `CS2RAGE | ${mode.toUpperCase()} #${i}`,
        mode,
        map,
        region,
        city,
        slots: SLOTS_BY_MODE[mode],
        players: 0,       // реальный онлайн
        status: "offline" // все OFFLINE
      });
    }
  }
}

// Реальный общий онлайн — сумма по всем серверам (= 0, поскольку все OFFLINE)
const TOTAL_ONLINE = SERVERS.reduce((a, s) => a + s.players, 0);

const mapLabel = (m) => m.replace(/^[a-z]+_/, "").replace(/_/g, " ").toUpperCase();



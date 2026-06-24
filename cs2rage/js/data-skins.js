// Каталог скинов для скинченджера 
const WEAPON_CATEGORIES = [
  { id: "rifles",   name: "Винтовки" },
  { id: "snipers",  name: "Снайперки" },
  { id: "pistols",  name: "Пистолеты" },
  { id: "smgs",     name: "Пистолеты-пулемёты" },
  { id: "heavy",    name: "Тяжёлое" },
  { id: "knives",   name: "Ножи" },
  { id: "gloves",   name: "Перчатки" },
];

const WEAPONS = {
  rifles:  ["AK-47","M4A4","M4A1-S","Galil AR","FAMAS","SG 553","AUG"],
  snipers: ["AWP","SSG 08","SCAR-20","G3SG1"],
  pistols: ["Desert Eagle","USP-S","Glock-18","P250","Tec-9","Five-SeveN","CZ75-Auto","Dual Berettas","R8 Revolver"],
  smgs:    ["MP9","MAC-10","MP7","UMP-45","P90","PP-Bizon","MP5-SD"],
  heavy:   ["Nova","XM1014","Sawed-Off","MAG-7","M249","Negev"],
  knives:  ["Karambit","M9 Bayonet","Butterfly Knife","Bayonet","Talon Knife","Skeleton Knife","Stiletto Knife","Huntsman Knife"],
  gloves:  ["Sport Gloves","Driver Gloves","Specialist Gloves","Hand Wraps","Moto Gloves","Bloodhound Gloves","Hydra Gloves","Broken Fang Gloves"],
};

const SKINS_BY_WEAPON = {
  "AK-47": ["Vulcan","Redline","Asiimov","Neon Rider","Fire Serpent","Bloodsport","Wild Lotus","Case Hardened"],
  "M4A4":  ["Howl","Asiimov","Neo-Noir","The Emperor","Buzz Kill","In Living Color"],
  "M4A1-S":["Hyper Beast","Printstream","Welcome to the Jungle","Cyrex","Player Two"],
  "AWP":   ["Dragon Lore","Asiimov","Wildfire","Neo-Noir","Lightning Strike","Containment Breach","Medusa"],
  "Desert Eagle":["Blaze","Printstream","Code Red","Kumicho Dragon","Mecha Industries"],
  "USP-S": ["Kill Confirmed","Cortex","Neo-Noir","Printstream"],
  "Glock-18":["Fade","Water Elemental","Neo-Noir","Bullet Queen"],
  "Karambit":["Doppler","Fade","Marble Fade","Tiger Tooth","Crimson Web","Slaughter"],
  "M9 Bayonet":["Doppler","Fade","Crimson Web","Tiger Tooth","Marble Fade"],
  "Butterfly Knife":["Fade","Doppler","Tiger Tooth","Marble Fade","Slaughter"],
  "Sport Gloves":["Pandora's Box","Vice","Hedge Maze","Omega","Superconductor","Slingshot"],
  "Driver Gloves":["King Snake","Crimson Weave","Lunar Weave","Imperial Plaid"],
  "Specialist Gloves":["Crimson Kimono","Tiger Strike","Fade","Marble Fade","Emerald Web"],
};
const DEFAULT_SKINS = ["Stock","Safari Mesh","Forest Leaves","Urban DDPAT","Boreal Forest","Anodized Navy"];

const skinsForWeapon = (w) => SKINS_BY_WEAPON[w] || DEFAULT_SKINS;

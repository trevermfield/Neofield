// Art for the Neofield Mons. Tyler's finished designs live in www/mons/<id>.png and are listed in MON_PICS.
// Everything else shows a placeholder: a type-colored silhouette with a question mark.
import {SPECIES, BOSS_SPECIES} from './regional.js';

const TYPE_COLORS = {
  Normal: '#b8b29a', Fire: '#f08a4b', Water: '#5f9cf0', Electric: '#f2d04a', Grass: '#72c25a', Ice: '#86d8ec',
  Fighting: '#d0574b', Poison: '#b06ee0', Ground: '#d9b45f', Flying: '#a6a4f2', Psychic: '#f2668f', Bug: '#a8bd36',
  Rock: '#c2a95c', Ghost: '#7f6bb0', Dragon: '#7b63f2', Dark: '#8a7466', Steel: '#9fb3d4', Fairy: '#ee9ad0',
};

function placeholder(st) {
  const c1 = TYPE_COLORS[st.types[0]] || '#9aa3b2', c2 = TYPE_COLORS[st.types[1]] || c1;
  const gid = 'ph' + st.id;
  const scale = [0.78, 0.9, 1][st.stage] || 1;
  return `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
    <ellipse cx="60" cy="108" rx="${30 * scale}" ry="5" fill="#000" opacity=".18"/>
    <g transform="translate(60 64) scale(${scale}) translate(-60 -64)">
      <path d="M60 18 C86 18 98 40 96 64 C94 92 80 106 60 106 C40 106 26 92 24 64 C22 40 34 18 60 18Z" fill="url(#${gid})" opacity=".9" stroke="#1b1f2a" stroke-width="3"/>
      <ellipse cx="48" cy="38" rx="12" ry="7" fill="#fff" opacity=".3"/>
      <text x="60" y="80" text-anchor="middle" font-family="sans-serif" font-size="44" font-weight="900" fill="#fff" stroke="#1b1f2a" stroke-width="2.5" paint-order="stroke">?</text>
    </g>`;
}

// id (the name in lowercase, letters and numbers only) -> picture
export const MON_PICS = Object.fromEntries([
  'bulbazoid',
  'ivyzoid',
  'venuzoid',
  'shardmander',
  'shardmeleon',
  'shardizar',
  'grrtle',
  'roartortle',
  'bellowtoise',
  'eggyhen',
  'leggyhen',
  'sycasqeek',
  'sycamage',
  'zapybara',
  'bloogilp',
  'poseigunk',
  'yucrane',
  'bizon',
  'werebizon',
  'riptome',
  'ripblok',
  'ripgool',
  'campyre',
  'bonpyre',
  'maraudur',
  'maraudoom',
  'icerpent',
  'coldbra',
  'marooner',
  'weldonrust',
  'noterish',
  'damerish',
  'pinedale',
  'broncho',
  'coltmare',
  'mugnbud',
  'nidomonk',
  'chetswatch',
  'banchief',
  'cryodon',
  'rimeocerus',
  'wyrmie',
  'wyrmpod',
  'wyrmega',
  'nivalux',
  'storment',
  'rensylk',
  'okloyama',
  'hexabeake',
  'aerialyn',
  'chemo', 'fatigue', 'fear', 'pain', 'isolation', 'relapse',
].map(id => [id, `mons/${id}.png`]));

export function monArt(id, cls = '') {
  const st = SPECIES.find(s => s.id === id) || BOSS_SPECIES.find(s => s.id === id);
  if (!st) return '';
  const pic = MON_PICS[id];
  if (pic) return `<img class="monart monpic ${cls}" src="${pic}" alt="" aria-hidden="true" draggable="false">`;
  return `<svg class="monart ${cls}" viewBox="0 0 120 120" aria-hidden="true">${placeholder(st)}</svg>`;
}
export const hasArt = id => SPECIES.some(s => s.id === id) || BOSS_SPECIES.some(s => s.id === id);

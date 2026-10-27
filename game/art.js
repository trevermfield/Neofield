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
  'missingno',
  'chemo', 'fatigue', 'fear', 'pain', 'loneliness', 'relapse',
].map(id => [id, `mons/${id}.png`]));

// Lustrous (alternate-colour) pictures: www/mons/lustrous/<id>.png. Only Mons listed here can turn up Lustrous.
export const LUSTROUS_PICS = new Set(['campyre']);
export const hasLustrous = id => LUSTROUS_PICS.has(id);
export function monArt(id, cls = '', lus = false) {
  const st = SPECIES.find(s => s.id === id) || BOSS_SPECIES.find(s => s.id === id);
  if (!st) return '';
  const pic = lus && LUSTROUS_PICS.has(id) ? `mons/lustrous/${id}.png` : MON_PICS[id];
  if (pic) return `<img class="monart monpic ${cls}" src="${pic}" alt="" aria-hidden="true" draggable="false">`;
  return `<svg class="monart ${cls}" viewBox="0 0 120 120" aria-hidden="true">${placeholder(st)}</svg>`;
}
export const hasArt = id => SPECIES.some(s => s.id === id) || BOSS_SPECIES.some(s => s.id === id);

// Mega, regional and other forms that have their own picture (www/dex/f/<id>.webp); all other forms use their base Mon's picture
export const FORM_ART = new Set(["abomasnowmega", "absolmega", "aegislashblade", "aerodactylmega", "aggronmega", "alakazammega", "altariamega", "ampharosmega", "arcaninehisui", "arceusbug", "arceusdark", "arceusdragon", "arceuselectric", "arceusfairy", "arceusfighting", "arceusfire", "arceusflying", "arceusghost", "arceusgrass", "arceusground", "arceusice", "arceuspoison", "arceuspsychic", "arceusrock", "arceussteel", "arceuswater", "articunogalar", "audinomega", "avalugghisui", "banettemega", "basculegionf", "basculinbluestriped", "basculinwhitestriped", "beedrillmega", "blastoisemega", "blazikenmega", "braviaryhisui", "burmysandy", "burmytrash", "calyrexice", "calyrexshadow", "cameruptmega", "castformrainy", "castformsnowy", "castformsunny", "charizardmegax", "charizardmegay", "cherrimsunshine", "corsolagalar", "cramorantgorging", "cramorantgulping", "darmanitangalar", "darmanitangalarzen", "darmanitanzen", "darumakagalar", "decidueyehisui", "deerlingautumn", "deerlingsummer", "deerlingwinter", "deoxysattack", "deoxysdefense", "deoxysspeed", "dialgaorigin", "dianciemega", "diglettalola", "dudunsparcethreesegment", "dugtrioalola", "eiscuenoice", "electrodehisui", "enamorustherian", "eternatuseternamax", "exeggutoralola", "farfetchdgalar", "floetteeternal", "gallademega", "garchompmega", "gardevoirmega", "gastrodoneast", "genesectburn", "genesectchill", "genesectdouse", "genesectshock", "gengarmega", "geodudealola", "gimmighoulroaming", "giratinaorigin", "glaliemega", "golemalola", "goodrahisui", "gourgeistlarge", "gourgeistsmall", "gourgeistsuper", "graveleralola", "greninjaash", "greninjabond", "grimeralola", "groudonprimal", "growlithehisui", "gyaradosmega", "heracrossmega", "hoopaunbound", "houndoommega", "indeedeef", "kangaskhanmega", "keldeoresolute", "kyogreprimal", "kyuremblack", "kyuremwhite", "landorustherian", "latiasmega", "latiosmega", "lilliganthisui", "linoonegalar", "lopunnymega", "lucariomega", "lycanrocdusk", "lycanrocmidnight", "magearnaoriginal", "manectricmega", "marowakalola", "mawilemega", "medichammega", "meloettapirouette", "meowsticf", "meowthalola", "meowthgalar", "metagrossmega", "mewtwomegax", "mewtwomegay", "mimikyubusted", "miniorblue", "miniorgreen", "miniorindigo", "miniororange", "miniorviolet", "minioryellow", "moltresgalar", "morpekohangry", "mrmimegalar", "mukalola", "necrozmadawnwings", "necrozmaduskmane", "necrozmaultra", "ninetalesalola", "ogerponcornerstone", "ogerponhearthflame", "ogerponwellspring", "oinkolognef", "oricoriopau", "oricoriopompom", "oricoriosensu", "palafinhero", "palkiaorigin", "persianalola", "pichuspikyeared", "pidgeotmega", "pikachualola", "pikachubelle", "pikachucosplay", "pikachuhoenn", "pikachukalos", "pikachulibre", "pikachuoriginal", "pikachupartner", "pikachuphd", "pikachupopstar", "pikachurockstar", "pikachusinnoh", "pikachuunova", "pikachuworld", "pinsirmega", "poltchageistartisan", "polteageistantique", "ponytagalar", "pumpkaboolarge", "pumpkaboosmall", "pumpkaboosuper", "qwilfishhisui", "raichualola", "rapidashgalar", "raticatealola", "rattataalola", "rayquazamega", "rotomfan", "rotomfrost", "rotomheat", "rotommow", "rotomwash", "sableyemega", "salamencemega", "samurotthisui", "sandshrewalola", "sandslashalola", "sceptilemega", "scizormega", "sharpedomega", "shayminsky", "shelloseast", "silvallybug", "silvallydark", "silvallydragon", "silvallyelectric", "silvallyfairy", "silvallyfighting", "silvallyfire", "silvallyflying", "silvallyghost", "silvallygrass", "silvallyground", "silvallyice", "silvallypoison", "silvallypsychic", "silvallyrock", "silvallysteel", "silvallywater", "sinistchamasterpiece", "sinisteaantique", "sliggoohisui", "slowbrogalar", "slowbromega", "slowkinggalar", "slowpokegalar", "sneaselhisui", "squawkabillyblue", "squawkabillywhite", "squawkabillyyellow", "steelixmega", "stunfiskgalar", "swampertmega", "tatsugiridroopy", "tatsugiristretchy", "taurospaldeaaqua", "taurospaldeablaze", "taurospaldeacombat", "terapagosstellar", "terapagosterastal", "thundurustherian", "tornadustherian", "toxtricitylowkey", "typhlosionhisui", "tyranitarmega", "ursalunabloodmoon", "urshifurapidstrike", "venusaurmega", "vivillonarchipelago", "vivilloncontinental", "vivillonelegant", "vivillonfancy", "vivillongarden", "vivillonhighplains", "vivillonicysnow", "vivillonjungle", "vivillonmarine", "vivillonmodern", "vivillonmonsoon", "vivillonocean", "vivillonpokeball", "vivillonpolar", "vivillonriver", "vivillonsandstorm", "vivillonsavanna", "vivillonsun", "vivillontundra", "voltorbhisui", "vulpixalola", "weezinggalar", "wishiwashischool", "wooperpaldea", "wormadamsandy", "wormadamtrash", "yamaskgalar", "zaciancrowned", "zamazentacrowned", "zapdosgalar", "zarudedada", "zigzagoongalar", "zoroarkhisui", "zoruahisui", "zygarde10", "zygardecomplete"]);

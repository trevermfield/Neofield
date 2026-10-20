// Battle Hall helpers: level-matched gym teams for an Adventure team, and the data behind Build Your Own Team.
import {Dex, Teams, TeamValidator} from '@pkmn/sim';
import {parseSets, setAtLevel} from './adventure.js';
import {SPECIES as NEO_SPECIES, isRegional} from './regional.js';

const FORMAT = 'gen9nationaldexubers';
const dex = Dex.forFormat(FORMAT);
const toID = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const usable = x => x && x.exists && (!x.isNonstandard || x.isNonstandard === 'Past');

// ---------- level matching ----------

// n levels that add up to `total`, each within a couple of levels of the average.
export function spreadLevels(total, n) {
  if (n <= 0) return [];
  const base = Math.floor(total / n);
  const lv = Array.from({length: n}, () => base);
  for (let i = 0; i < total - base * n; i++) lv[i % n]++;
  // nudge pairs apart a little so they're close but not identical; the sum never changes
  for (let i = 0; i + 1 < n; i += 2) {
    const d = Math.floor(Math.random() * 3); // 0..2
    if (lv[i] + d <= 100 && lv[i + 1] - d >= 1) { lv[i] += d; lv[i + 1] -= d; }
  }
  return lv.map(l => Math.max(1, Math.min(100, l))).sort((a, b) => b - a);
}

const strength = set => {
  const sp = dex.species.get(set.species);
  const mega = dex.items.get(set.item).megaStone;
  return (sp.bst || 0) + (mega ? 100 : 0);
};

// A gym leader's team scaled to face a team of the given levels: the same number of Mons
// (their strongest), with the same total level. Stronger Mons get the higher levels.
export function matchedLeaderSets(teamText, playerLevels) {
  const n = Math.min(6, playerLevels.length);
  const total = playerLevels.slice(0, n).reduce((a, b) => a + b, 0);
  const all = parseSets(teamText);
  const picked = all.map((s, i) => ({s, i, str: strength(s)})).sort((a, b) => b.str - a.str).slice(0, n);
  const levels = spreadLevels(total, n);
  picked.forEach((p, k) => { p.level = levels[k]; });
  // keep the leader's original order so their usual lead still goes first
  return picked.sort((a, b) => a.i - b.i).map(p => setAtLevel(p.s, p.level, {leader: true}));
}

// ---------- Build Your Own Team ----------

let poolCache = null;
// Every Mon you can pick: Neofield first, then the main games in National Dex order.
export function speciesPool() {
  if (poolCache) return poolCache;
  const neo = NEO_SPECIES.map(s => {
    const sp = dex.species.get(s.name);
    return {id: sp.id, name: sp.name, num: s.num, types: sp.types, neo: true, final: !sp.nfe, bst: sp.bst};
  });
  const main = dex.species.all().filter(sp => usable(sp) && sp.num > 0 && !sp.battleOnly && !sp.isMega && !sp.isPrimal
      && !/Totem|Gmax/.test(sp.forme || '') && !isRegional(sp.name))
    .sort((a, b) => a.num - b.num || (a.forme ? 1 : 0) - (b.forme ? 1 : 0) || a.name.localeCompare(b.name))
    .map(sp => ({id: sp.id, name: sp.name, num: sp.num, types: sp.types, neo: false, final: !sp.nfe, bst: sp.bst}));
  poolCache = [...neo, ...main];
  return poolCache;
}

function learnsetIds(sp) {
  const out = new Set();
  const seen = new Set();
  const visit = s => {
    if (!s || !s.exists || seen.has(s.id)) return;
    seen.add(s.id);
    const data = dex.data.Learnsets[s.id];
    if (data && data.learnset) for (const m of Object.keys(data.learnset)) out.add(m);
    if (s.prevo) visit(dex.species.get(s.prevo));
    if (s.changesFrom) visit(dex.species.get(s.changesFrom));
    if (s.baseSpecies && s.baseSpecies !== s.name) visit(dex.species.get(s.baseSpecies));
  };
  visit(sp);
  return out;
}

// Moves this Mon can learn, sorted by type then name.
export function learnableMoves(speciesName) {
  const sp = dex.species.get(speciesName);
  const v = isRegional(sp.name) ? null : TeamValidator.get(FORMAT);
  return [...learnsetIds(sp)].map(id => dex.moves.get(id)).filter(m => usable(m) && !m.isZ && !m.isMax)
    .filter(m => !v || !v.checkCanLearn(m, sp))
    .map(m => ({name: m.name, type: m.type, category: m.category, power: m.basePower, accuracy: m.accuracy === true ? null : m.accuracy, desc: m.shortDesc || m.desc}))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const POPULAR_ITEMS = ['Leftovers', 'Life Orb', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Focus Sash', 'Heavy-Duty Boots',
  'Assault Vest', 'Rocky Helmet', 'Eviolite', 'Sitrus Berry', 'Lum Berry', 'Expert Belt', 'Black Sludge', 'Weakness Policy',
  'Air Balloon', 'Light Clay', 'Booster Energy', 'Loaded Dice', 'Covert Cloak'];

// Items for this Mon: its own Mega Stone or signature item first, then the popular ones, then everything else.
export function itemsFor(speciesName) {
  const sp = dex.species.get(speciesName);
  const base = sp.baseSpecies;
  const all = dex.items.all().filter(it => usable(it) && !it.isPokeball && !it.zMove && !it.isGem);
  const own = all.filter(it => (it.megaStone && (it.megaEvolves === base || it.megaEvolves === sp.name))
    || (it.itemUser && it.itemUser.includes(sp.name)));
  const ownIds = new Set(own.map(i => i.id));
  const pop = POPULAR_ITEMS.map(n => dex.items.get(n)).filter(it => usable(it) && !ownIds.has(it.id));
  const popIds = new Set(pop.map(i => i.id));
  const rest = all.filter(it => !ownIds.has(it.id) && !popIds.has(it.id) && !it.megaStone && !it.itemUser)
    .sort((a, b) => a.name.localeCompare(b.name));
  const view = it => ({name: it.name, desc: it.shortDesc || it.desc || ''});
  return {own: own.map(view), popular: pop.map(view), other: rest.map(view)};
}

export function abilitiesFor(speciesName) {
  const sp = dex.species.get(speciesName);
  return Object.entries(sp.abilities).map(([k, name]) => ({name, hidden: k === 'H', desc: (dex.abilities.get(name).shortDesc || '')}));
}

export const NATURES = () => dex.natures.all().map(n => ({name: n.name, plus: n.plus || '', minus: n.minus || ''}));

export const SPREADS = {
  physical: {label: 'Attack and Speed', evs: {atk: 252, spe: 252, hp: 4}},
  special: {label: 'Sp. Atk and Speed', evs: {spa: 252, spe: 252, hp: 4}},
  bulkyPhys: {label: 'HP and Attack', evs: {hp: 252, atk: 252, spd: 4}},
  bulkySpec: {label: 'HP and Sp. Atk', evs: {hp: 252, spa: 252, spd: 4}},
  wallDef: {label: 'HP and Defense', evs: {hp: 252, def: 252, spd: 4}},
  wallSpd: {label: 'HP and Sp. Def', evs: {hp: 252, spd: 252, def: 4}},
};

// Pick a sensible nature and stat training from the Mon and its moves.
export function autoSpread(speciesName, moves) {
  const sp = dex.species.get(speciesName);
  const ms = (moves || []).map(m => dex.moves.get(m)).filter(m => m.exists);
  const phys = ms.filter(m => m.category === 'Physical').length, spec = ms.filter(m => m.category === 'Special').length;
  const fast = sp.baseStats.spe >= 80;
  if (!phys && !spec) {
    const def = sp.baseStats.def >= sp.baseStats.spd;
    return {spread: def ? 'wallDef' : 'wallSpd', nature: def ? 'Bold' : 'Calm'};
  }
  const physical = phys > spec || (phys === spec && sp.baseStats.atk >= sp.baseStats.spa);
  if (physical) return fast ? {spread: 'physical', nature: 'Jolly'} : {spread: 'bulkyPhys', nature: 'Adamant'};
  return fast ? {spread: 'special', nature: 'Timid'} : {spread: 'bulkySpec', nature: 'Modest'};
}

// A full set from what the builder stores: {species, ability, item, moves, nature?, spread?}
export function builtSet(m) {
  const auto = autoSpread(m.species, m.moves);
  const spread = SPREADS[m.spread] || SPREADS[auto.spread];
  const nature = m.nature || auto.nature;
  const sp = dex.species.get(m.species);
  const physOnly = !(m.moves || []).some(x => dex.moves.get(x).category === 'Special');
  return {
    name: sp.name, species: sp.name, ability: m.ability || Object.values(sp.abilities)[0], item: m.item || '',
    moves: (m.moves || []).filter(Boolean), nature, evs: m.evs && !m.spread ? {...m.evs} : {...spread.evs}, level: 100,
    ivs: {hp: 31, atk: physOnly || (m.moves || []).some(x => /^(foulplay)$/.test(toID(x))) ? 31 : 0, def: 31, spa: 31, spd: 31, spe: 31},
  };
}

// Problems with a team, as plain sentences, or [] when it is legal.
export function checkTeam(sets) {
  const problems = [];
  if (!sets.length) return ['Add at least one Mon.'];
  const neo = sets.filter(s => isRegional(s.species));
  const main = sets.filter(s => !isRegional(s.species));
  sets.forEach(s => { if (!s.moves.length) problems.push(`${s.species} needs at least one move.`); });
  if (main.length) {
    const v = TeamValidator.get(FORMAT);
    const r = v.validateTeam(main.map(s => ({...s})), {removeNicknames: false});
    if (r) problems.push(...r.filter(p => !/must contain at least|your team has fewer/i.test(p)));
  }
  const counts = {};
  for (const s of sets) { const b = dex.species.get(s.species).baseSpecies; counts[b] = (counts[b] || 0) + 1; }
  for (const [b, c] of Object.entries(counts)) if (c > 1) problems.push(`You can only have one ${b}.`);
  for (const s of neo) {
    const ok = learnsetIds(dex.species.get(s.species));
    for (const mv of s.moves) if (!ok.has(toID(mv))) problems.push(`${s.species} can't learn ${mv}.`);
  }
  return [...new Set(problems)];
}

export function setsToText(sets) { return Teams.export(sets); }

const AWKWARD = new Set(['hyperbeam', 'gigaimpact', 'blastburn', 'frenzyplant', 'hydrocannon', 'rockwrecker', 'roaroftime', 'prismaticlaser',
  'eternabeam', 'meteorassault', 'selfdestruct', 'explosion', 'mistyexplosion', 'lastresort', 'dreameater', 'focuspunch', 'belch',
  'synchronoise', 'steelbeam', 'shelltrap', 'mindblown', 'solarbeam', 'solarblade', 'skyattack', 'skullbash', 'razorwind', 'bide', 'fly', 'dig',
  'dive', 'bounce', 'phantomforce', 'shadowforce', 'freezeshock', 'iceburn', 'futuresight', 'doomdesire', 'fling', 'naturalgift',
  'hiddenpower', 'snore', 'sleeptalk', 'counter', 'mirrorcoat', 'metalburst', 'endeavor', 'present', 'magnitude', 'beatup', 'spitup',
  'trumpcard', 'wringout', 'crushgrip', 'punishment', 'storedpower', 'powertrip', 'electroball', 'gyroball', 'grassknot', 'lowkick',
  'heavyslam', 'heatcrash', 'return', 'frustration', 'reversal', 'flail', 'eruption', 'waterspout', 'dragonenergy', 'uproar', 'thrash',
  'outrage', 'petaldance', 'ragingfury']);
// Four starting moves: strong, accurate attacks of different types, its own types first.
export function suggestMoves(speciesName) {
  const sp = dex.species.get(speciesName);
  const physical = sp.baseStats.atk >= sp.baseStats.spa;
  const scored = learnableMoves(speciesName).filter(m => m.category !== 'Status' && m.power > 0 && !AWKWARD.has(toID(m.name)))
    .map(m => ({m, score: m.power * (sp.types.includes(m.type) ? 1.5 : 1) * ((m.accuracy || 100) / 100) * ((m.category === 'Physical') === physical ? 1.25 : 0.8)}))
    .sort((a, b) => b.score - a.score);
  const out = [], types = new Set();
  for (const {m} of scored) { if (types.has(m.type)) continue; out.push(m.name); types.add(m.type); if (out.length === 4) break; }
  return out;
}

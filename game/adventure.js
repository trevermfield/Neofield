// Adventure mode: evolution chains, level-up moves, wild Mons and scaled teams.
// All evolution levels and level-up moves come from Showdown's data, which mirrors the games.
import {Dex, Teams} from '@pkmn/sim';
import {ROUTES, familyOf, FAMILIES} from './regional.js';

const dex = Dex.forFormat('gen9nationaldexubers');
const toID = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Level at which a species is reached from its pre-evolution. Non-level methods
// (stones, trades, friendship) get a sensible level so everything evolves eventually.
const METHOD_LEVEL = {useItem: 30, trade: 36, levelFriendship: 22, levelHold: 34, levelMove: 32, levelExtra: 30, other: 32};
export function evoAt(species) {
  const sp = typeof species === 'string' ? dex.species.get(species) : species;
  if (!sp.prevo) return 1;
  if (sp.evoLevel) return sp.evoLevel;
  return METHOD_LEVEL[sp.evoType] || 30;
}

// [base, ..., final] following pre-evolutions back from the final species
export function chainOf(speciesName) {
  let sp = dex.species.get(speciesName);
  if (sp.battleOnly && sp.baseSpecies !== sp.name) sp = dex.species.get(sp.baseSpecies); // megas etc.
  const chain = [sp];
  while (sp.prevo) { sp = dex.species.get(sp.prevo); chain.unshift(sp); }
  // keep evolution levels increasing (a few stone/trade evolutions would otherwise come too early)
  let last = 0;
  return chain.map(s => { const at = Math.max(evoAt(s), last + (s.prevo ? 1 : 0)); last = at; return {sp: s, at}; });
}
export function stageAt(chain, level) {
  let idx = 0;
  for (let i = 1; i < chain.length; i++) { if (level >= chain[i].at) idx = i; else break; }
  return idx;
}

function learnsetOf(sp) {
  for (const id of [sp.id, toID(sp.changesFrom), toID(sp.baseSpecies)]) {
    const ls = id && dex.data.Learnsets[id];
    if (ls && ls.learnset) return ls.learnset;
  }
  return {};
}
// Level-up moves from the most recent game the species appears in: [{id, level}]
const lvlCache = new Map();
export function levelMoves(sp, evolvedAt = 1) {
  if (lvlCache.has(sp.id)) return lvlCache.get(sp.id);
  const ls = learnsetOf(sp);
  let gen = 0;
  for (const srcs of Object.values(ls)) for (const s of srcs) { const m = /^(\d)L\d+$/.exec(s); if (m) gen = Math.max(gen, +m[1]); }
  const out = [];
  for (const [id, srcs] of Object.entries(ls)) {
    const s = srcs.find(x => x.startsWith(gen + 'L'));
    if (!s) continue;
    const mv = dex.moves.get(id);
    if (!mv.exists || mv.isNonstandard === 'Unobtainable' || mv.isZ || mv.isMax) continue;
    let lv = +s.slice(2);
    if (lv === 0) lv = evolvedAt; // learned on evolution
    out.push({id, level: Math.max(1, lv)});
  }
  out.sort((a, b) => a.level - b.level);
  lvlCache.set(sp.id, out);
  return out;
}
// Can this chain (up to stage idx) learn the move by any method in any game?
export function canLearn(chain, idx, moveId) {
  for (let i = 0; i <= idx; i++) if (learnsetOf(chain[i].sp)[moveId]) return true;
  return false;
}
// Moves known by level: union over the chain up to the current stage
function pool(chain, idx, level) {
  const best = new Map();
  for (let i = 0; i <= idx; i++) {
    for (const m of levelMoves(chain[i].sp, chain[i].at)) {
      if (m.level > level) continue;
      const prev = best.get(m.id);
      if (!prev || m.level > prev) best.set(m.id, m.level);
    }
  }
  return [...best.entries()].map(([id, lv]) => ({id, level: lv})).sort((a, b) => b.level - a.level);
}
const isAttack = id => dex.moves.get(id).category !== 'Status';

// Pick up to 4 moves: the battle-set moves it can know now come first, then its newest attacks.
function pickMoves(chain, idx, level, signature, extra) {
  const p = pool(chain, idx, level);
  const known = new Set(p.map(m => m.id));
  const chosen = [];
  for (const mv of signature) {
    const id = toID(mv);
    if (known.has(id) || (extra.has(id) && canLearn(chain, idx, id))) chosen.push(id);
  }
  const rest = p.filter(m => !chosen.includes(m.id)); // newest first
  for (const m of rest) { if (chosen.length >= 4 || chosen.filter(isAttack).length >= 3) break; if (isAttack(m.id)) chosen.push(m.id); }
  for (const m of rest) { if (chosen.length >= 4) break; if (!chosen.includes(m.id)) chosen.push(m.id); }
  if (!chosen.length) chosen.push('tackle');
  return chosen.slice(0, 4);
}

// A battle set for a Mon at a given level, heading toward its final battle set.
// opts.tutored: moves bought from the Move Tutor. opts.leader: trainers know their set moves from level 30.
export function setAtLevel(finalSet, level, opts = {}) {
  const chain = chainOf(finalSet.species);
  const idx = stageAt(chain, level);
  const sp = chain[idx].sp;
  const isFinal = idx === chain.length - 1;
  const extra = new Set((opts.tutored || []).map(toID));
  if (opts.leader && level >= 30) for (const m of finalSet.moves) extra.add(toID(m));
  const moves = opts.moves && opts.moves.length ? opts.moves.slice(0, 4)
    : pickMoves(chain, idx, level, finalSet.moves || [], extra).map(id => dex.moves.get(id).name);
  const abilities = Object.values(sp.abilities);
  const ability = abilities.map(toID).includes(toID(finalSet.ability)) ? finalSet.ability : abilities[0];
  let item = opts.noItem ? '' : (finalSet.item || '');
  const it = dex.items.get(item);
  if (!isFinal && it.megaStone) item = '';
  if (isFinal && it.id === 'eviolite' && !sp.nfe) item = 'Leftovers';
  return {
    name: sp.name, species: sp.name, level, moves, ability, item,
    nature: finalSet.nature || 'Serious', evs: finalSet.evs, ivs: finalSet.ivs, gender: '',
  };
}

// ---------- wild Mons ----------
const BANNED_TAGS = ['Restricted Legendary', 'Sub-Legendary', 'Mythical', 'Ultra Beast', 'Paradox'];
const REGIONAL = ['Alola', 'Galar', 'Hisui', 'Paldea'];
let basePool = null;
function bases() {
  if (basePool) return basePool;
  basePool = dex.species.all().filter(s => s.exists && !s.prevo && s.num > 0 && s.num < 1026
    && (!s.isNonstandard || s.isNonstandard === 'Past')
    && !s.tags.some(t => BANNED_TAGS.includes(t))
    && (!s.forme || (REGIONAL.includes(s.forme) && !dex.species.get(s.baseSpecies).prevo && !s.requiredItem))
    && !s.battleOnly && !s.cosmeticFormes?.includes?.(s.name)
    && Object.keys(learnsetOf(s)).length > 0);
  return basePool;
}
function familyTypes(sp) {
  const types = new Set(sp.types);
  const walk = s => { for (const e of s.evos || []) { const n = dex.species.get(e); n.types.forEach(t => types.add(t)); walk(n); } };
  walk(sp);
  return types;
}
const rand = a => a[Math.floor(Math.random() * a.length)];

// A random wild (or trainer) Mons at a level, optionally of certain types.
export function randomMon(level, types = null, trained = false) {
  let list = bases();
  if (types && types.length) {
    const t = list.filter(s => [...familyTypes(s)].some(x => types.includes(x)));
    if (t.length) list = t;
  }
  let sp = rand(list);
  // evolve along a random branch as far as the level allows
  for (;;) {
    const next = (sp.evos || []).map(e => dex.species.get(e)).filter(n => n.exists && (!n.isNonstandard || n.isNonstandard === 'Past'));
    if (!next.length) break;
    const n = rand(next);
    const chain = chainOf(n.name);
    if (level < chain[chain.length - 1].at) break;
    sp = n;
  }
  const chain = chainOf(sp.name);
  const idx = chain.length - 1;
  const moves = pickMoves(chain, idx, level, [], new Set()).map(id => dex.moves.get(id).name);
  const abilities = [sp.abilities[0], sp.abilities[1]].filter(Boolean);
  const ev = trained ? 84 : 0, iv = trained ? 24 : 15;
  return {
    name: sp.name, species: sp.name, level, moves, ability: rand(abilities), item: '',
    nature: rand(['Hardy', 'Adamant', 'Modest', 'Jolly', 'Timid', 'Bold', 'Calm']), gender: '',
    evs: {hp: ev, atk: ev, def: ev, spa: ev, spd: ev, spe: ev}, ivs: {hp: iv, atk: iv, def: iv, spa: iv, spd: iv, spe: iv},
  };
}

// ---------- teams ----------
export function parseSets(text) { return Teams.import(String(text || '').split('\n').filter(l => !l.trim().startsWith('===')).join('\n')) || []; }

// The player's team: [{final, level, frac, tutored}] -> battle sets
export function playerSets(team) { return team.map(m => setAtLevel(m.final, m.level, {tutored: m.tutored, moves: m.moves, noItem: true})); }

// Starting moves for a team member (used once, then the player owns the move list)
export function startingMoves(finalSet, level, tutored = []) { return setAtLevel(finalSet, level, {tutored}).moves; }

// Level-up moves gained between two levels, including moves learned on evolution
function movesGained(chain, oldLv, newLv) {
  const a = stageAt(chain, oldLv), b = stageAt(chain, newLv);
  const out = [];
  for (let i = a; i <= b; i++) {
    for (const m of levelMoves(chain[i].sp, chain[i].at)) {
      if (m.level > oldLv && m.level <= newLv && !out.some(o => o.id === m.id)) out.push(m);
    }
  }
  return out.sort((x, y) => x.level - y.level).map(m => dex.moves.get(m.id).name);
}

// Level everyone up by n and keep their own move lists.
// Returns events: grew / evolve / learned (had room) / wants (already knows 4, the player decides).
export function growTeam(team, n) {
  const events = [];
  team.forEach((m, slot) => {
    if (m.level >= 100) return;
    const chain = chainOf(m.final.species);
    const oldLv = m.level;
    const from = chain[stageAt(chain, oldLv)].sp.name;
    m.level = Math.min(100, oldLv + n);
    const to = chain[stageAt(chain, m.level)].sp.name;
    events.push({type: 'grew', slot, species: from, level: m.level});
    if (from !== to) events.push({type: 'evolve', slot, from, to, oldLevel: oldLv});
    for (const mv of movesGained(chain, oldLv, m.level)) {
      if (m.moves.includes(mv)) continue;
      if (m.moves.length < 4) { m.moves.push(mv); events.push({type: 'learned', slot, species: to, move: mv}); }
      else events.push({type: 'wants', slot, species: to, move: mv});
    }
  });
  return events;
}

// Stats for a member at a level (for the evolution reveal)
export function statsAt(finalSet, level, moves, species) {
  const set = setAtLevel(finalSet, level, {moves});
  const sp = dex.species.get(species || set.species);
  const nat = dex.natures.get(set.nature || 'Serious');
  const out = {};
  for (const k of ['hp', 'atk', 'def', 'spa', 'spd', 'spe']) {
    const iv = set.ivs && set.ivs[k] != null ? set.ivs[k] : 31, ev = (set.evs && set.evs[k]) || 0;
    const core = Math.floor((2 * sp.baseStats[k] + iv + Math.floor(ev / 4)) * level / 100);
    out[k] = k === 'hp' ? core + level + 10 : Math.floor((core + 5) * (nat.plus === k ? 1.1 : nat.minus === k ? 0.9 : 1));
  }
  return {species: sp.name, types: sp.types, stats: out};
}
export function moveInfo(name) {
  const m = dex.moves.get(name);
  return {name: m.name, type: m.type, category: m.category, power: m.basePower, accuracy: m.accuracy === true ? null : m.accuracy, pp: Math.floor(m.pp * 8 / 5), desc: m.shortDesc || m.desc};
}

// A leader's team at a level (their Mons shown at the right evolution stage)
export function leaderSets(teamText, level) { return parseSets(teamText).map(s => setAtLevel(s, level, {leader: true, noItem: true})); }

// Level everyone up by n. Returns readable lines about growth, evolutions and new moves.
export function levelUp(team, n) {
  const lines = [];
  for (const m of team) {
    if (m.level >= 100) continue;
    const before = setAtLevel(m.final, m.level, {tutored: m.tutored});
    m.level = Math.min(100, m.level + n);
    const after = setAtLevel(m.final, m.level, {tutored: m.tutored});
    lines.push(`${before.species} grew to level ${m.level}.`);
    if (after.species !== before.species) lines.push(`${before.species} evolved into ${after.species}!`);
    for (const mv of after.moves) if (!before.moves.includes(mv)) lines.push(`${after.species} learned ${mv}!`);
  }
  return lines;
}

// Moves from the final battle set that the Move Tutor can teach this Mon right now
export function tutorOptions(member) {
  const chain = chainOf(member.final.species);
  const idx = stageAt(chain, member.level);
  const now = (member.moves || setAtLevel(member.final, member.level, {tutored: member.tutored}).moves).map(toID);
  return (member.final.moves || []).map(toID).filter(id => !now.includes(id) && canLearn(chain, idx, id)).map(id => dex.moves.get(id).name);
}

// Evolution path summary for the team guide: [{species, at}]
export function evolutionPath(finalSpecies) { return chainOf(finalSpecies).map(c => ({species: c.sp.name, at: c.at})); }


// ---------- Neofield Region (invented Mons) ----------
export * from './regional.js';
// A wild invented Mons from a route, at the right evolution stage for its level.
// Rare (legendary) Mons turn up about 1 time in 40 on their routes; everything else is equally likely.
function pickFamily(keys) {
  const w = keys.map(k => familyOf(k).rare ? 0.025 * (keys.length - keys.filter(x => familyOf(x).rare).length) / Math.max(1, keys.filter(x => familyOf(x).rare).length) : 1);
  let x = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < keys.length; i++) { x -= w[i]; if (x < 0) return keys[i]; }
  return keys[0];
}
export function regionalWild(routeIdx, level, famKey) {
  const r = ROUTES[Math.max(0, Math.min(ROUTES.length - 1, routeIdx))];
  const fam = familyOf(famKey || pickFamily(r.families));
  const set = setAtLevel(fam.finalSet, level);
  set.item = ''; set.evs = {}; set.nature = ['Hardy', 'Bold', 'Modest', 'Jolly', 'Calm', 'Adamant', 'Timid', 'Careful'][Math.floor(Math.random() * 8)];
  set.family = fam.key;
  return set;
}
// A new team member (starter or caught Mons) that grows toward its family's battle set.
export function newMember(famKey, level) {
  const fam = familyOf(famKey);
  const final = JSON.parse(JSON.stringify(fam.finalSet));
  return {final, level, frac: 1, tutored: [], moves: setAtLevel(final, level).moves};
}
// Chance one Mon Ball works. hpFrac 0..1, status like 'slp'. Friendlier than the main games.
export function catchChance(catchRate, hpFrac, status) {
  const bonus = status === 'slp' || status === 'frz' ? 2 : status ? 1.5 : 1;
  const a = (3 - 2 * Math.max(0, Math.min(1, hpFrac))) / 3 * catchRate * bonus;
  return Math.min(1, Math.pow(a / 255, 0.6));
}
export const familyKeys = () => FAMILIES.map(f => f.key);

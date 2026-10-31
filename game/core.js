// Battle engine wrapper + computer opponent AI, built on the Showdown battle simulator (@pkmn/sim).
import {Battle, Dex, Teams, TeamValidator} from '@pkmn/sim';
import {TEAM_TEXT} from './teams.js';

export const FORMAT = 'gen9nationaldexubers';
// Moves have their base PP (no PP Ups, which would give 8/5 of it)
Battle.prototype.calculatePP = function (move) { return move.pp; };
export {Dex, TEAM_TEXT};

export function parseTeam(text) {
  const clean = String(text || '').split('\n').filter(l => !l.trim().startsWith('===')).join('\n');
  const team = Teams.import(clean);
  if (!team || !team.length) return {team: null, problems: ['No Mons found in that text.']};
  const problems = TeamValidator.get(FORMAT).validateTeam(team);
  return {team, problems: problems || []};
}

// gameType: 'singles' (default), 'doubles' (2 out per side) or 'triples' (3 out per side)
export function createBattle(p1, p2, seed, gameType = 'singles') {
  let battle;
  if (gameType === 'singles') battle = new Battle({formatid: FORMAT, seed: seed || randSeed()});
  else {
    const base = Dex.formats.get(FORMAT);
    const format = Object.assign(Object.create(Object.getPrototypeOf(base)), base, {gameType});
    battle = new Battle({format, formatid: base.id, seed: seed || randSeed()});
  }
  battle.setPlayer('p1', {name: p1.name, team: p1.team});
  battle.setPlayer('p2', {name: p2.name, team: p2.team});
  return battle;
}

function randSeed() {
  return [0, 0, 0, 0].map(() => Math.floor(Math.random() * 0x10000));
}

// ---------- damage estimation ----------
const ABILITY_IMMUNE = {
  waterabsorb: 'Water', dryskin: 'Water', stormdrain: 'Water',
  voltabsorb: 'Electric', lightningrod: 'Electric', motordrive: 'Electric',
  flashfire: 'Fire', sapsipper: 'Grass', eartheater: 'Ground', wellbakedbody: 'Fire',
};

function weightBP(kg) {
  if (kg < 10) return 20; if (kg < 25) return 40; if (kg < 50) return 60;
  if (kg < 100) return 80; if (kg < 200) return 100; return 120;
}

// Pure helpers (no simulator events, so they are safe to call between turns)
const typesOf = p => (p.terastallized && p.terastallized !== 'Stellar') ? [p.terastallized] : (p.types && p.types.length ? p.types : p.species.types);
const hasT = (p, t) => typesOf(p).includes(t);
const abOf = p => p.ability || '';
const itemOf = p => p.item || '';
const weatherOf = battle => battle.field.weather || '';
const isSnow = w => w === 'snow' || w === 'snowscape' || w === 'hail';
const BOOST = [1, 1.5, 2, 2.5, 3, 3.5, 4];

function grounded(battle, p) {
  if (battle.field.pseudoWeather && battle.field.pseudoWeather.gravity) return true;
  if (itemOf(p) === 'ironball') return true;
  if (hasT(p, 'Flying') || abOf(p) === 'levitate' || itemOf(p) === 'airballoon') return false;
  if (p.volatiles && (p.volatiles.magnetrise || p.volatiles.telekinesis)) return false;
  return true;
}

function typeEff(battle, moveType, p, moveId) {
  let mul = 1;
  for (const t of typesOf(p)) {
    if (moveId === 'freezedry' && t === 'Water') { mul *= 2; continue; }
    if (!battle.dex.getImmunity(moveType, t)) return 0;
    mul *= Math.pow(2, battle.dex.getEffectiveness(moveType, t));
  }
  return mul;
}

function stat(battle, p, s, ignoreBoost) {
  let v = p.storedStats[s];
  const b = ignoreBoost ? 0 : (p.boosts[s] || 0);
  v = b >= 0 ? v * BOOST[b] : v / BOOST[-b];
  const it = itemOf(p), ab = abOf(p), w = weatherOf(battle);
  if (s === 'atk' && it === 'choiceband') v *= 1.5;
  if (s === 'spa' && it === 'choicespecs') v *= 1.5;
  if (s === 'spe' && it === 'choicescarf') v *= 1.5;
  if (s === 'spd' && it === 'assaultvest') v *= 1.5;
  if ((s === 'def' || s === 'spd') && it === 'eviolite' && p.species.nfe) v *= 1.5;
  if (s === 'def' && isSnow(w) && hasT(p, 'Ice')) v *= 1.5;
  if (s === 'spd' && w === 'sandstorm' && hasT(p, 'Rock')) v *= 1.5;
  if (s === 'spe') {
    if (ab === 'slushrush' && isSnow(w)) v *= 2;
    if (ab === 'swiftswim' && w === 'raindance') v *= 2;
    if (ab === 'sandrush' && w === 'sandstorm') v *= 2;
    if (ab === 'chlorophyll' && w === 'sunnyday') v *= 2;
    if (p.status === 'par') v *= 0.5;
    if (p.side.sideConditions.tailwind) v *= 2;
  }
  if (s === 'atk' && ab === 'hugepower') v *= 2;
  if (s === 'atk' && it === 'thickclub' && ['Cubone', 'Marowak'].includes(p.species.baseSpecies)) v *= 2;
  if ((s === 'atk' || s === 'spa') && it === 'lightball' && p.species.baseSpecies === 'Pikachu') v *= 2;
  return Math.floor(v);
}

// Expected damage as a fraction of defender's max HP.
export function estimate(battle, atk, def, moveId) {
  const move = battle.dex.moves.get(moveId);
  if (!move.exists || move.category === 'Status') return null;
  if (!def || def.fainted || !atk || atk.fainted) return null;
  let type = move.type;
  const ATE = {pixilate: 'Fairy', aerilate: 'Flying', refrigerate: 'Ice', galvanize: 'Electric'};
  const ateBoost = ATE[abOf(atk)] && type === 'Normal';
  if (ateBoost) type = ATE[abOf(atk)];
  if (move.id === 'struggle') return {frac: 0.2, acc: 1, eff: 1};
  if (move.ohko) return null;
  const ab = abOf(def);
  const breaker = ['moldbreaker', 'teravolt', 'turboblaze'].includes(abOf(atk));
  if (type === 'Ground' && !grounded(battle, def) && !(breaker && ab === 'levitate')) return {frac: 0, acc: 1, eff: 0};
  if (ABILITY_IMMUNE[ab] === type && !breaker) return {frac: 0, acc: 1, eff: 0};
  let effMul = typeEff(battle, type, def, move.id);
  if (type === 'Ground' && effMul === 0 && grounded(battle, def)) effMul = 1;
  if (effMul === 0) return {frac: 0, acc: 1, eff: 0};
  if (ab === 'wonderguard' && effMul <= 1 && !breaker) return {frac: 0, acc: 1, eff: 0};

  if (move.damage === 'level') return {frac: atk.level / def.maxhp, acc: 1, eff: 1};
  let bp = move.basePower;
  const defKg = def.weighthg / 10, atkKg = atk.weighthg / 10;
  if (['grassknot', 'lowkick'].includes(move.id)) bp = weightBP(defKg);
  if (['heavyslam', 'heatcrash'].includes(move.id)) {
    const r = atkKg / defKg;
    bp = r >= 5 ? 120 : r >= 4 ? 100 : r >= 3 ? 80 : r >= 2 ? 60 : 40;
  }
  if (move.id === 'eruption' || move.id === 'waterspout') bp = Math.max(1, Math.floor(150 * atk.hp / atk.maxhp));
  if (move.id === 'return') bp = 102;
  if (move.id === 'tripleaxel') bp = 120;
  else if (move.id === 'triplekick') bp = 60;
  else if (Array.isArray(move.multihit)) bp *= abOf(atk) === 'skilllink' ? move.multihit[1] : 3;
  else if (typeof move.multihit === 'number') bp *= move.multihit;
  const defItem = itemOf(def) ? battle.dex.items.get(itemOf(def)) : null;
  if (move.id === 'knockoff' && defItem && !defItem.megaStone) bp *= 1.5;
  if (move.id === 'acrobatics' && !itemOf(atk)) bp *= 2;
  if (!bp) return null;

  const phys = move.category === 'Physical';
  const A = stat(battle, atk, move.id === 'bodypress' ? 'def' : (phys ? 'atk' : 'spa'));
  const D = stat(battle, def, (phys || move.overrideDefensiveStat === 'def') ? 'def' : 'spd');

  let dmg = Math.floor(Math.floor(Math.floor(2 * atk.level / 5 + 2) * bp * A / D) / 50) + 2;
  if (hasT(atk, type)) dmg *= abOf(atk) === 'adaptability' ? 2 : 1.5;
  dmg *= effMul;
  const aab = abOf(atk);
  if (phys && atk.status === 'brn' && aab !== 'guts') dmg *= 0.5;
  if (ab === 'thickfat' && (type === 'Fire' || type === 'Ice')) dmg *= 0.5;
  if (ab === 'dryskin' && type === 'Fire') dmg *= 1.25;
  if (ab === 'multiscale' && def.hp === def.maxhp) dmg *= 0.5;
  if (itemOf(atk) === 'lifeorb') dmg *= 1.3;
  if (ateBoost) dmg *= 1.2;
  if (aab === 'megalauncher' && move.flags.pulse) dmg *= 1.5;
  if (aab === 'ironfist' && move.flags.punch) dmg *= 1.2;
  if (aab === 'technician' && bp <= 60) dmg *= 1.5;
  if (aab === 'sheerforce' && move.secondaries) dmg *= 1.3;
  if (aab === 'swarm' && atk.hp <= atk.maxhp / 3 && type === 'Bug') dmg *= 1.5;
  if (aab === 'overgrow' && atk.hp <= atk.maxhp / 3 && type === 'Grass') dmg *= 1.5;
  if (aab === 'toughclaws' && move.flags.contact) dmg *= 1.3;
  const sc = def.side.sideConditions;
  if (sc.auroraveil || (phys && sc.reflect) || (!phys && sc.lightscreen)) dmg *= 0.5;
  const w = weatherOf(battle);
  if (w === 'raindance') { if (type === 'Water') dmg *= 1.5; if (type === 'Fire') dmg *= 0.5; }
  if (w === 'sunnyday') { if (type === 'Fire') dmg *= 1.5; if (type === 'Water') dmg *= 0.5; }
  dmg *= 0.925;
  let acc = move.accuracy === true ? 100 : move.accuracy;
  if (move.id === 'blizzard' && isSnow(w)) acc = 100;
  if (aab === 'noguard') acc = 100;
  return {frac: dmg / def.maxhp, acc: acc / 100, eff: effMul};
}

function est(battle, a, d, m) {
  return estimate(battle, a, d, m) || {frac: 0, acc: 1, eff: 1};
}

function priorityOf(battle, p, moveId) {
  return battle.dex.moves.get(moveId).priority || 0;
}

function speedOf(battle, p) { return stat(battle, p, 'spe'); }

// Best damage (fraction of max HP, accuracy-weighted) attacker can do to defender with its known moves
function bestHit(battle, atk, def) {
  let best = 0;
  for (const ms of atk.moveSlots) {
    const r = est(battle, atk, def, ms.id);
    best = Math.max(best, r.frac * r.acc);
  }
  return best;
}

// How good is pokemon `me` against `foe` (positive is good)
function matchup(battle, me, foe, entering) {
  const myHit = Math.min(bestHit(battle, me, foe), foe.hp / foe.maxhp);
  let foeHit = bestHit(battle, foe, me);
  let myHp = me.hp / me.maxhp;
  if (entering) myHp -= hazardCost(battle, me);
  const iOutspeed = speedOf(battle, me) > speedOf(battle, foe);
  const iDie = foeHit >= myHp;
  const theyDie = myHit >= foe.hp / foe.maxhp - 0.001;
  let s = myHit * 100 - Math.min(foeHit, myHp) * 100;
  if (theyDie && (iOutspeed || !iDie)) s += 60;
  if (iDie && !(theyDie && iOutspeed)) s -= 50;
  return s;
}

function hazardCost(battle, p) {
  const sc = p.side.sideConditions;
  if (itemOf(p) === 'heavydutyboots') return 0;
  let c = 0;
  if (sc.stealthrock) c += typeEff(battle, 'Rock', p) / 8;
  if (sc.spikes && grounded(battle, p)) c += [0, 1 / 8, 1 / 6, 1 / 4][sc.spikes.layers || 1];
  return c;
}

// ---------- AI ----------
// level: 'easy' | 'normal' | 'hard'. Difficulty only changes how well the computer plays,
// never stats or levels, so every team can beat every other team.
export const LEVELS = {
  // Tested over thousands of simulated battles: switching out on a hunch loses more often
  // than it helps, so Hard plays the strongest move every turn instead.
  easy:   {randomMove: 0.75, jitter: 45, canSwitch: false, switchMargin: 999, switchChance: 0, megaChance: 0.3, sloppy: true},
  normal: {randomMove: 0,    jitter: 8,  canSwitch: true,  switchMargin: 55,  switchChance: 0.55, megaChance: 1},
  hard:   {randomMove: 0,    jitter: 1.5, canSwitch: false, switchMargin: 999, switchChance: 0, megaChance: 1},
};

export function aiChoose(battle, sideId, memory = {}, level = 'normal') {
  const L = typeof level === 'object' ? level : (LEVELS[level] || LEVELS.normal);
  const side = battle[sideId];
  const req = side.activeRequest;
  if (!req || req.wait) return null;
  if (battle.activePerHalf > 1) return aiChooseMulti(battle, sideId, memory, L);
  if (req.teamPreview) return L.sloppy ? randomPreview(side) : teamPreviewChoice(battle, side);
  if (req.forceSwitch) {
    if (L.sloppy) {
      const alive = side.pokemon.map((p, i) => ({p, i})).filter(x => !x.p.fainted && !x.p.isActive);
      if (!alive.length) return 'pass';
      return `switch ${alive[Math.floor(Math.random() * alive.length)].i + 1}`;
    }
    const choice = bestSwitch(battle, side, true);
    return choice ? `switch ${choice.idx}` : 'pass';
  }
  const me = side.active[0];
  const foe = side.foe.active[0];
  const act = req.active[0];
  const usable = act.moves.map((m, i) => ({...m, slot: i + 1})).filter(m => !m.disabled);

  // Consider switching out of a bad matchup
  const turn = battle.turn;
  if (L.canSwitch && !act.trapped && !act.maybeTrapped && foe && !foe.fainted && memory.lastSwitchTurn !== turn - 1) {
    const cur = matchup(battle, me, foe, false);
    const sw = bestSwitch(battle, side, false);
    const foeHit = bestHit(battle, foe, me);
    const myHit = bestHit(battle, me, foe);
    if (sw && sw.score > cur + L.switchMargin && (foeHit >= me.hp / me.maxhp || myHit < 0.15) && Math.random() < L.switchChance) {
      memory.lastSwitchTurn = turn;
      return `switch ${sw.idx}`;
    }
  }

  let best = null;
  if (L.randomMove && Math.random() < L.randomMove && usable.length) {
    const m = usable[Math.floor(Math.random() * usable.length)];
    best = {s: 0, m};
  } else {
    for (const m of usable) {
      const s = scoreMove(battle, me, foe, m.id, side) + Math.random() * L.jitter;
      if (!best || s > best.s) best = {s, m};
    }
  }
  if (!best) return 'move 1';
  let choice = `move ${best.m.slot}`;
  if (act.canMegaEvo && Math.random() < L.megaChance) choice += ' mega';
  return choice;
}


// ---------- doubles and triples ----------
const TARGETED = ['normal', 'any', 'adjacentFoe', 'adjacentAlly', 'adjacentAllyOrSelf'];
export const needsTarget = type => TARGETED.includes(type);
// Valid target locations for a move: foes are positive (1..n), allies negative
export function targetLocs(battle, mon, moveTarget) {
  const out = [];
  for (const other of [...mon.side.foe.active, ...mon.side.active]) {
    if (!other || other.fainted) continue;
    const loc = mon.getLocOf(other);
    if (battle.validTargetLoc(loc, mon, moveTarget)) out.push({loc, mon: other, foe: other.side !== mon.side});
  }
  return out;
}

function aiChooseMulti(battle, sideId, memory, L) {
  const side = battle[sideId], req = side.activeRequest, n = battle.activePerHalf;
  const foes = () => side.foe.active.filter(p => p && !p.fainted);
  if (req.teamPreview) {
    const total = p => Object.values(p.baseStats).reduce((a, b) => a + b, 0);
    const order = side.pokemon.map((p, i) => ({i: i + 1, t: L.sloppy ? Math.random() : total(p.species)})).sort((a, b) => b.t - a.t);
    return 'team ' + order.map(x => x.i).join('');
  }
  if (req.forceSwitch) {
    const bench = side.pokemon.map((p, i) => ({p, i})).filter(x => !x.p.fainted && !x.p.isActive);
    const parts = [], f0 = foes()[0];
    for (let slot = 0; slot < n; slot++) {
      if (!req.forceSwitch[slot] || !bench.length) { parts.push('pass'); continue; }
      let bi = 0, bs = -1e9;
      bench.forEach((x, k) => { const sc = (f0 ? matchup(battle, x.p, f0, true) : 0) + Math.random() * 6; if (sc > bs) { bs = sc; bi = k; } });
      parts.push(`switch ${bench[bi].i + 1}`);
      bench.splice(bi, 1);
    }
    return parts.join(', ');
  }
  const parts = [];
  let mega = false;
  for (let slot = 0; slot < n; slot++) {
    const me = side.active[slot], act = req.active[slot];
    if (!me || me.fainted || !act) { parts.push('pass'); continue; }
    const usable = act.moves.map((m, i) => ({...m, slot: i + 1})).filter(m => !m.disabled);
    if (!usable.length) { parts.push('move 1'); continue; }
    const fs = foes();
    let best = null;
    const consider = (m, score, loc) => { if (!best || score > best.score) best = {m, score, loc}; };
    for (const m of usable) {
      const mv = battle.dex.moves.get(m.id), type = m.target || mv.target;
      const jitter = Math.random() * L.jitter;
      if (L.randomMove && Math.random() < L.randomMove) { consider(m, Math.random() * 100, undefined); continue; }
      if (needsTarget(type)) {
        const locs = targetLocs(battle, me, type);
        for (const t of locs) {
          if (t.foe) consider(m, scoreMove(battle, me, t.mon, m.id, side) + jitter, t.loc);
          else if (mv.category === 'Status') consider(m, 12 + jitter, t.loc);   // helping an ally
        }
      } else if (type === 'allAdjacentFoes' || type === 'allAdjacent') {
        const hit = targetLocs(battle, me, type);
        let sc = 0, allyHit = 0;
        for (const t of hit) {
          if (t.foe) sc += scoreMove(battle, me, t.mon, m.id, side) * 0.8;
          else if (mv.category !== 'Status') allyHit += est(battle, me, t.mon, m.id).frac * 100;
        }
        consider(m, sc - allyHit + jitter);
      } else {
        consider(m, (fs[0] ? scoreMove(battle, me, fs[0], m.id, side) : 5) + jitter);
      }
    }
    if (!best) return 'default';   // nothing in reach (a far-away foe in triples): let the engine pick
    let c = `move ${best.m.slot}`;
    if (best.loc !== undefined) c += ` ${best.loc}`;
    if (act.canMegaEvo && !mega && Math.random() < L.megaChance) { c += ' mega'; mega = true; }
    parts.push(c);
  }
  return parts.join(', ');
}

function randomPreview(side) {
  const idx = side.pokemon.map((_, i) => i + 1);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return 'team ' + idx.join('');
}

// ---------- bag items (Journey mode) ----------
export const ITEMS = {
  hyperpotion: {name: 'Hyper Potion', desc: 'Restores half of a Mon\'s max HP.', heal: 0.5},
  fullrestore: {name: 'Full Restore', desc: 'Fully restores HP and cures any status problem.', heal: 1, cure: true},
  fullheal:    {name: 'Full Heal',    desc: 'Cures poison, burn, paralysis, sleep or freeze.', cure: true},
  revive:      {name: 'Revive',       desc: 'Revives a fainted Mon with half its max HP.', revive: 0.5},
  maxrevive:   {name: 'Max Revive',   desc: 'Revives a fainted Mon with full HP.', revive: 1},
  pokeball:    {name: 'Mon Ball',    desc: 'Throw it at a wild Mon to catch it. The lower its HP, the better your chances.', ball: true},
};

// Can this item do anything for this Mon? Returns '' if usable, else the reason.
export function itemProblem(itemId, p) {
  const it = ITEMS[itemId];
  if (!it || !p) return 'Unknown item.';
  if (it.ball) return 'Mon Balls are thrown at wild Mons in battle.';
  const fainted = p.fainted || p.hp <= 0;
  if (it.revive) return fainted ? '' : `${p.name} hasn't fainted.`;
  if (fainted) return `${p.name} has fainted. Use a Revive.`;
  const hurt = p.hp < p.maxhp, sick = p.status && p.status !== 'fnt';
  if (it.heal && it.cure) return hurt || sick ? '' : `${p.name} is already healthy.`;
  if (it.heal) return hurt ? '' : `${p.name} already has full HP.`;
  if (it.cure) return sick ? '' : `${p.name} has no status problem.`;
  return '';
}

// Apply an item to a Mon inside a running battle. Returns a message.
export function applyItem(battle, sideId, itemId, p) {
  const it = ITEMS[itemId];
  const side = battle[sideId];
  let msg = '';
  if (it.revive) {
    // the simulator never clears its "already fainted" mark on its own; leaving it set makes
    // a revived Mon unable to faint again (HP goes negative)
    p.fainted = false; p.faintQueued = false; p.subFainted = null; p.status = ''; p.statusState = {};
    p.switchFlag = false;
    p.hp = Math.max(1, Math.floor(p.maxhp * it.revive));
    recountLeft(side);
    msg = `${p.name} was revived with ${Math.round(it.revive * 100)}% HP!`;
  } else {
    const before = p.hp;
    if (it.heal) p.hp = Math.min(p.maxhp, Math.max(0, p.hp) + Math.floor(p.maxhp * it.heal));
    const gained = p.hp - before;
    let cured = '';
    if (it.cure && p.status) { cured = p.status; p.status = ''; p.statusState = {}; if (p.volatiles && p.volatiles.confusion) delete p.volatiles.confusion; }
    msg = `${p.name} ${gained ? `restored ${gained} HP` : ''}${gained && cured ? ' and ' : ''}${cured ? 'was cured of its status problem' : ''}!`;
  }
  battle.add('-message', `You used a ${it.name}. ${msg}`);
  return msg;
}

// The turn spent using an item: the active Mons skips its move.
const BAG_TURN = {
  id: 'bagturn', name: 'Bag Turn', fullname: 'Bag Turn', effectType: 'Condition', exists: true, duration: 1,
  onBeforeMovePriority: 100,
  onBeforeMove(pokemon) { pokemon.removeVolatile('bagturn'); return false; },
};
export function spendTurnOnItem(battle, sideId) {
  const side = battle[sideId];
  const req = side.activeRequest;
  const mon = side.active[0];
  // The simulator finds volatile effects by id, so register ours with this battle's dex first.
  const cache = battle.dex.conditions.conditionCache;
  if (!cache.has('bagturn')) cache.set('bagturn', BAG_TURN);
  if (mon && !mon.fainted) mon.addVolatile('bagturn');
  const act = req && req.active && req.active[0];
  let slot = 1;
  if (act) { const i = act.moves.findIndex(m => !m.disabled); slot = i >= 0 ? i + 1 : 1; }
  return battle.choose(sideId, `move ${slot}`);
}

// Doubles/triples: the active Mon in a slot spends its turn on a bag item. Returns a placeholder
// choice for that slot (a move it will not get to use), or null if the Mon has nothing it could pick.
export function spendSlotOnItem(battle, sideId, slot) {
  const side = battle[sideId], mon = side.active[slot], act = side.activeRequest && side.activeRequest.active && side.activeRequest.active[slot];
  if (!mon || mon.fainted || !act) return null;
  const cache = battle.dex.conditions.conditionCache;
  if (!cache.has('bagturn')) cache.set('bagturn', BAG_TURN);
  let pick = null;
  for (let i = 0; i < act.moves.length && !pick; i++) {
    const m = act.moves[i];
    if (m.disabled) continue;
    const type = m.target || battle.dex.moves.get(m.id).target;
    if (!needsTarget(type)) { pick = `move ${i + 1}`; break; }
    const t = targetLocs(battle, mon, type).find(x => x.foe);
    if (t) pick = `move ${i + 1} ${t.loc}`;
  }
  if (pick) mon.addVolatile('bagturn');
  return pick;
}

// ---------- catching wild Mons ----------
// While armed, an attack that would knock out the wild Mon leaves it at 1 HP instead and flags a catch chance.
const CATCH_GUARD = {
  name: 'catchguard', id: 'catchguard', effectType: 'Condition',
  onDamagePriority: -200,
  onDamage(damage, target) {
    const st = this.effectState;
    if (!st.armed || target.side.id !== 'p2') return;
    if (damage >= target.hp) { st.ready = true; return Math.max(0, target.hp - 1); }
  },
};
function guardOf(battle) {
  const cache = battle.dex.conditions.conditionCache;
  if (!cache.has('catchguard')) cache.set('catchguard', CATCH_GUARD);
  if (!battle.p2.sideConditions.catchguard) {
    // set it directly: addSideCondition runs events that need active Mons, which don't exist before the lead is chosen
    const state = {id: 'catchguard', target: battle.p2};
    battle.p2.sideConditions.catchguard = battle.initEffectState ? battle.initEffectState(state) : state;
  }
  return battle.p2.sideConditions.catchguard;
}
export function armCatch(battle, armed) { const g = guardOf(battle); if (g) { g.armed = !!armed; if (!armed) g.ready = false; } }
export function catchReady(battle) {
  const g = battle.p2.sideConditions.catchguard, mon = battle.p2.active[0];
  if (!g || !g.ready || battle.ended || !mon || mon.fainted) return false;
  if (mon.hp > 1) { g.ready = false; return false; }
  return true;
}

// ---------- carry HP between battles ----------
// The simulator resets its count of usable Mons when the battle starts, so recount after.
export function recountLeft(side) { side.pokemonLeft = side.pokemon.filter(p => !p.fainted).length; }
export function readTeamState(side) {
  const out = {};
  for (const p of side.pokemon) out[p.name] = {hp: p.fainted ? 0 : p.hp, maxhp: p.maxhp};
  return out;
}
export function applyTeamState(side, state) {
  if (!state) return;
  for (const p of side.pokemon) {
    const s = state[p.name];
    if (!s) continue;
    if (s.hp <= 0) {
      if (!p.fainted) { p.hp = 0; p.fainted = true; p.status = 'fnt'; }
    } else p.hp = Math.min(p.maxhp, Math.max(1, s.hp));
  }
  recountLeft(side);
}

// ---------- the Champion's team: random Mons from every leader ----------
export function buildChampionTeam(allTeamTexts, avoidSpecies = []) {
  const pool = [];
  for (const text of allTeamTexts) for (const set of (Teams.import(text) || [])) pool.push(set);
  const validator = TeamValidator.get(FORMAT);
  for (let tries = 0; tries < 200; tries++) {
    const pick = [], seen = new Set(avoidSpecies.map(s => Dex.species.get(s).baseSpecies));
    let megas = 0;
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    for (const set of shuffled) {
      const base = Dex.species.get(set.species).baseSpecies;
      if (seen.has(base)) continue;
      const mega = !!Dex.items.get(set.item).megaStone;
      if (mega && megas >= 1) continue;
      pick.push(JSON.parse(JSON.stringify(set))); seen.add(base); if (mega) megas++;
      if (pick.length === 6) break;
    }
    if (pick.length === 6 && !validator.validateTeam(pick)) return Teams.export(pick);
  }
  return allTeamTexts[0];
}

function scoreMove(battle, me, foe, id, side) {
  const move = battle.dex.moves.get(id);
  if (!foe || foe.fainted) return 0;
  const myHp = me.hp / me.maxhp;
  const foeHpFrac = foe.hp / foe.maxhp;
  const foeHit = bestHit(battle, foe, me);
  const meFaster = speedOf(battle, me) > speedOf(battle, foe);
  const foeSide = foe.side;
  const foesLeft = foeSide.pokemon.filter(p => !p.fainted).length;
  const sc = foeSide.sideConditions;
  const boosts = me.boosts;

  if (move.category !== 'Status' || ['rapidspin', 'dragontail', 'infestation'].includes(id)) {
    const r = est(battle, me, foe, id);
    if (r.frac === 0 && move.category !== 'Status') return -50;
    let s = Math.min(r.frac, foeHpFrac) * 100 * r.acc;
    const ko = r.frac >= foeHpFrac;
    const prio = priorityOf(battle, me, id);
    if (ko) s += 40 * r.acc;
    if (ko && prio > 0 && !meFaster) s += 40;
    if (prio > 0 && !ko) s -= 5;
    if (id === 'fakeout' || id === 'firstimpression') { if (me.activeMoveActions > 0) return -60; s += 25; }
    if (id === 'suckerpunch' && foe.moveSlots.every(m => battle.dex.moves.get(m.id).category === 'Status')) s -= 60;
    if (id === 'explosion' || id === 'selfdestruct') s = myHp < 0.35 ? s : -100;
    if ((id === 'uturn' || id === 'voltswitch' || id === 'flipturn') && foeHit > 0.5) s += 10;
    if (id === 'flipturn' && me.species.name === 'Palafin') s += 60; // Zero to Hero: switch out once to become Hero
    if (id === 'rapidspin' && hazardCost(battle, me) > 0) s += 25;
    if (id === 'dragontail' && Object.values(foe.boosts).some(b => b > 0)) s += 30;
    if (move.recoil || move.mindBlownRecoil) { if (abOf(me) !== 'rockhead') s -= 6; }
    if (id === 'superpower' || id === 'closecombat') s -= 3;
    if (id === 'focusblast') s *= 0.95;
    if (r.eff < 1) s *= 0.8;
    return s;
  }

  // Status moves
  switch (id) {
    case 'stealthrock': return sc.stealthrock || foesLeft < 3 ? -20 : (battle.turn <= 3 ? 70 : 40);
    case 'spikes': return (sc.spikes && sc.spikes.layers >= 3) || foesLeft < 3 ? -20 : (sc.spikes ? 30 : 55);
    case 'toxicspikes': return (sc.toxicspikes && sc.toxicspikes.layers >= 2) || foesLeft < 3 ? -20 : 40;
    case 'stickyweb': return sc.stickyweb || foesLeft < 3 ? -20 : 70;
    case 'auroraveil': {
      const w = weatherOf(battle);
      return isSnow(w) && !me.side.sideConditions.auroraveil ? 75 : -30;
    }
    case 'roost': case 'synthesis': case 'recover': case 'slackoff': case 'moonlight': case 'strengthsap': case 'softboiled': case 'milkdrink': case 'morningsun': case 'painsplit':
      return myHp < 0.5 && foeHit < 0.5 ? 65 : (myHp < 0.35 ? 45 : -10);
    case 'swordsdance': case 'nastyplot': case 'shellsmash': case 'quiverdance': case 'dragondance': case 'calmmind': case 'bulkup': {
      const stat = id === 'swordsdance' || id === 'dragondance' || id === 'bulkup' ? 'atk' : id === 'shellsmash' && me.storedStats.atk > me.storedStats.spa ? 'atk' : 'spa';
      if (boosts[stat] >= 2) return -10;
      return myHp > 0.6 && foeHit < 0.4 ? 58 : 5;
    }
    case 'thunderwave': case 'lovelykiss': case 'sing': case 'spore': case 'willowisp': case 'toxic': case 'sleeppowder': case 'stunspore': {
      if (foe.status) return -30;
      const m = battle.dex.moves.get(id);
      if (id === 'thunderwave' && (hasT(foe, 'Ground') || hasT(foe, 'Electric'))) return -30;
      if (id === 'toxic' && (hasT(foe, 'Poison') || hasT(foe, 'Steel'))) return -30;
      if (battle.dex.moves.get(id).flags.powder && (hasT(foe, 'Grass') || abOf(foe) === 'overcoat' || itemOf(foe) === 'safetygoggles')) return -30;
      if (id === 'stunspore' && hasT(foe, 'Electric')) return -30;
      if (id === 'willowisp' && hasT(foe, 'Fire')) return -30;
      const sleep = m.status === 'slp';
      if (sleep && foeSide.pokemon.some(p => p.status === 'slp' && !p.fainted)) return -30; // sleep clause
      if (['insomnia', 'vitalspirit', 'sweetveil'].includes(abOf(foe)) && sleep) return -30;
      const acc = m.accuracy === true ? 1 : m.accuracy / 100;
      return (sleep ? 62 : 45) * acc;
    }
    case 'wish':
      return myHp < 0.65 && !me.side.slotConditions?.[0]?.wish ? 55 : -10;
    case 'protect': case 'detect': {
      if (me.volatiles && me.volatiles.stall) return -40;
      const poisoned = foe.status === 'tox' || foe.status === 'psn' || foe.status === 'brn';
      const wishPending = me.side.slotConditions && me.side.slotConditions[0] && me.side.slotConditions[0].wish;
      return wishPending ? 60 : poisoned ? 35 : 0;
    }
    case 'defog': {
      const mine = me.side.sideConditions;
      return (mine.stealthrock || mine.spikes || mine.toxicspikes || mine.stickyweb) && !sc.stealthrock ? 45 : -20;
    }
    case 'rest':
      return myHp < 0.4 && !me.status ? 40 : -20;
    case 'encore': {
      const last = foe.lastMove;
      return last && last.category === 'Status' ? 50 : -15;
    }
    case 'whirlwind': case 'roar':
      return Object.values(foe.boosts).some(b => b > 0) ? 70 : (Object.keys(sc).length && foesLeft > 1 ? 20 : -10);
    default:
      return 10;
  }
}

function bestSwitch(battle, side, forced) {
  const foe = side.foe.active[0];
  let best = null;
  side.pokemon.forEach((p, i) => {
    if (p.fainted || p.isActive) return;
    const s = foe && !foe.fainted ? matchup(battle, p, foe, true) : p.hp / p.maxhp * 100;
    const sc = s + Math.random() * 6;
    if (!best || sc > best.score) best = {idx: i + 1, score: s, p};
  });
  if (!best && forced) return null;
  return best;
}

function teamPreviewChoice(battle, side) {
  const hazards = ['stealthrock', 'stickyweb', 'spikes', 'auroraveil'];
  let lead = side.pokemon.findIndex(p => p.moveSlots.some(m => m.id === 'stickyweb'));
  if (lead < 0) lead = side.pokemon.findIndex(p => p.moveSlots.some(m => hazards.includes(m.id)));
  if (lead < 0) lead = 0;
  const order = [lead + 1, ...side.pokemon.map((_, i) => i + 1).filter(i => i !== lead + 1)];
  return 'team ' + order.join('');
}

export * from './adventure.js';
export * from './progress.js';
export * from './art.js';
export * from './builder.js';

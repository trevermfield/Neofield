// Victory Summit simulator: the four Elite Four fights (doubles / triples) and the Champion, back to back,
// against the game's real teams. Random 6-Mon teams at one level, HP carried between fights, items between fights only.
// Usage: node sim/summit.mjs [--trials 150] [--levels 60,64,...] [--items full|none|battle]
//   full = items between fights; battle = items only in the middle of a battle (each use costs that Mon's turn); none = no items
import fs from 'node:fs';
import * as E from '../game/core.js';
import {G, mulberry32} from './play.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const TRIALS = +opt('trials', 150);
const LEVELS = opt('levels', '56,60,64,68,72,76,80,84').split(',').map(Number);
const ITEMS = opt('items', 'full');
const DELTA = +opt('delta', 0);                 // add this to every Elite Four and Champion level
const CDELTA = +opt('cdelta', DELTA);          // separate shift for the Champion
const TEAM = opt('team', '');                    // e.g. rimeocerus:56,ripgool:61 (a fixed team instead of random ones)
const BAG = opt('bag', 'normal') === 'big' ? {hyperpotion: 30, fullrestore: 25, revive: 15, maxrevive: 10} : {hyperpotion: 15, fullrestore: 10, revive: 8, maxrevive: 4};

const src = fs.readFileSync(new URL('../game/app_script.html', import.meta.url), 'utf8');
const E4_FIGHTS = new Function('return ' + /const E4_FIGHTS = (\{[\s\S]*?\n\});/.exec(src)[1])();
const E4_KEYS = Object.keys(E4_FIGHTS);

function e4Sets(g, lv) {
  const sets = [];
  g.members.forEach((k, i) => {
    const text = E.TEAM_TEXT[k], base = E.parseTeam(text).team, lvl = E.leaderSets(text, lv);
    const total = j => Object.values(E.Dex.species.get(base[j].species).baseStats).reduce((a, b) => a + b, 0);
    const order = base.map((_, j) => j).sort((a, b) => total(b) - total(a) || a - b);
    const must = g.must[k] ? base.findIndex(b => b.species === g.must[k]) : -1;
    const pick = (must >= 0 ? [must] : []).concat(order.filter(j => j !== must)).slice(0, g.picks[i]);
    pick.sort((a, b) => a - b);
    for (const j of pick) sets.push(lvl[j]);
  });
  return sets;
}

// In battle, a Mon that is low on HP spends its turn on a heal; a healthy Mon may spend it reviving a fallen one.
// Returns the full choice string for this turn, or null to just play the AI's choice.
function itemTurn(b, aiChoice, bag) {
  const side = b.p1, active = side.active;
  const heal = () => bag.hyperpotion > 0 ? 'hyperpotion' : bag.fullrestore > 0 ? 'fullrestore' : null;
  const rev = () => bag.revive > 0 ? 'revive' : bag.maxrevive > 0 ? 'maxrevive' : null;
  let slot = -1, kind = null, target = null;
  const low = active.map((m, i) => ({m, i})).filter(x => x.m && !x.m.fainted && x.m.hp / x.m.maxhp < .35 && heal()).sort((x, y) => x.m.hp / x.m.maxhp - y.m.hp / y.m.maxhp)[0];
  if (low) { slot = low.i; kind = heal(); target = low.m; }
  else {
    const down = side.pokemon.find(p => p.fainted);
    const ok = active.map((m, i) => ({m, i})).find(x => x.m && !x.m.fainted && x.m.hp / x.m.maxhp >= .55);
    if (down && rev() && ok) { slot = ok.i; kind = rev(); target = down; }
  }
  if (!kind) return null;
  E.applyItem(b, 'p1', kind, target); bag[kind]--;
  if (b.activePerHalf === 1) {
    return E.spendTurnOnItem(b, 'p1') ? 'DONE' : null;
  }
  const ph = E.spendSlotOnItem(b, 'p1', slot);
  if (!ph) return null;
  const parts = aiChoice.split(',').map(x => x.trim()); parts[slot] = ph;
  return parts.join(', ');
}

function runTrial(L, rnd) {
  const fams = E.FAMILIES.filter(f => !f.boss).map(f => f.key);
  for (let i = fams.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [fams[i], fams[j]] = [fams[j], fams[i]]; }
  const team = TEAM ? TEAM.split(',').map(x => { const [n, lv] = x.split(':'); return E.newMember(E.regionalInfo(n).familyKey, +lv + (L ? L : 0)); }) : fams.slice(0, 6).map(k => E.newMember(k, L));
  const bag = ITEMS === 'none' ? {} : {...BAG};
  const order = E4_KEYS.slice().sort(() => rnd() - .5);
  const fights = order.map(k => ({name: k, type: E4_FIGHTS[k].mode, sets: e4Sets(E4_FIGHTS[k], G.E4_LV[order.indexOf(k)] + DELTA)}));
  fights.push({name: 'champion', type: 'singles', sets: E.leaderSets(E.CHAMPION_TEXT, G.CHAMP_LV + CDELTA)});
  let used = 0;
  for (let fi = 0; fi < fights.length; fi++) {
    // between fights: revive, then heal anything under 60%
    if (ITEMS === 'full') for (const m of team) if (m.frac <= 0) { if (bag.revive > 0) { bag.revive--; m.frac = .5; used++; } else if (bag.maxrevive > 0) { bag.maxrevive--; m.frac = 1; used++; } }
    if (ITEMS === 'full') for (let n = 0; n < 8; n++) {
      const low = team.filter(m => m.frac > 0 && m.frac < .6).sort((a, b) => a.frac - b.frac)[0];
      if (!low) break;
      if (bag.hyperpotion > 0) { bag.hyperpotion--; low.frac = Math.min(1, low.frac + .5); used++; }
      else if (bag.fullrestore > 0) { bag.fullrestore--; low.frac = 1; used++; }
      else break;
    }
    const f = fights[fi];
    const psets = E.playerSets(team);
    const seen = {};
    const names = psets.map(s => { let n = s.species; seen[n] = (seen[n] || 0) + 1; if (seen[n] > 1) n += ' ' + seen[n]; s.name = n; return n; });
    const b = E.createBattle({name: 'You', team: psets}, {name: 'Foe', team: f.sets.map(s => ({...s}))}, [0, 0, 0, 0].map(() => Math.floor(rnd() * 0x10000)), f.type);
    const state = {};
    b.p1.pokemon.forEach(p => { const m = team[names.indexOf(p.name)]; state[p.name] = {hp: m.frac <= 0 ? 0 : Math.max(1, Math.round(m.frac * p.maxhp))}; });
    E.applyTeamState(b.p1, state);
    const mem = {p1: {}, p2: {}};
    let guard = 0, itemTurns = 0;
    while (!b.ended && guard++ < 600) {
      for (const sid of ['p1', 'p2']) {
        const r = b[sid].activeRequest;
        if (!r || r.wait || b[sid].isChoiceDone()) continue;
        const ch = E.aiChoose(b, sid, mem[sid], 'normal');
        if (sid === 'p1' && ITEMS === 'battle' && ch && r.active && !r.forceSwitch && !r.teamPreview && itemTurns < 8) {
          const made = itemTurn(b, ch, bag);
          if (made) { itemTurns++; used++; if (made === 'DONE' || b.choose('p1', made)) continue; }
        }
        if (!ch || !b.choose(sid, ch)) b.choose(sid, 'default');
      }
    }
    for (const p of b.p1.pokemon) { const i = names.indexOf(p.name); if (i >= 0) team[i].frac = p.fainted ? 0 : p.hp / p.maxhp; }
    if (!(b.ended && b.winner === 'You')) return {won: false, failedAt: f.name, used};
  }
  return {won: true, used};
}

const rows = [];
for (const L of LEVELS) {
  const rnd = mulberry32(1000 + L);
  let wins = 0, used = 0; const fails = {};
  for (let t = 0; t < TRIALS; t++) {
    const r = runTrial(L, rnd);
    if (r.won) wins++; else fails[r.failedAt] = (fails[r.failedAt] || 0) + 1;
    used += r.used;
  }
  rows.push({L, pct: Math.round(wins / TRIALS * 100), used: (used / TRIALS).toFixed(1), fails});
  console.log(`level ${L}: ${wins}/${TRIALS} = ${Math.round(wins / TRIALS * 100)}%  items used ${(used / TRIALS).toFixed(1)}  lost at ${JSON.stringify(fails)}`);
}

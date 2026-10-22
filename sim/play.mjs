// One simulated playthrough of the Neofield adventure, from Route 1 to the Champion.
// It uses the real battle engine, real Mon data and the game's own XP code (game/core.js), and it reads the
// adventure constants from game/app_script.html, so what it reports is what the game would do.
import * as E from '../game/core.js';
import {loadGameData} from './gamedata.mjs';

export const G = loadGameData();

// ---------- random numbers (seeded, so a run can be repeated exactly) ----------
export function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// ---------- how long things take a real person (seconds). Change these to model a faster or slower player. ----------
export const TIME = {
  turn: 4,            // choosing a move and watching it play out, per battle turn
  wildIntro: 6,       // wild Mon appears + lead select
  trainerIntro: 14,   // trainer dialogue + lead select
  gymIntro: 28,       // leader dialogue + lead select
  resultScreen: 5,    // reading the result and XP box
  levelUp: 2,         // per level gained
  evolution: 10,      // evolution scene
  learnMove: 3,       // a move learned with a free slot
  chooseMove: 8,      // choosing which move to forget
  walk: 4,            // one trip on the map
  townHeal: 5,        // healing at the Mon Center
  shop: 25,           // a shopping visit where something is bought
  throwBall: 7,       // one Mon Ball throw
  questEnter: 8,      // opening a side quest
  questStep: 4,       // the 2-second map dot plus a tap
  itemUse: 4,         // using a bag item
  blackout: 20,       // blacking out and walking back
  retreat: 12,        // walking back to a town to heal
  shamTalk: 10,       // Team Shamburg dialogue
  champTalk: 20,
};

// ---------- player behaviour ----------
export const POLICIES = {
  // do only what the game forces: one wild fight per route, Team Shamburg, gyms, Elite Four, Champion.
  // It still trains with wild fights when the team is clearly too weak for the next leader.
  required: {desc: 'Only what the game forces (no side quests). One wild fight per route, trains with wild fights only when clearly too weak.', wildPerRoute: 1, catchTo: 3, questChance: 0, prepQuests: false, readyGap: 3, maxPrep: 40, trail: false, grindFights: 3, healBelow: 0.4},
  // a typical player: a couple of fights per route, fills the team, does about half the side quests, trains until nearly even
  normal: {desc: 'A typical player. Two wild fights per route, fills the team to 6, about half the side quests, trains until close to the leader level.', wildPerRoute: 2, catchTo: 6, questChance: 0.5, prepQuests: true, readyGap: 1, maxPrep: 40, trail: false, grindFights: 4, healBelow: 0.4},
  // a completionist: lots of fights, every side quest, all six legendary quests on Laurel Pass, trains until even
  thorough: {desc: 'A completionist. Four wild fights per route, every side quest, all six legendary quests on Laurel Pass, trains until level with the leader.', wildPerRoute: 4, catchTo: 6, questChance: 1, prepQuests: true, readyGap: 1, maxPrep: 60, trail: true, grindFights: 6, healBelow: 0.45},
};

export const DEFAULTS = {
  policy: 'normal',
  skill: 'normal',      // how well the player plays: easy | normal | hard (the battle AI levels)
  difficulty: 'normal', // the foes' AI level, same as the game's difficulty
  starter: 'cycle',     // starter1 | starter2 | starter3 | cycle
  maxAttempts: 8,       // give up on a battle after this many blackouts
  xp: null,             // override of the XP settings (merged over game/progress.js)
  time: null,           // override of TIME
};

const clone = o => JSON.parse(JSON.stringify(o));
export function mergeDeep(base, over) {
  const out = clone(base);
  const walk = (a, b) => { for (const [k, v] of Object.entries(b || {})) { if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') walk(a[k], v); else a[k] = v; } };
  walk(out, over);
  return out;
}

const SHAM_ROUTES = G.SHAMBURG.map(s => s.route);
const rnd = () => Math.random();
const pick = a => a[Math.floor(rnd() * a.length)];
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;

// ---------- the run ----------
export function playRun(seed, opts = {}) {
  const o = {...DEFAULTS, ...opts};
  const pol = {...POLICIES[o.policy], ...(o.policyOverride || {})};
  if (!pol.wildPerRoute) throw new Error(`unknown policy "${o.policy}"`);
  const T = mergeDeep(TIME, o.time);
  const XPC = mergeDeep(E.XP, o.xp);
  Math.random = mulberry32(seed);

  const starterKey = o.starter === 'cycle' ? ['starter1', 'starter2', 'starter3'][seed % 3] : o.starter;
  const S = {
    team: [E.newMember(starterKey, G.REG_START_LV)], bag: {...G.ADV_START_BAG, pokeball: 5}, money: 1500,
    t: 0, lvBy: {}, battles: 0, blackouts: 0, turns: 0, levelUps: 0, evolutions: 0, itemsUsed: 0, caught: 0,
    pos: 0, questsDone: new Set(), trailDone: false, stuck: null, gyms: [], marks: {}, e4Order: shuffle(G.ORDER.slice()).slice(0, 4),
  };
  const mark = (name, extra = {}) => { S.marks[name] = {min: S.t / 60, level: teamStats(S.team), ...extra}; };

  // ----- one battle against the real engine -----
  function battle(foeSets, kind, intro) {
    S.team.forEach(ensureMoves);
    const psets = E.playerSets(S.team);
    const seen = {};
    const names = psets.map(s => { let n = s.species; seen[n] = (seen[n] || 0) + 1; if (seen[n] > 1) n += ' ' + seen[n]; s.name = n; return n; });
    const b = E.createBattle({name: 'You', team: psets}, {name: 'Foe', team: foeSets.map(s => ({...s}))}, [0, 0, 0, 0].map(() => Math.floor(rnd() * 0x10000)));
    const state = {};
    b.p1.pokemon.forEach((p, i) => { const f = S.team[names.indexOf(p.name)].frac; state[p.name] = {hp: f <= 0 ? 0 : Math.max(1, Math.round(f * p.maxhp))}; });
    E.applyTeamState(b.p1, state);
    const mem = {p1: {}, p2: {}};
    let guard = 0;
    while (!b.ended && guard++ < 500) {
      for (const sid of ['p1', 'p2']) {
        const r = b[sid].activeRequest;
        if (!r || r.wait || b[sid].isChoiceDone()) continue;
        const ch = E.aiChoose(b, sid, mem[sid], sid === 'p1' ? o.skill : o.difficulty);
        if (!ch || !b.choose(sid, ch)) b.choose(sid, 'default');
      }
    }
    S.battles++; S.turns += b.turn;
    S.t += intro + b.turn * T.turn;
    for (const p of b.p1.pokemon) { const i = names.indexOf(p.name); if (i >= 0) S.team[i].frac = p.fainted ? 0 : p.hp / p.maxhp; }
    const won = b.ended && b.winner === 'You';
    if (!won && !b.ended) S.t += 30;
    return {won, names, parts: E.participantsFromLog(b.log, names), b};
  }

  // ----- XP, level-ups and the time they cost -----
  // gift = the flat levels the OLD system gave for this fight (only used with legacy:true, to compare against it)
  function award(res, kind, foeSets, gift = 0, tag = kind) {
    const before = S.team.reduce((a, m) => a + m.level, 0);
    const events = o.legacy ? (gift ? E.growTeam(S.team, gift) : []) : E.awardXP(S.team, res.parts, kind, foeSets.map(x => x.level), XPC);
    S.lvBy[tag] = (S.lvBy[tag] || 0) + S.team.reduce((a, m) => a + m.level, 0) - before;
    S.t += T.resultScreen;
    for (const ev of events) {
      if (ev.type === 'grew') { S.levelUps++; S.t += T.levelUp; }
      else if (ev.type === 'evolve') { S.evolutions++; S.t += T.evolution; }
      else if (ev.type === 'learned') S.t += T.learnMove;
      else if (ev.type === 'wants') { S.t += T.chooseMove; learnBest(S.team[ev.slot], ev.move); }
    }
  }
  // A sensible player keeps the stronger moves.
  function learnBest(m, move) {
    const val = name => { const mv = E.Dex.moves.get(name); if (mv.category === 'Status') return 30; return mv.basePower * (mv.accuracy === true ? 1 : mv.accuracy / 100); };
    let worst = 0;
    m.moves.forEach((x, i) => { if (val(x) < val(m.moves[worst])) worst = i; });
    if (val(move) > val(m.moves[worst])) m.moves[worst] = move;
  }

  // ----- healing -----
  const healAll = () => { S.team.forEach(m => { m.frac = 1; }); };
  function townHeal() { healAll(); S.t += T.townHeal; }
  function useItems(limit = 8) {
    let used = 0;
    for (const m of S.team) if (m.frac <= 0 && (S.bag.maxrevive > 0 || S.bag.revive > 0) && used < limit) {
      if (S.bag.revive > 0) { S.bag.revive--; m.frac = 0.5; } else { S.bag.maxrevive--; m.frac = 1; }
      used++;
    }
    while (used < limit) {
      const low = S.team.filter(m => m.frac > 0 && m.frac < 0.45).sort((a, b) => a.frac - b.frac)[0];
      if (!low) break;
      if (S.bag.hyperpotion > 0) { S.bag.hyperpotion--; low.frac = Math.min(1, low.frac + 0.5); }
      else if (S.bag.fullrestore > 0) { S.bag.fullrestore--; low.frac = 1; }
      else break;
      used++;
    }
    S.itemsUsed += used; S.t += used * T.itemUse;
    return used;
  }
  const teamHP = () => avg(S.team.map(m => m.frac));
  // between fights on a route: use items, or walk back to the last town
  function recover() {
    if (teamHP() >= pol.healBelow && S.team.some(m => m.frac > 0)) return;
    useItems();
    if (teamHP() < pol.healBelow || !S.team.some(m => m.frac > 0)) { S.t += T.retreat; townHeal(); }
  }
  function blackout() { S.blackouts++; S.t += T.blackout; healAll(); }

  function shop() {
    const want = {pokeball: S.team.length < pol.catchTo ? 6 : 2, revive: 3, hyperpotion: 8, fullrestore: 3};
    let bought = false;
    for (const id of ['pokeball', 'revive', 'hyperpotion', 'fullrestore']) {
      while ((S.bag[id] || 0) < want[id] && S.money >= G.PRICES[id]) { S.money -= G.PRICES[id]; S.bag[id] = (S.bag[id] || 0) + 1; bought = true; }
    }
    if (bought) S.t += T.shop;
  }

  // ----- catching -----
  function tryCatch(set) {
    if (!set.family || S.team.length >= pol.catchTo || S.team.length >= 6 || S.bag.pokeball <= 0) return false;
    const fam = E.familyOf(set.family);
    for (let i = 0; i < 3 && S.bag.pokeball > 0; i++) {
      S.bag.pokeball--; S.t += T.throwBall;
      if (rnd() < E.catchChance(fam.catchRate, 0.15, null)) {
        S.team.push(E.newMember(set.family, set.level)); S.caught++;
        return true;
      }
    }
    return false;
  }

  // ----- the pieces of the adventure -----
  function wildFight(r, setFor, gift = 0, tagWild = 'route') {
    for (let tries = 0; tries < 12; tries++) {
      recover();
      const set = setFor();
      const res = battle([set], 'wild', T.wildIntro);
      if (!res.won) { blackout(); continue; }
      award(res, 'wild', [set], gift, tagWild);
      tryCatch(set);
      return true;
    }
    return false;
  }
  // (same level spread as the game's routeBattle: route level -2 .. +1)
  const routeSet = r => () => E.regionalWild(r, Math.max(2, G.routeLevel(r) - 2 + Math.floor(rnd() * 4)));
  function routeWild(r) { return wildFight(r, routeSet(r), 1); }

  function shamburg(k) {
    const Sh = G.SHAMBURG[k];
    for (let attempt = 0; attempt < o.maxAttempts; attempt++) {
      townHeal();
      let ok = true;
      for (let n = 0; n < Sh.trainers.length; n++) {
        const t = Sh.trainers[n];
        const lv = Math.max(5, G.routeLevel(Sh.route) + t[2] - 1);
        S.t += T.shamTalk;
        useItems();
        const sets = Array.from({length: t[1]}, () => E.regionalWild(Sh.route, lv));
        const res = battle(sets, 'trainer', T.trainerIntro);
        if (!res.won) { blackout(); ok = false; break; }
        award(res, 'trainer', sets, n === Sh.trainers.length - 1 ? Sh.levels : 0, 'shamburg');
        S.money += G.trainerPrize(lv);
      }
      if (ok) return true;
    }
    return false;
  }

  function quest(i) {
    if (S.questsDone.has(i)) return true;
    const ar = G.AREAS[i], lv = G.questLevel(i);
    S.t += T.questEnter;
    const legend = !!ar.legend;
    for (let attempt = 0; attempt < o.maxAttempts; attempt++) {
      let ok = true;
      if (legend) {
        const mine = E.familyOf(ar.legend).stages[E.familyOf(ar.legend).stages.length - 1].types;
        let pool = E.FAMILIES.filter(f => !f.rare && f.stages[f.stages.length - 1].types.some(t => mine.includes(t))).map(f => f.key);
        if (pool.length < 2) pool = E.FAMILIES.filter(f => !f.rare).map(f => f.key);
        const take = () => pool.splice(Math.floor(rnd() * pool.length), 1)[0];
        const wilds = [E.regionalWild(17, lv, take()), E.regionalWild(17, lv + 1, take())];
        for (const w of wilds) {
          S.t += T.questStep; recover();
          const res = battle([w], 'wild', T.wildIntro);
          if (!res.won) { blackout(); ok = false; break; }
          award(res, 'wild', [w], 0, 'trail');
        }
        if (!ok) continue;
        S.t += T.questStep;
        const boss = E.regionalWild(17, ar.lv, ar.legend);
        for (let tries = 0; tries < 4; tries++) {
          recover();
          const res = battle([boss], 'legend', T.wildIntro);
          if (!res.won) { blackout(); ok = false; break; }
          // a legendary is only worth XP once caught, and the player throws balls until it works
          const fam = E.familyOf(ar.legend);
          let caught = false;
          for (let k = 0; k < 8 && S.bag.pokeball > 0; k++) {
            S.bag.pokeball--; S.t += T.throwBall;
            if (rnd() < E.catchChance(fam.catchRate, 0.1, null)) { caught = true; break; }
          }
          if (caught) {
            award(res, 'legend', [boss], 0, 'trail');
            const mon = E.newMember(ar.legend, boss.level);
            if (S.team.length < 6) S.team.push(mon);
            else { const w = S.team.reduce((a, b) => b.level < a.level ? b : a); if (mon.level > w.level) S.team[S.team.indexOf(w)] = mon; }
            S.caught++;
            S.questsDone.add(i);
            return true;
          }
          if (S.bag.pokeball <= 0) { shop(); if (S.bag.pokeball <= 0) S.bag.pokeball = 3; }
        }
        ok = false; continue;
      }
      // ordinary side quest: 3 wild Mons, then the trainer
      for (let j = 0; j < 3; j++) {
        S.t += T.questStep;
        const ok2 = wildFight(i, () => E.regionalWild(i, Math.max(2, lv - 2 + j)), 0, 'quest');
        if (!ok2) { ok = false; break; }
      }
      if (!ok) continue;
      S.t += T.questStep + T.trainerIntro;
      useItems();
      const sets = [0, 1, 2].map(() => E.randomMon(lv + 1, ar.types, true));
      const res = battle(sets, 'trainer', 0);
      if (!res.won) { blackout(); continue; }
      award(res, 'trainer', sets, 0, 'quest');
      S.money += G.trainerPrize(lv);
      S.bag.hyperpotion += 2; S.bag.fullrestore += 1; S.bag.revive += 1;
      S.questsDone.add(i);
      return true;
    }
    return false;
  }

  function trail() {
    if (S.trailDone) return;
    const keys = E.FAMILIES.filter(f => !f.rare).map(f => f.key);
    for (let i = 0; i < G.TRAIL_TRAINERS.length; i++) {
      const lv = G.trailLv(i);
      for (let attempt = 0; attempt < 4; attempt++) {
        recover(); S.t += T.trainerIntro;
        const sets = [0, 1, 2].map(() => E.regionalWild(17, lv, pick(keys)));
        const res = battle(sets, 'trainer', 0);
        if (!res.won) { blackout(); continue; }
        award(res, 'trainer', sets, 0, 'trail'); S.money += G.trainerPrize(lv);
        break;
      }
      if (i % 4 === 3) { townHeal(); shop(); }
    }
    if (pol.trail) for (let i = G.AREAS.length - 6; i < G.AREAS.length; i++) { townHeal(); shop(); quest(i); }
    S.trailDone = true;
  }

  // ----- gyms, Elite Four, Champion -----
  function leaderFight(kind, key, lv, label) {
    const sets = kind === 'champion' ? E.leaderSets(S.champTeam || (S.champTeam = E.buildChampionTeam(G.ORDER.map(k => E.TEAM_TEXT[k]))), lv) : E.leaderSets(E.TEAM_TEXT[key], lv);
    const res = battle(sets, 'gym', kind === 'gym' ? T.gymIntro : kind === 'champion' ? T.champTalk + T.gymIntro : T.trainerIntro + 8);
    return {res, sets};
  }

  // Train until the best three Mons are within readyGap levels of the next opponent (or the player runs out of patience).
  const topAvg = () => { const l = S.team.map(m => m.level).sort((a, b) => b - a).slice(0, 3); return avg(l); };
  function prep(target, pos) {
    let n = 0;
    while (topAvg() < target - pol.readyGap && n < pol.maxPrep) {
      if (pol.prepQuests) {
        const i = [...Array(Math.min(pos, G.AREAS.length - 6)).keys()].find(q => !S.questsDone.has(q));
        if (i !== undefined) { quest(i); n += 4; continue; }
        if (pos >= 17 && !S.trailDone) { trail(); n += 20; continue; }
      }
      wildFight(Math.min(pos, 17), routeSet(Math.min(pos, 17)), 1, 'prep'); n++;
    }
    S.prepFights = (S.prepFights || 0) + n;
  }

  function gym(k) {
    const lv = G.GYM_LV[k];
    const rec = {gym: k + 1, key: G.JORDER[k], lv, team: teamStats(S.team), size: S.team.length, attempts: 0, minAtStart: S.t / 60};
    for (let attempt = 1; attempt <= o.maxAttempts; attempt++) {
      rec.attempts = attempt;
      if (attempt === 1) { prep(lv, k); rec.team = teamStats(S.team); rec.size = S.team.length; }
      townHeal(); shop();
      const {res, sets} = leaderFight('gym', G.JORDER[k], lv);
      if (res.won) {
        award(res, 'gym', sets, 2, 'gym');
        S.money += G.gymPrize(lv);
        S.bag.hyperpotion += 2; S.bag.fullrestore += 1; S.bag.revive += 1;
        healAll();
        rec.min = S.t / 60; rec.after = teamStats(S.team);
        S.gyms.push(rec);
        return true;
      }
      blackout();
      prep(lv + attempt * 2, k);   // a player who lost trains harder before trying again
    }
    rec.min = S.t / 60; rec.failed = true; S.gyms.push(rec);
    return false;
  }

  function eliteFour() {
    const out = {attempts: 0};
    for (let attempt = 1; attempt <= o.maxAttempts; attempt++) {
      out.attempts = attempt;
      if (attempt === 1) prep(G.E4_LV[3], 18);
      townHeal(); shop();
      let ok = true;
      for (let n = 0; n < 4; n++) {
        S.t += T.walk; useItems();
        const {res, sets} = leaderFight('e4', S.e4Order[n], G.E4_LV[n]);
        if (!res.won) { blackout(); ok = false; break; }
        award(res, 'gym', sets, 0, 'e4'); S.money += G.E4_PRIZE;
        S.bag.hyperpotion += 2; S.bag.fullrestore += 2; S.bag.revive += 1;
      }
      if (ok) return out;
      prep(G.E4_LV[3] + attempt * 2, 18);
    }
    out.failed = true;
    return out;
  }

  function champion() {
    const out = {attempts: 0};
    for (let attempt = 1; attempt <= o.maxAttempts; attempt++) {
      out.attempts = attempt;
      S.t += T.walk; useItems();
      const {res, sets} = leaderFight('champion', null, G.CHAMP_LV);
      if (res.won) { award(res, 'gym', sets, 0, 'champion'); S.money += G.CHAMP_PRIZE; return out; }
      blackout();
      prep(G.CHAMP_LV + attempt * 2, 18);
      // the Elite Four have to be beaten again after a loss
      const again = eliteFour();
      if (again.failed) break;
      out.attempts = attempt;
    }
    out.failed = true;
    return out;
  }

  // ===== the whole adventure =====
  let aborted = false;
  for (let k = 0; k < 17 && !aborted; k++) {
    S.pos = k;
    // walk Route k+1 (map index k): at least one wild fight, plus Team Shamburg on routes 4, 9 and 14
    S.t += T.walk;
    for (let n = 0; n < pol.wildPerRoute; n++) routeWild(k);
    const sh = SHAM_ROUTES.indexOf(k);
    if (sh >= 0 && !shamburg(sh)) { S.stuck = `Team Shamburg ${sh + 1}`; aborted = true; break; }
    S.t += T.walk;
    if (!gym(k)) { S.stuck = `Gym ${k + 1}`; aborted = true; break; }
    S.pos = k + 1;
    if (rnd() < pol.questChance) quest(k);
  }
  if (aborted) return finish();
  mark('allBadges');
  S.t += T.walk; trail();   // the Laurel Pass is the road to Victory Summit: its 12 trainers are mandatory, the six legendary quests are optional
  mark('beforeE4');
  const e4 = eliteFour();
  mark('e4', {attempts: e4.attempts});
  if (e4.failed) { S.stuck = 'Elite Four'; return finish(); }
  const ch = champion();
  mark('champion', {attempts: ch.attempts});
  if (ch.failed) S.stuck = 'Champion';
  return finish();

  function finish() {
    return {
      seed, starter: starterKey, policy: o.policy, stuck: S.stuck, gyms: S.gyms, marks: S.marks,
      minutes: S.t / 60, battles: S.battles, turns: S.turns, blackouts: S.blackouts, levelUps: S.levelUps, evolutions: S.evolutions,
      itemsUsed: S.itemsUsed, lvBy: S.lvBy, prepFights: S.prepFights || 0, caught: S.caught, quests: S.questsDone.size, teamSize: S.team.length,
      finalTeam: S.team.map(m => ({species: m.final.species, level: m.level})).sort((a, b) => b.level - a.level),
    };
  }
}

function ensureMoves(m) { if (!Array.isArray(m.moves) || !m.moves.length) m.moves = E.startingMoves(m.final, m.level, m.tutored || []); }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export function teamStats(team) {
  const lv = team.map(m => m.level).sort((a, b) => b - a);
  return {top: lv[0], top3: Math.round(avg(lv.slice(0, 3)) * 10) / 10, avg: Math.round(avg(lv) * 10) / 10, low: lv[lv.length - 1], levels: lv};
}

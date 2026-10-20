import {createBattle, parseTeam, aiChoose, applyItem, itemProblem, spendTurnOnItem, recountLeft, applyTeamState, readTeamState, ITEMS,
  parseSets, setAtLevel, leaderSets, randomMon, TEAM_TEXT} from './engine.js';
const names = Object.keys(TEAM_TEXT);
const R = a => a[Math.floor(Math.random() * a.length)];
let games = 0, problems = [], itemTurns = 0, itemTurnMoved = 0, revives = 0, stuck = 0;
function check(b, tag) {
  for (const side of [b.p1, b.p2]) {
    for (const p of side.pokemon) {
      if (p.hp < 0 || p.hp > p.maxhp) problems.push(`${tag}: ${p.name} hp ${p.hp}/${p.maxhp}`);
      if (p.hp === 0 && !p.fainted && !b.ended) problems.push(`${tag}: ${p.name} at 0 HP but not fainted`);
      if (p.fainted && p.hp !== 0) problems.push(`${tag}: ${p.name} fainted with hp ${p.hp}`);
    }
    const alive = side.pokemon.filter(p => !p.fainted).length;
    if (side.pokemonLeft !== alive && !b.ended) problems.push(`${tag}: ${side.id} pokemonLeft ${side.pokemonLeft} vs alive ${alive}`);
  }
}
for (let g = 0; g < 1500; g++) {
  const mode = g % 3; // 0 = full teams, 1 = carried HP with fainted members, 2 = adventure levels
  const a = R(names), c = R(names);
  let t1, t2;
  if (mode === 2) { const lv = 5 + Math.floor(Math.random() * 66); t1 = parseSets(TEAM_TEXT[a]).map(s => setAtLevel(s, lv)); t2 = Math.random() < .5 ? leaderSets(TEAM_TEXT[c], lv) : [randomMon(lv), randomMon(lv)]; }
  else { t1 = parseTeam(TEAM_TEXT[a]).team; t2 = parseTeam(TEAM_TEXT[c]).team; }
  const b = createBattle({name: 'P', team: t1}, {name: 'C', team: t2});
  if (mode === 1) { const st = {}; b.p1.pokemon.forEach((p, i) => st[p.name] = {hp: i === 0 ? p.maxhp : (Math.random() < .3 ? 0 : Math.ceil(p.maxhp * Math.random()))}); applyTeamState(b.p1, st); }
  const mem = {}; const tag = `${a} vs ${c} (mode ${mode})`;
  let guard = 0;
  try {
    while (!b.ended && guard++ < 600) {
      const r2 = b.p2.activeRequest; if (r2 && !r2.wait && !b.p2.isChoiceDone()) { const ch = aiChoose(b, 'p2', mem, R(['easy', 'normal', 'hard'])); if (!b.choose('p2', ch)) b.choose('p2', 'default'); }
      const r1 = b.p1.activeRequest;
      if (!r1 || r1.wait || b.p1.isChoiceDone()) continue;
      if (r1.teamPreview) { const lead = b.p1.pokemon.findIndex(p => !p.fainted) + 1; b.choose('p1', 'team ' + [lead, ...b.p1.pokemon.map((_, i) => i + 1).filter(i => i !== lead)].join('')); recountLeft(b.p1); check(b, tag); continue; }
      if (!r1.forceSwitch && Math.random() < 0.3) {
        const opts = [];
        for (const id of Object.keys(ITEMS)) for (const p of b.p1.pokemon) if (!itemProblem(id, p)) opts.push([id, p]);
        if (opts.length) {
          const [id, p] = R(opts);
          if (ITEMS[id].revive) revives++;
          const me = b.p1.active[0].name, start = b.log.length;
          applyItem(b, 'p1', id, p);
          spendTurnOnItem(b, 'p1'); recountLeft(b.p1);
          itemTurns++;
          if (b.log.slice(start).some(l => l.startsWith(`|move|p1a: ${me}|`))) { itemTurnMoved++; if (itemTurnMoved <= 5) console.log("MOVED:", b.log.slice(start).filter(l => /move|-activate|-start|cant|ability|-message/.test(l)).join("  ")); }
          check(b, tag + ' after item ' + id);
          continue;
        }
      }
      const choices = [];
      if (!r1.forceSwitch) r1.active[0].moves.forEach((m, i) => { if (!m.disabled) choices.push(`move ${i + 1}`); });
      r1.side.pokemon.forEach((p, i) => { if (!p.active && !p.condition.endsWith('fnt')) choices.push(`switch ${i + 1}`); });
      if (!b.choose('p1', choices.length ? R(choices) : 'default')) b.choose('p1', 'default');
      recountLeft(b.p1);
      check(b, tag);
    }
    if (!b.ended) { stuck++; if (stuck < 4) problems.push(`${tag}: battle did not finish in 600 steps (turn ${b.turn})`); }
    else { const st = readTeamState(b.p1); for (const [n, s] of Object.entries(st)) if (s.hp < 0 || s.hp > s.maxhp) problems.push(`${tag}: saved bad hp for ${n}`); }
  } catch (e) { problems.push(`${tag}: ERROR ${e.message.slice(0, 160)}`); }
  games++;
}
const uniq = [...new Set(problems)];
console.log({games, itemTurns, itemTurnMoved, revives, stuck, problems: uniq.length});
console.log(uniq.slice(0, 15).join('\n'));

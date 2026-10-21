import {chainOf, setAtLevel, leaderSets, randomMon, levelUp, tutorOptions, parseSets, createBattle, aiChoose, TEAM_TEXT} from './core.js';
for (const [k, text] of Object.entries(TEAM_TEXT)) {
  const sets = parseSets(text);
  console.log(k + ': ' + sets.map(s => chainOf(s.species).map(c => `${c.sp.name}${c.at > 1 ? '@' + c.at : ''}`).join('>')).join(' | '));
}
const t = parseSets(TEAM_TEXT.trever);
for (const lv of [8, 20, 45, 70]) console.log('Trever team at', lv, ':', t.map(s => { const x = setAtLevel(s, lv); return `${x.species}[${x.moves.join(', ')}]${x.item ? ' @' + x.item : ''}`; }).join(' ; '));
const team = parseSets(TEAM_TEXT.tyler).map(s => ({final: s, level: 8, frac: 1, tutored: []}));
console.log('levelUp lines (8->16):', levelUp(team, 8).filter(l => !l.includes('grew')).join(' | '));
console.log('tutor options for', team[0].final.species, tutorOptions(team[0]));
for (let i = 0; i < 4; i++) { const w = randomMon(12 + i * 15, i % 2 ? ['Water'] : null); console.log('wild', w.species, w.level, w.moves.join(', ')); }
// run many battles at mixed levels to catch engine errors
let errs = 0, games = 0;
for (const [k, text] of Object.entries(TEAM_TEXT)) for (const lv of [10, 35, 60]) {
  try {
    const p1 = parseSets(TEAM_TEXT.anna).map(s => setAtLevel(s, lv));
    const p2 = Math.random() < .5 ? leaderSets(text, lv) : [randomMon(lv), randomMon(lv), randomMon(lv)];
    const b = createBattle({name: 'a', team: p1}, {name: 'b', team: p2});
    const mem = {p1: {}, p2: {}}; let g = 0;
    while (!b.ended && g++ < 800) for (const sid of ['p1', 'p2']) { const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue; const c = aiChoose(b, sid, mem[sid], 'normal'); if (!b.choose(sid, c)) b.choose(sid, 'default'); }
    if (!b.ended) { errs++; console.log('stuck', k, lv); } games++;
  } catch (e) { errs++; console.log('ERR', k, lv, e.message.slice(0, 200)); }
}
console.log({games, errs});

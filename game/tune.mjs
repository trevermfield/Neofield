import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './core.js';
const names = Object.keys(TEAM_TEXT);
const [A, B] = [JSON.parse(process.argv[2]), JSON.parse(process.argv[3])];
const N = +(process.argv[4] || 1);
let w = 0, t = 0;
for (const a of names) for (const c of names) { if (a === c) continue; for (let g = 0; g < N; g++) {
  const b = createBattle({name: 'P', team: parseTeam(TEAM_TEXT[a]).team}, {name: 'C', team: parseTeam(TEAM_TEXT[c]).team});
  const mem = {p1: {}, p2: {}}; let guard = 0;
  while (!b.ended && guard++ < 1000) for (const sid of ['p1', 'p2']) {
    const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue;
    const ch = aiChoose(b, sid, mem[sid], sid === 'p1' ? A : B); if (ch && !b.choose(sid, ch)) b.choose(sid, 'default');
  }
  t++; if (b.winner === 'P') w++;
}}
console.log(process.argv[5] || '', (w / t).toFixed(3));

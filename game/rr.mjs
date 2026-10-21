import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './core.js';
import fs from 'fs';
const names = Object.keys(TEAM_TEXT);
const N = +process.argv[2] || 3;
const wins = Object.fromEntries(names.map(n => [n, 0])), games = Object.fromEntries(names.map(n => [n, 0]));
const pair = {};
for (const a of names) for (const c of names) {
  if (a === c) continue;
  for (let g = 0; g < N; g++) {
    const b = createBattle({name: a, team: parseTeam(TEAM_TEXT[a]).team}, {name: c, team: parseTeam(TEAM_TEXT[c]).team});
    const mem = {p1: {}, p2: {}}; let guard = 0;
    while (!b.ended && guard++ < 1000) for (const sid of ['p1', 'p2']) {
      const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue;
      const ch = aiChoose(b, sid, mem[sid]); if (ch && !b.choose(sid, ch)) b.choose(sid, 'default');
    }
    games[a]++; games[c]++;
    if (b.winner === a) { wins[a]++; pair[a + '>' + c] = (pair[a + '>' + c] || 0) + 1; }
    else if (b.winner === c) { wins[c]++; pair[c + '>' + a] = (pair[c + '>' + a] || 0) + 1; }
  }
}
const rank = names.map(n => [n, +(wins[n] / games[n]).toFixed(3)]).sort((x, y) => x[1] - y[1]);
fs.writeFileSync('rank.json', JSON.stringify({rank, pair}, null, 1));
console.log(rank);

import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './core.js';
import fs from 'fs';
const names = Object.keys(TEAM_TEXT);
const N = 3;
const res = {};
for (const oppLevel of ['easy', 'normal', 'hard']) {
  let never = [], total = 0, wins = 0;
  for (const a of names) for (const c of names) {
    if (a === c) continue;
    let w = 0;
    for (let g = 0; g < N; g++) {
      const b = createBattle({name: 'P', team: parseTeam(TEAM_TEXT[a]).team}, {name: 'C', team: parseTeam(TEAM_TEXT[c]).team});
      const mem = {p1: {}, p2: {}}; let guard = 0;
      while (!b.ended && guard++ < 1000) for (const sid of ['p1', 'p2']) {
        const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue;
        const ch = aiChoose(b, sid, mem[sid], sid === 'p1' ? 'hard' : oppLevel); if (ch && !b.choose(sid, ch)) b.choose(sid, 'default');
      }
      total++; if (b.winner === 'P') { w++; wins++; }
    }
    if (!w) never.push(`${a} vs ${c}`);
  }
  res[oppLevel] = {playerWinRate: +(wins / total).toFixed(3), pairsNeverWon: never.length, never};
  console.log(oppLevel, res[oppLevel].playerWinRate, never.length);
}
fs.writeFileSync('diff.json', JSON.stringify(res, null, 1));

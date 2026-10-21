import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './core.js';
const names = Object.keys(TEAM_TEXT).filter(n => n !== 'kent');
let wins = 0, games = 0, errors = 0, heroes = 0;
for (const opp of names) for (let g = 0; g < 4; g++) {
  const [a, c] = g % 2 ? ['kent', opp] : [opp, 'kent'];
  const b = createBattle({name: a, team: parseTeam(TEAM_TEXT[a]).team}, {name: c, team: parseTeam(TEAM_TEXT[c]).team});
  const mem = {p1: {}, p2: {}}; let guard = 0;
  while (!b.ended && guard++ < 1000) for (const sid of ['p1', 'p2']) {
    const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue;
    const ch = aiChoose(b, sid, mem[sid]); if (ch && !b.choose(sid, ch)) { errors++; b.choose(sid, 'default'); }
  }
  if (!b.ended) { errors++; continue; }
  games++; if (b.winner === 'kent') wins++;
  if (b.log.some(l => l.includes('Palafin-Hero'))) heroes++;
}
console.log({games, wins: wins, errors, gamesWithHeroPalafin: heroes});

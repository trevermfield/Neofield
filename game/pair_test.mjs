import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './engine.js';
const pairs = [['charlotte','oksana'],['lillian','tanner'],['lillian','makenna'],['lillian','theo'],['lillian','anna']];
for (const [a, c] of pairs) { let w = 0; const N = 20;
  for (let g = 0; g < N; g++) {
    const b = createBattle({name: 'P', team: parseTeam(TEAM_TEXT[a]).team}, {name: 'C', team: parseTeam(TEAM_TEXT[c]).team});
    const mem = {p1: {}, p2: {}}; let guard = 0;
    while (!b.ended && guard++ < 1000) for (const sid of ['p1', 'p2']) {
      const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue;
      const ch = aiChoose(b, sid, mem[sid], sid === 'p1' ? 'hard' : 'easy'); if (ch && !b.choose(sid, ch)) b.choose(sid, 'default');
    }
    if (b.winner === 'P') w++;
  }
  console.log(`${a} vs ${c} on Easy: ${w}/${N}`);
}

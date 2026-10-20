// Simulate the level curve: player trains ~1 time per gym, beats gyms in order. Check matchups stay close.
import {parseSets, playerSets, leaderSets, levelUp, createBattle, aiChoose, TEAM_TEXT} from './engine.js';
const JORDER = ['lillian','trever','oksana','charlotte','tyler','tucker','kaley','makenna','lynne','tanner','theo','jack','tali','parker','kent','rachel','anna'];
const GYM = JORDER.map((_, i) => Math.round(10 + i * 50 / 16));
let wins = 0, games = 0;
for (const mine of ['trever', 'tucker', 'charlotte']) {
  const team = parseSets(TEAM_TEXT[mine]).map(s => ({final: s, level: 8, frac: 1, tutored: []}));
  const row = [];
  for (let i = 0; i < 17; i++) {
    while (team[0].level < GYM[i] + 1) levelUp(team, 1); // a bit of training before each gym
    const b = createBattle({name: 'P', team: playerSets(team)}, {name: 'L', team: leaderSets(TEAM_TEXT[JORDER[i]], GYM[i])});
    const mem = {p1: {}, p2: {}}; let g = 0;
    while (!b.ended && g++ < 800) for (const sid of ['p1', 'p2']) { const r = b[sid].activeRequest; if (!r || r.wait || b[sid].isChoiceDone()) continue; const c = aiChoose(b, sid, mem[sid], sid === 'p1' ? 'hard' : 'normal'); if (!b.choose(sid, c)) b.choose(sid, 'default'); }
    games++; if (b.winner === 'P') wins++;
    row.push(`${JORDER[i]}@${GYM[i]}:${b.winner === 'P' ? 'W' : 'L'}`);
    levelUp(team, 2);
  }
  console.log(mine, row.join(' '));
}
console.log('player wins', wins, 'of', games, '(player one level above each gym, computer on Normal)');

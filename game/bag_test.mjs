import {createBattle, parseTeam, aiChoose, applyItem, spendTurnOnItem, recountLeft, TEAM_TEXT} from './core.js';
let skipped = 0, attacked = 0;
for (let g = 0; g < 30; g++) {
  const b = createBattle({name: 'me', team: parseTeam(TEAM_TEXT.anna).team}, {name: 'cpu', team: parseTeam(TEAM_TEXT.lillian).team});
  b.choose('p2', aiChoose(b, 'p2', {}, 'easy')); b.choose('p1', 'team 123456'); recountLeft(b.p1);
  for (let t = 0; t < 3 && !b.ended; t++) {
    const req = b.p1.activeRequest; if (!req || req.forceSwitch || !b.p1.active[0] || b.p1.active[0].fainted) break;
    const me = b.p1.active[0].name;
    const start = b.log.length;
    applyItem(b, 'p1', 'hyperpotion', b.p1.active[0]);
    const c = aiChoose(b, 'p2', {}, 'easy'); if (!b.choose('p2', c)) b.choose('p2', 'default');
    spendTurnOnItem(b, 'p1');
    const turn = b.log.slice(start);
    if (turn.some(l => l.startsWith(`|move|p1a: ${me}|`))) attacked++; else skipped++;
    // let the next turn be a normal attack so the volatile can't linger
    if (b.ended) break;
    const r1 = b.p1.activeRequest; if (r1 && r1.forceSwitch) break;
    b.choose('p2', aiChoose(b, 'p2', {}, 'easy') || 'default'); const s2 = b.log.length; b.choose('p1', 'move 1');
    if (!b.log.slice(s2).some(l => l.startsWith('|move|p1a:')) && !b.ended && !b.log.slice(s2).some(l => /\|cant\|p1a|faint\|p1a|\|-activate\|p1a/.test(l))) console.log('normal move did not happen:', b.log.slice(s2).join(' '));
  }
}
console.log({itemTurnsSkippedMove: skipped, itemTurnsStillAttacked: attacked});

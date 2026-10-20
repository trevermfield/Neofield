import {createBattle, parseTeam, aiChoose, estimate, TEAM_TEXT} from './engine.js';
const names = Object.keys(TEAM_TEXT);
const wins = {}; let errors = 0, turns = 0, games = 0;
// effectiveness spot check
{
  const b = createBattle({name:'a',team:parseTeam(TEAM_TEXT.tanner).team},{name:'b',team:parseTeam(TEAM_TEXT.trever).team},[1,2,3,4]);
  const lapras = b.p1.pokemon.find(p=>p.name==='Lapras'), emp = b.p2.pokemon.find(p=>p.name==='Empoleon'), stx=b.p2.pokemon.find(p=>p.name==='Steelix');
  console.log('freezedry vs empoleon', estimate(b, lapras, emp, 'freezedry'));
  console.log('surf vs steelix', estimate(b, lapras, stx, 'surf'));
  const mag=b.p2.pokemon.find(p=>p.name==='Magneton'); const mam=b.p1.pokemon.find(p=>p.name==='Mamoswine');
  console.log('eq vs magneton', estimate(b, mam, mag, 'earthquake'), 'tbolt vs lapras', estimate(b, mag, lapras,'thunderbolt'));
}
for (const a of names) for (const c of names) {
  if (a === c) continue;
  for (let g = 0; g < 2; g++) {
    const b = createBattle({name: a, team: parseTeam(TEAM_TEXT[a]).team}, {name: c, team: parseTeam(TEAM_TEXT[c]).team});
    const mem = {p1: {}, p2: {}};
    let guard = 0;
    while (!b.ended && guard++ < 1000) {
      for (const sid of ['p1', 'p2']) {
        const req = b[sid].activeRequest;
        if (!req || req.wait || b[sid].isChoiceDone && b[sid].isChoiceDone()) continue;
        const ch = aiChoose(b, sid, mem[sid]);
        if (ch && !b.choose(sid, ch)) { errors++; console.log('BAD', sid, ch, JSON.stringify(req.active?.[0]?.moves?.map(m=>m.id+':'+m.disabled))); b.choose(sid,'default'); }
      }
    }
    if (!b.ended) { console.log('STUCK', a, c, b.turn); errors++; continue; }
    games++; turns += b.turn;
    wins[`${a} vs ${c}`] = (wins[`${a} vs ${c}`] || 0) + (b.winner === a ? 1 : 0);
  }
}
console.log('games', games, 'avg turns', (turns / games).toFixed(1), 'errors', errors);
console.log(wins);

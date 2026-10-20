import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './engine.js';
// Two clients, same seed, choices arrive in different orders -> identical battles
let diffs = 0;
for (let g = 0; g < 30; g++) {
  const seed = [g, 2*g, 3, 4];
  const mk = () => createBattle({name:'Trever',team:parseTeam(TEAM_TEXT.trever).team},{name:'Tyler',team:parseTeam(TEAM_TEXT.tyler).team}, seed);
  const ref = mk(); const choices = {p1:[],p2:[]}; const mem={p1:{},p2:{}};
  while(!ref.ended){ for(const s of ['p1','p2']){const r=ref[s].activeRequest; if(!r||r.wait||ref[s].isChoiceDone())continue; let c=aiChoose(ref,s,mem[s]); if(!ref.choose(s,c)){c='default'; ref.choose(s,c);} choices[s].push(c);} }
  // replica applies queued in reversed side order
  const rep = mk(); const ap={p1:0,p2:0}; let prog=true;
  while(prog && !rep.ended){prog=false; for(const s of ['p2','p1']){const r=rep[s].activeRequest; if(!r||r.wait||rep[s].isChoiceDone())continue; const c=choices[s][ap[s]]; if(c===undefined)continue; ap[s]++; if(!rep.choose(s,c)) rep.choose(s,'default'); prog=true;}}
  const f=l=>l.filter(x=>!x.startsWith('|t:|')).join('\n'); if (f(rep.log) !== f(ref.log) || rep.winner !== ref.winner) diffs++;
}
console.log('determinism mismatches:', diffs, 'of 30');
// find first divergence for a failing game
for (let g = 0; g < 30; g++) {
  const seed = [g, 2*g, 3, 4];
  const mk = () => createBattle({name:'Trever',team:parseTeam(TEAM_TEXT.trever).team},{name:'Tyler',team:parseTeam(TEAM_TEXT.tyler).team}, seed);
  const ref = mk(); const choices = {p1:[],p2:[]}; const mem={p1:{},p2:{}};
  while(!ref.ended){ for(const s of ['p1','p2']){const r=ref[s].activeRequest; if(!r||r.wait||ref[s].isChoiceDone())continue; let c=aiChoose(ref,s,mem[s]); if(!ref.choose(s,c)){c='default'; ref.choose(s,c);} choices[s].push(c);} }
  const rep = mk(); const ap={p1:0,p2:0}; let prog=true;
  while(prog && !rep.ended){prog=false; for(const s of ['p2','p1']){const r=rep[s].activeRequest; if(!r||r.wait||rep[s].isChoiceDone())continue; const c=choices[s][ap[s]]; if(c===undefined)continue; ap[s]++; if(!rep.choose(s,c)) {console.log('replica rejected',s,c);rep.choose(s,'default');} prog=true;}}
  const a=ref.log, b=rep.log; let i=0; while(i<a.length && a[i]===b[i]) i++;
  if (i<a.length || a.length!==b.length) { console.log('game',g,'diverge at',i); console.log('REF', a.slice(i-3,i+3)); console.log('REP', b.slice(i-3,i+3)); console.log(choices); break; }
}

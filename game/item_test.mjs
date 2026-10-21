import {recountLeft, createBattle, parseTeam, aiChoose, applyItem, itemProblem, spendTurnOnItem, readTeamState, applyTeamState, buildChampionTeam, TEAM_TEXT, FORMAT} from './core.js';
// 1) carryover with a fainted member + revive mid-battle
const b = createBattle({name:'me',team:parseTeam(TEAM_TEXT.trever).team},{name:'cpu',team:parseTeam(TEAM_TEXT.tyler).team},[1,2,3,4]);
const st = {}; for (const p of b.p1.pokemon) st[p.name] = {hp: Math.floor(p.maxhp/3)}; st['Skarmory'] = {hp: 0};
applyTeamState(b.p1, st);
console.log('pokemonLeft after carryover', b.p1.pokemonLeft, 'skarm fainted', b.p1.pokemon.find(p=>p.name==='Skarmory').fainted);
b.choose('p1','team 123456'); b.choose('p2', aiChoose(b,'p2',{}, 'hard')); recountLeft(b.p1); console.log('left after start', b.p1.pokemonLeft);
const sk = b.p1.pokemon.find(p=>p.name==='Skarmory');
console.log('revive problem?', JSON.stringify(itemProblem('revive', sk)), '| potion on skarm problem:', itemProblem('hyperpotion', sk));
applyItem(b,'p1','revive',sk);
const act = b.p1.active[0]; const hpBefore = act.hp;
applyItem(b,'p1','hyperpotion',act);
console.log('active', act.name, hpBefore, '->', act.hp, 'left', b.p1.pokemonLeft);
b.choose('p2', aiChoose(b,'p2',{}, 'hard'));
console.log('spend turn ok', spendTurnOnItem(b,'p1'));
console.log(b.log.slice(-12).filter(l=>/move|message|damage|turn|cant/.test(l)).join('\n'));
// 2) play out with skarmory switching in later
const mem={p1:{},p2:{}}; let g=0; let skIn=false;
while(!b.ended && g++<500){ for(const s of ['p1','p2']){const r=b[s].activeRequest; if(!r||r.wait||b[s].isChoiceDone())continue; const c=aiChoose(b,s,mem[s],'normal'); if(!b.choose(s,c)) b.choose(s,'default');} if(b.p1.active[0]?.name==='Skarmory') skIn=true; }
console.log('ended', b.ended, 'winner', b.winner, 'revived Skarmory battled:', skIn);
console.log('state', JSON.stringify(readTeamState(b.p1)));
// 3) champion
for (let i=0;i<3;i++){ const t=buildChampionTeam(Object.values(TEAM_TEXT)); console.log('champ:', parseTeam(t).team.map(s=>s.species+'@'+s.item).join(', '), parseTeam(t).problems.length?'INVALID':'valid'); }

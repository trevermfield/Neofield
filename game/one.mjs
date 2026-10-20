import {createBattle, parseTeam, aiChoose, TEAM_TEXT} from './engine.js';
const b = createBattle({name:'trever',team:parseTeam(TEAM_TEXT.trever).team},{name:'tanner',team:parseTeam(TEAM_TEXT.tanner).team},[5,6,7,8]);
const mem={p1:{},p2:{}};
while(!b.ended){for(const s of ['p1','p2']){const r=b[s].activeRequest;if(!r||r.wait)continue;const c=aiChoose(b,s,mem[s]);b.choose(s,c);}}
console.log(b.log.filter(l=>/^\|(move|switch|faint|turn|win|-mega|-weather\|[A-Z])/.test(l)).join('\n'));

import {createBattle, parseTeam, estimate, TEAM_TEXT} from './engine.js';
const b = createBattle({name:'a',team:parseTeam(TEAM_TEXT.rachel).team},{name:'b',team:parseTeam(TEAM_TEXT.makenna).team},[1,2,3,4]);
const g=n=>[...b.p1.pokemon,...b.p2.pokemon].find(p=>p.name===n);
console.log('sylveon hypervoice vs hydreigon', estimate(b,g('Sylveon'),g('Hydreigon'),'hypervoice'));
console.log('blissey seismic vs umbreon', estimate(b,g('Blissey'),g('Umbreon'),'seismictoss'));
console.log('blissey seismic vs zoroark (ghost? no)', estimate(b,g('Blissey'),g('Zoroark'),'seismictoss'));

import {parseSets, startingMoves, growTeam, playerSets, statsAt, TEAM_TEXT} from './core.js';
const team = parseSets(TEAM_TEXT.trever).map(s => ({final: s, level: 8, tutored: [], moves: startingMoves(s, 8)}));
console.log('start:', team.map(m => m.moves.join('/')).join(' | '));
let ev = [];
for (let i = 0; i < 40; i++) ev.push(...growTeam(team, 1).filter(e => e.type !== 'grew' && e.slot === 0));
console.log('Beldum line 8->48:', ev.map(e => e.type === 'evolve' ? `EVOLVE ${e.from}->${e.to}` : `${e.type}:${e.move}`).join(', '));
console.log('sets valid:', playerSets(team).every(s => s.moves.length >= 1 && s.moves.length <= 4));
console.log(statsAt(team[0].final, 20, team[0].moves).stats, statsAt(team[0].final, 19, team[0].moves).stats);

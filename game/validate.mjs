import {Teams, TeamValidator, Dex} from '@pkmn/sim';
import fs from 'fs';
const v = TeamValidator.get('gen9nationaldexubers');
for (const f of fs.readdirSync('.').filter(f=>f.endsWith('_team.txt'))) {
  const txt = fs.readFileSync(f,'utf8').split('\n').filter(l=>!l.startsWith('===')).join('\n');
  const team = Teams.import(txt);
  const probs = v.validateTeam(team);
  console.log(f, team.length, probs || 'OK');
}

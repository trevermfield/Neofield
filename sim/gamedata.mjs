// Reads the adventure constants straight out of game/app_script.html so the simulator always
// uses the numbers the real game uses (gym levels, areas, Team Shamburg, prices, ...).
// If the game's code changes shape, this throws a clear error instead of silently drifting.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const APP_PATH = path.join(here, '..', 'game', 'app_script.html');

// Take one top-level statement (const X = ...; or AREAS.push(...);) starting at a line that begins with `start`.
function statement(src, start) {
  const i = src.search(new RegExp('^' + start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'm'));
  if (i < 0) throw new Error(`sim: could not find "${start}" in app_script.html (the game changed shape? update sim/gamedata.mjs)`);
  let depth = 0, q = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === '\'' || c === '"' || c === '`') { q = c; continue; }
    if (c === '/' && src[j + 1] === '/') { while (j < src.length && src[j] !== '\n') j++; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ';' && depth === 0) return src.slice(i, j + 1);
  }
  throw new Error(`sim: unterminated statement "${start}"`);
}

// Pieces of game code the simulator copies by hand. Each must still appear verbatim in the game.
export const MIRRORED = {
  routeWildLevel: 'Math.max(2, routeLevel(r) - 2 + Math.floor(Math.random() * 4))',
  shamburgLevel: 'Math.max(5, routeLevel(S.route) + t[2] - 1)',
  questWildLevel: 'Math.max(2, lv - 2 + k)',
  trailTrainerPick: 'E.regionalWild(17, lv, keys[Math.floor(Math.random() * keys.length)])',
  legendWilds: 'E.regionalWild(17, lv, pick()), E.regionalWild(17, lv + 1, pick())',
  questTrainerTeam: 'E.randomMon(lv + 1, ar.types, true)',
};

export function loadGameData() {
  const src = fs.readFileSync(APP_PATH, 'utf8');
  const problems = [];
  for (const [k, text] of Object.entries(MIRRORED)) if (!src.includes(text)) problems.push(`${k}: "${text}"`);

  const want = ['const ORDER =', 'const JORDER =', 'const GYM_LV =', 'const E4_LV =', 'const CHAMP_LV =', 'const REG_START_LV =',
    'const ADV_START_BAG =', 'const PRICES =', 'const gymPrize =', 'const trainerPrize =', 'const AREAS =', 'AREAS.push(',
    'const TRAIL_TRAINERS =', 'const trailLv =', 'const SHAMBURG =', 'const questLevel =', 'const routeLevel ='];
  let code = '';
  for (const w of want) code += statement(src, w) + '\n';
  // the two prizes share one line
  const m = /const E4_PRIZE = (\d+), CHAMP_PRIZE = (\d+);/.exec(src);
  if (!m) throw new Error('sim: E4_PRIZE / CHAMP_PRIZE line changed');
  code += `const E4_PRIZE = ${m[1]}, CHAMP_PRIZE = ${m[2]};\n`;
  code += 'result = {ORDER, JORDER, GYM_LV, E4_LV, CHAMP_LV, REG_START_LV, ADV_START_BAG, PRICES, gymPrize, trainerPrize, E4_PRIZE, CHAMP_PRIZE, AREAS, TRAIL_TRAINERS, trailLv, SHAMBURG, questLevel, routeLevel};';
  const ctx = {result: null};
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return {...ctx.result, driftProblems: problems};
}

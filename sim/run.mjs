#!/usr/bin/env node
// Neofield playthrough simulator.   node sim/run.mjs --help
import {Worker, isMainThread, parentPort, workerData} from 'node:worker_threads';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HELP = `
Neofield playthrough simulator: plays the adventure with a bot (real battle engine, real XP code, the game's own constants).

  node sim/run.mjs [options]          (or: npm run sim -- [options])

  --runs N            how many playthroughs (default 20)
  --policy NAME       required | normal | thorough          (default normal)
  --seed N            first seed (default 1); run i uses seed+i, so a run can be repeated exactly
  --starter NAME      starter1 | starter2 | starter3 | cycle (default cycle)
  --skill LEVEL       how well the player battles: easy | normal | hard (default normal)
  --legacy            use the OLD level system (flat +1 per wild win, +2 per gym, Shamburg gifts) as a baseline to compare against
  --difficulty LEVEL  AI level of the foes: easy | normal | hard (default normal)
  --xp PATH=VALUE     override an XP number, e.g. --xp perLevel=120 --xp base.wild=20 --xp benchShare=0.25
  --time PATH=VALUE   override a time-model number (seconds), e.g. --time turn=5
  --policy-set K=V    tweak the chosen policy, e.g. --policy-set wildPerRoute=3 --policy-set questChance=1
  --sweep PATH=A,B,C  rerun for each value of one setting (xp.*, time.*, policy.* ) and compare, e.g. --sweep xp.base.wild=15,25,40
  --jobs N            parallel workers (default: number of CPU cores)
  --json FILE         also write the full results (every run) to FILE
  --detail            print every run, not just the summary
  --list              list the policies and exit
`;

const here = path.dirname(fileURLToPath(import.meta.url));


function setPath(obj, p, raw) {
  const keys = p.split('.');
  let o = obj;
  for (const k of keys.slice(0, -1)) o = (o[k] = o[k] || {});
  const n = Number(raw);
  o[keys[keys.length - 1]] = raw === 'true' ? true : raw === 'false' ? false : Number.isNaN(n) || raw === '' ? raw : n;
}

function parseArgs(argv) {
  const a = {runs: 20, policy: 'normal', seed: 1, starter: 'cycle', skill: 'normal', difficulty: 'normal', xp: {}, time: {}, pol: {}, sweep: null, jobs: os.cpus().length, json: null, detail: false};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = () => argv[++i];
    if (k === '--runs') a.runs = +v();
    else if (k === '--policy') a.policy = v();
    else if (k === '--seed') a.seed = +v();
    else if (k === '--starter') a.starter = v();
    else if (k === '--skill') a.skill = v();
    else if (k === '--difficulty') a.difficulty = v();
    else if (k === '--xp') { const [p, x] = v().split('='); setPath(a.xp, p, x); }
    else if (k === '--time') { const [p, x] = v().split('='); setPath(a.time, p, x); }
    else if (k === '--policy-set') { const [p, x] = v().split('='); setPath(a.pol, p, x); }
    else if (k === '--sweep') { const [p, x] = v().split('='); a.sweep = {path: p, values: x.split(',')}; }
    else if (k === '--legacy') a.legacy = true;
    else if (k === '--jobs') a.jobs = Math.max(1, +v());
    else if (k === '--json') a.json = v();
    else if (k === '--detail') a.detail = true;
    else if (k === '--list') a.list = true;
    else if (k === '--help' || k === '-h') a.help = true;
    else throw new Error(`unknown option ${k} (try --help)`);
  }
  return a;
}

async function runMany(args, label) {
  const seeds = Array.from({length: args.runs}, (_, i) => args.seed + i);
  const opts = {policy: args.policy, starter: args.starter, skill: args.skill, difficulty: args.difficulty, legacy: !!args.legacy, xp: args.xp, time: args.time, policyOverride: args.pol};
  const jobs = Math.min(args.jobs, seeds.length);
  const chunks = Array.from({length: jobs}, () => []);
  seeds.forEach((s, i) => chunks[i % jobs].push(s));
  const parts = await Promise.all(chunks.map(c => new Promise((res, rej) => {
    const w = new Worker(fileURLToPath(import.meta.url), {workerData: {seeds: c, opts}, argv: []});
    w.on('message', res); w.on('error', rej);
  })));
  const runs = parts.flat().sort((a, b) => a.seed - b.seed);
  const bad = runs.filter(r => r.error);
  if (bad.length) { console.error(bad[0].error); throw new Error(`${bad.length} run(s) crashed`); }
  return runs;
}

const pct = (a, p) => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); const i = (s.length - 1) * p, lo = Math.floor(i); return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (i - lo); };
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
const f1 = x => Number.isFinite(x) ? x.toFixed(1) : '-';
const fmtMin = m => { if (!Number.isFinite(m)) return '-'; const h = Math.floor(m / 60), mm = Math.round(m % 60); return h ? `${h}h ${String(mm).padStart(2, '0')}m` : `${mm}m`; };

export function summarize(runs, G) {
  const done = runs.filter(r => !r.stuck);
  const out = {runs: runs.length, finished: done.length, stuck: {}};
  for (const r of runs) if (r.stuck) out.stuck[r.stuck] = (out.stuck[r.stuck] || 0) + 1;
  out.gyms = G.GYM_LV.map((lv, k) => {
    const rs = runs.map(r => r.gyms[k]).filter(Boolean);
    const top = rs.map(g => g.team.top), top3 = rs.map(g => g.team.top3), av = rs.map(g => g.team.avg), low = rs.map(g => g.team.low);
    return {gym: k + 1, key: G.JORDER[k], lv, reached: rs.length, top: mean(top), top3: mean(top3), avg: mean(av), low: mean(low),
      over: mean(top3) - lv, first: rs.filter(g => g.attempts === 1).length / Math.max(1, rs.length), tries: mean(rs.map(g => g.attempts)),
      size: mean(rs.map(g => g.size)), min: pct(rs.filter(g => g.min != null && !g.failed).map(g => g.min), 0.5)};
  });
  const m = k => done.map(r => r.marks[k] && r.marks[k].min).filter(Number.isFinite);
  const lv = k => done.map(r => r.marks[k] && r.marks[k].level.top).filter(Number.isFinite);
  const lva = k => done.map(r => r.marks[k] && r.marks[k].level.avg).filter(Number.isFinite);
  out.allBadges = {n: m('allBadges').length, min: mean(m('allBadges')), p10: pct(m('allBadges'), .1), p50: pct(m('allBadges'), .5), p90: pct(m('allBadges'), .9), top: mean(lv('allBadges')), avg: mean(lva('allBadges'))};
  out.beforeE4 = {top: mean(lv('beforeE4')), avg: mean(lva('beforeE4'))};
  out.champion = {n: m('champion').length, min: mean(m('champion')), p10: pct(m('champion'), .1), p50: pct(m('champion'), .5), p90: pct(m('champion'), .9), top: mean(lv('champion')), avg: mean(lva('champion')),
    e4Tries: mean(done.map(r => r.marks.e4 && r.marks.e4.attempts).filter(Number.isFinite)), champTries: mean(done.map(r => r.marks.champion && r.marks.champion.attempts).filter(Number.isFinite))};
  const tags = {};
  for (const r of runs) for (const [k, v] of Object.entries(r.lvBy || {})) tags[k] = (tags[k] || 0) + v / runs.length;
  out.lvBy = tags;
  out.perRun = {battles: mean(runs.map(r => r.battles)), blackouts: mean(runs.map(r => r.blackouts)), levelUps: mean(runs.map(r => r.levelUps)), caught: mean(runs.map(r => r.caught)), quests: mean(runs.map(r => r.quests)), items: mean(runs.map(r => r.itemsUsed))};
  return out;
}

export function render(sum, args, G, title) {
  const L = [];
  L.push(`### ${title || 'Neofield playthrough simulation'}`);
  L.push(`${sum.runs} runs, policy **${args.policy}**, player skill ${args.skill}, foe AI ${args.difficulty}. ${sum.finished} of ${sum.runs} beat the Champion${Object.keys(sum.stuck).length ? ' (stuck at: ' + Object.entries(sum.stuck).map(([k, v]) => `${k} ×${v}`).join(', ') + ')' : ''}.`);
  L.push('');
  L.push('| Gym | Leader lvl | Your top | Best 3 avg | Team avg | Weakest | Best 3 vs gym | Won 1st try | Tries | Team size | Done at |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const g of sum.gyms) L.push(`| ${g.gym} (${g.key}) | ${g.lv} | ${f1(g.top)} | ${f1(g.top3)} | ${f1(g.avg)} | ${f1(g.low)} | ${g.over >= 0 ? '+' : ''}${f1(g.over)} | ${Math.round(g.first * 100)}% | ${f1(g.tries)} | ${f1(g.size)} | ${fmtMin(g.min)} |`);
  L.push('');
  L.push(`**All 17 badges:** median ${fmtMin(sum.allBadges.p50)} (fast 10%: ${fmtMin(sum.allBadges.p10)}, slow 10%: ${fmtMin(sum.allBadges.p90)}). Team then: top level ${f1(sum.allBadges.top)}, average ${f1(sum.allBadges.avg)}.`);
  L.push(`**Champion beaten:** median ${fmtMin(sum.champion.p50)} (fast 10%: ${fmtMin(sum.champion.p10)}, slow 10%: ${fmtMin(sum.champion.p90)}). Elite Four took ${f1(sum.champion.e4Tries)} tries on average, the Champion ${f1(sum.champion.champTries)}. Team at the Champion: top ${f1(sum.champion.top)}, average ${f1(sum.champion.avg)} (Champion is level ${G.CHAMP_LV}).`);
  L.push(`**Per run:** ${f1(sum.perRun.battles)} battles, ${f1(sum.perRun.blackouts)} blackouts, ${f1(sum.perRun.levelUps)} level-ups, ${f1(sum.perRun.caught)} Mons caught, ${f1(sum.perRun.quests)} side quests, ${f1(sum.perRun.items)} items used.`);
  const tot = Object.values(sum.lvBy).reduce((a, b) => a + b, 0) || 1;
  L.push(`**Where the levels come from** (share of all Mon-levels gained): ${Object.entries(sum.lvBy).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${Math.round(v / tot * 100)}%`).join(', ')}.`);
  return L.join('\n');
}

async function main() {
  let args;
  try { args = parseArgs(process.argv.slice(2)); } catch (e) { console.error(String(e.message || e)); process.exit(2); }
  const {POLICIES, G, TIME} = await import('./play.mjs');
  if (args.help) { console.log(HELP); return; }
  if (args.list) { for (const [k, v] of Object.entries(POLICIES)) console.log(`${k}: ${v.desc}`); return; }
  if (G.driftProblems.length) { console.error('WARNING: the game changed and the simulator copy is out of date for:\n  ' + G.driftProblems.join('\n  ') + '\n  Update sim/play.mjs and sim/gamedata.mjs MIRRORED.'); }
  const t0 = Date.now();
  const results = [];
  if (args.sweep) {
    const rows = [];
    for (const val of args.sweep.values) {
      const a = JSON.parse(JSON.stringify(args));
      const [root, ...rest] = args.sweep.path.split('.');
      const target = root === 'xp' ? a.xp : root === 'time' ? a.time : root === 'policy' ? a.pol : null;
      if (!target) throw new Error('--sweep path must start with xp. time. or policy.');
      setPath(target, rest.join('.'), val);
      const runs = await runMany(a);
      const sum = summarize(runs, G);
      rows.push({val, sum});
      results.push({setting: `${args.sweep.path}=${val}`, summary: sum, runs});
    }
    console.log(`### Sweep of ${args.sweep.path} (${args.runs} runs each, policy ${args.policy})\n`);
    console.log('| Value | Finished | All badges (median) | Champion (median) | Top lvl at gym 5 / 10 / 15 / 17 | Won 1st try (gyms) | Top lvl at Champion |');
    console.log('|---|---|---|---|---|---|---|');
    for (const {val, sum} of rows) {
      const gl = [5, 10, 15, 17].map(n => f1(sum.gyms[n - 1].top)).join(' / ');
      const first = mean(sum.gyms.filter(g => g.reached).map(g => g.first));
      console.log(`| ${val} | ${sum.finished}/${sum.runs} | ${fmtMin(sum.allBadges.p50)} | ${fmtMin(sum.champion.p50)} | ${gl} | ${Math.round(first * 100)}% | ${f1(sum.champion.top)} |`);
    }
  } else {
    const runs = await runMany(args);
    const sum = summarize(runs, G);
    results.push({setting: 'base', summary: sum, runs});
    console.log(render(sum, args, G));
    if (args.detail) {
      console.log('\n| Seed | Starter | Result | All badges | Champion | Battles | Blackouts | Final team |\n|---|---|---|---|---|---|---|---|');
      for (const r of runs) console.log(`| ${r.seed} | ${r.starter} | ${r.stuck ? 'stuck: ' + r.stuck : 'won'} | ${fmtMin(r.marks.allBadges && r.marks.allBadges.min)} | ${fmtMin(r.marks.champion && r.marks.champion.min)} | ${r.battles} | ${r.blackouts} | ${r.finalTeam.map(m => m.level).join(',')} |`);
    }
  }
  if (args.json) { fs.mkdirSync(path.dirname(path.resolve(args.json)), {recursive: true}); fs.writeFileSync(args.json, JSON.stringify({args, results}, null, 1)); console.error(`wrote ${args.json}`); }
  console.error(`(${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

if (!isMainThread) {
  const {playRun} = await import('./play.mjs');
  const out = [];
  for (const seed of workerData.seeds) {
    try { out.push(playRun(seed, workerData.opts)); }
    catch (e) { out.push({seed, error: String(e && e.stack || e)}); }
  }
  parentPort.postMessage(out);
} else {
  await main();
}

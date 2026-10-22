# Neofield playthrough simulator

A bot plays the whole adventure (Route 1 → 17 gyms → Elite Four → Champion) using the **real battle engine,
real Mon data and the game's own XP code**, and reads the adventure constants straight out of
`game/app_script.html` (gym levels, side quests, Team Shamburg, prices, ...). So when the game changes,
the simulator changes with it. It reports the levels your Mons are at each gym and how long a person takes.

```
npm run sim -- --runs 20                     # a typical player, 20 playthroughs (about 15 seconds)
npm run sim -- --policy thorough --runs 30   # a completionist
npm run sim -- --legacy --runs 10            # the OLD flat-level system, for comparison
npm run sim -- --sweep xp.base.wild=20,30,40 # try several values of one setting side by side
npm run sim -- --help
```

## What it reports
* A row per gym: leader level, your best Mon, your best three (average), team average, weakest Mon, how far the best three are from the leader, first-try win rate, tries, team size and when you got the badge.
* Time to all 17 badges and time to beat the Champion (median, fast 10%, slow 10%), tries at the Elite Four and Champion.
* Where the levels came from (gym, side quests, route fights, Team Shamburg, Elite Four, Laurel Pass, extra training).

## Players (policies)
`required` (only what the game forces), `normal` (default), `thorough` (every side quest, Laurel Pass first).
Every policy trains with wild fights until the best three Mons are close to the next opponent, and trains harder after each loss.
Tweak one with e.g. `--policy-set wildPerRoute=3 --policy-set questChance=1`. Player battle skill: `--skill easy|normal|hard`.

## Changing the numbers
* XP: `--xp perLevel=120 --xp base.wild=20 --xp benchShare=0.25` (defaults live in `game/progress.js`).
* How long things take a person: `--time turn=5 --time gymIntro=40` (defaults in `TIME` in `sim/play.mjs`).
* Anything else about the game (gym levels, quest levels, Shamburg) is read from `game/app_script.html`, so edit the game and re-run.

## Repeatable
Run `i` uses seed `--seed + i` and a seeded random generator, so the same command gives the same numbers.
`--json out.json` saves every run.

## Caveats (read these before trusting a number)
* The bot is a decent but not clever player: it plays the AI's best move each turn, uses items between fights, and does not plan type matchups. A thoughtful human will win more often than the bot at the same levels, so read the numbers as *relative* (compare two settings) more than absolute.
* Times come from the `TIME` model (about 4 seconds a battle turn, 28 seconds of gym dialogue, ...). Adjust it to your testers.
* If the game's code changes shape, `sim/gamedata.mjs` throws a clear error, or prints a "simulator copy is out of date" warning for the few formulas it copies by hand (`MIRRORED`).


## Known gap: the Elite Four
The real Elite Four are now family fights in doubles and triples (see E4_FIGHTS in game/app_script.html). The simulator still models them as four single battles against random gym leaders, so its Elite Four numbers are only a rough guide.

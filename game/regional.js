// Neofield Region: new Pokémon designed by Tyler. Anything named 'Starter N' or 'Wild N' is a placeholder
// (placeholder stats and moves too) until Tyler sends that Pokémon.
// Each family: stages (base → final), level-up moves, a battle-set goal for the final form,
// and Pokédex info. Everything is injected into the simulator's data so battles just work.
import {Dex} from '@pkmn/sim';

const dex = Dex.forFormat('gen9nationaldexubers');
const toID = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// stat order: hp, atk, def, spa, spd, spe
const S = (hp, atk, def, spa, spd, spe) => ({hp, atk, def, spa, spd, spe});

export const FAMILIES = [
  // ---------- starters ----------
  {key: 'starter1', starter: true, color: '#72c25a', catchRate: 45,
    stages: [
      {name: 'Bulbazoid', types: ['Grass', 'Electric'], stats: S(45, 52, 50, 50, 50, 45), abilities: ['Overgrow', 'Static'], h: .4, w: 6.1,
        entry: 'Lightning-bolt marks run down its green hide, and a glowing bulb sprouts from its back with two plug-tipped vines. Designed by Tyler.'},
      {name: 'Ivyzoid', at: 16, types: ['Grass', 'Electric'], stats: S(62, 75, 68, 62, 64, 64), abilities: ['Overgrow', 'Static'], h: 1.1, w: 34,
        entry: 'Its bulb has grown into a brass floodlight, and solar panels spread from its back to soak up the sun. Designed by Tyler.'},
      {name: 'Venuzoid', at: 36, types: ['Grass', 'Electric'], stats: S(85, 115, 90, 70, 85, 85), abilities: ['Overgrow', 'Lightning Rod'], h: 1.8, w: 112,
        entry: 'A huge dish on its back crackles with stored power, and its solar wings never stop charging. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Growl'], [4, 'Vine Whip'], [8, 'Thunder Shock'], [12, 'Razor Leaf'], [16, 'Spark'], [20, 'Bullet Seed'],
      [24, 'Synthesis'], [28, 'Seed Bomb'], [32, 'Thunder Fang'], [36, 'Horn Leech'], [40, 'Wild Charge'], [46, 'Power Whip'], [52, 'Wood Hammer'], [58, 'Swords Dance']],
    evoMoves: {'Venuzoid': ['Horn Leech']},
    final: {ability: 'Overgrow', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Horn Leech', 'Wild Charge', 'Swords Dance', 'Earthquake']}},

  {key: 'starter2', starter: true, color: '#f0857a', catchRate: 45,
    stages: [
      {name: 'Shardmander', types: ['Fire', 'Fairy'], stats: S(42, 50, 45, 60, 52, 64), abilities: ['Blaze', 'Cute Charm'], h: .6, w: 8.5,
        entry: 'Its tail holds a glowing crystal egg wrapped in gold, and it wears a matching gem. Designed by Tyler.'},
      {name: 'Shardmeleon', at: 16, types: ['Fire', 'Fairy'], stats: S(58, 66, 60, 82, 68, 82), abilities: ['Blaze', 'Cute Charm'], h: 1.1, w: 19,
        entry: 'Crystal shards grow from its tail, and thin glassy wings shimmer on its back. Designed by Tyler.'},
      {name: 'Shardizar', at: 36, types: ['Fire', 'Fairy'], stats: S(78, 84, 78, 112, 90, 100), abilities: ['Blaze', 'Magic Guard'], h: 1.7, w: 90,
        entry: 'Its crystal claws burn with pink flame, and its rainbow wings carry it above the clouds. Designed by Tyler.'},
    ],
    moves: [[1, 'Scratch'], [1, 'Growl'], [4, 'Ember'], [8, 'Fairy Wind'], [12, 'Draining Kiss'], [16, 'Flame Charge'], [20, 'Fire Fang'],
      [24, 'Dazzling Gleam'], [28, 'Will-O-Wisp'], [32, 'Calm Mind'], [36, 'Flamethrower'], [40, 'Moonblast'], [46, 'Mystical Fire'], [52, 'Fire Blast'], [58, 'Heat Wave']],
    evoMoves: {'Shardizar': ['Flamethrower']},
    final: {ability: 'Magic Guard', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Flamethrower', 'Moonblast', 'Calm Mind', 'Mystical Fire']}},

  {key: 'starter3', starter: true, color: '#3f5f9c', catchRate: 45,
    stages: [
      {name: 'Grrtle', types: ['Water', 'Dark'], stats: S(48, 54, 60, 44, 56, 42), abilities: ['Torrent', 'Shell Armor'], h: .5, w: 9,
        entry: 'A fierce little turtle with red eyes and a black spiked shell. It curls its tail when it is ready to fight. Designed by Tyler.'},
      {name: 'Roartortle', at: 16, types: ['Water', 'Dark'], stats: S(64, 72, 80, 58, 72, 58), abilities: ['Torrent', 'Shell Armor'], h: 1.0, w: 24,
        entry: 'Bone-white horns and spikes cover its black shell, and it roars to scare off anything that comes near. Designed by Tyler.'},
      {name: 'Bellowtoise', at: 36, types: ['Water', 'Dark'], stats: S(85, 105, 105, 65, 85, 75), abilities: ['Torrent', 'Intimidate'], h: 1.6, w: 90,
        entry: 'A heavy cannon juts from its spiked shell and fires blasts of water hard enough to split stone. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Tail Whip'], [4, 'Water Gun'], [8, 'Withdraw'], [12, 'Bite'], [16, 'Aqua Jet'], [20, 'Water Pulse'],
      [24, 'Protect'], [28, 'Crunch'], [32, 'Iron Defense'], [36, 'Liquidation'], [40, 'Knock Off'], [46, 'Sucker Punch'], [52, 'Hydro Pump'], [58, 'Shell Smash']],
    evoMoves: {'Bellowtoise': ['Liquidation']},
    final: {ability: 'Torrent', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Shell Smash', 'Liquidation', 'Crunch', 'Aqua Jet']}},

  // ---------- wild ----------
  {key: 'wild1', color: '#f2a7b8', catchRate: 190,
    stages: [
      {name: 'Eggyhen', types: ['Normal', 'Flying'], stats: S(45, 50, 45, 35, 40, 55), abilities: ['Early Bird', 'Big Pecks'], h: .3, w: 1.8,
        entry: 'A round puff of pink fluff that waddles after anything that moves. Designed by Tyler.'},
      {name: 'Leggyhen', at: 22, types: ['Normal', 'Flying'], stats: S(80, 100, 70, 50, 65, 95), abilities: ['Early Bird', 'Intimidate'], h: 1.2, w: 24,
        entry: 'It spreads its big pink wings and crows loud enough to wake a whole town. Designed by Tyler.'},
    ],
    moves: [[1, 'Peck'], [1, 'Growl'], [5, 'Quick Attack'], [9, 'Wing Attack'], [13, 'Feather Dance'], [17, 'Aerial Ace'], [22, 'Roost'],
      [27, 'Body Slam'], [32, 'Drill Peck'], [38, 'Brave Bird'], [44, 'Double-Edge']],
    evoMoves: {},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Brave Bird', 'Double-Edge', 'Roost', 'Swords Dance']}},

  {key: 'wild2', color: '#7fa8e6', catchRate: 150,
    stages: [
      {name: 'Sycasqeek', types: ['Psychic'], stats: S(40, 45, 40, 60, 50, 65), abilities: ['Synchronize', 'Inner Focus'], h: .4, w: 5,
        entry: 'A curious little critter with a striped tail. It senses what others are thinking. Designed by Tyler.'},
      {name: 'Sycamage', at: 26, types: ['Psychic', 'Dark'], stats: S(70, 60, 65, 110, 90, 105), abilities: ['Synchronize', 'Magic Guard'], h: 1.3, w: 30,
        entry: 'Wrapped in a tattered dark cloak, it spins rings of psychic power around its claws. Designed by Tyler.'},
    ],
    moves: [[1, 'Scratch'], [1, 'Leer'], [5, 'Confusion'], [10, 'Bite'], [15, 'Psybeam'], [20, 'Swift'], [26, 'Dark Pulse'],
      [31, 'Psychic'], [36, 'Nasty Plot'], [42, 'Psyshock'], [48, 'Shadow Ball']],
    evoMoves: {'Sycamage': ['Dark Pulse']},
    final: {ability: 'Magic Guard', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Nasty Plot', 'Psychic', 'Dark Pulse', 'Focus Blast']}},

  {key: 'wild3', color: '#f2d04a', catchRate: 120,
    stages: [
      {name: 'Zapybara', types: ['Electric'], stats: S(55, 55, 45, 50, 45, 70), abilities: ['Static', 'Run Away'], h: .5, w: 30,
        entry: 'A calm, chubby rodent with a lightning-bolt mark. Static crackles between its ears when it is happy. Designed by Tyler.'},
      {name: 'Wild 3 Stage 2', at: 28, types: ['Electric', 'Normal'], stats: S(65, 90, 60, 75, 60, 120), abilities: ['Static', 'Speed Boost'], h: .9, w: 12,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
    ],
    moves: [[1, 'Quick Attack'], [1, 'Tail Whip'], [5, 'Thunder Shock'], [9, 'Double Kick'], [14, 'Spark'], [19, 'Nuzzle'], [24, 'Body Slam'],
      [28, 'Volt Switch'], [33, 'Thunder Fang'], [38, 'Extreme Speed'], [44, 'Wild Charge'], [50, 'Double-Edge']],
    evoMoves: {},
    final: {ability: 'Static', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Extreme Speed', 'Wild Charge', 'Double-Edge', 'Volt Switch']}},

  {key: 'wild4', color: '#b06ee0', catchRate: 150,
    stages: [
      {name: 'Wild 4', types: ['Poison', 'Water'], stats: S(60, 45, 50, 50, 55, 30), abilities: ['Poison Point', 'Water Absorb'], h: .4, w: 9,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
      {name: 'Wild 4 Stage 2', at: 30, types: ['Poison', 'Water'], stats: S(95, 70, 85, 85, 95, 45), abilities: ['Poison Point', 'Regenerator'], h: 1.4, w: 88,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
    ],
    moves: [[1, 'Poison Sting'], [1, 'Water Gun'], [6, 'Acid'], [11, 'Bubble Beam'], [16, 'Toxic'], [21, 'Sludge'], [26, 'Brine'],
      [30, 'Recover'], [35, 'Sludge Bomb'], [40, 'Scald'], [46, 'Toxic Spikes'], [52, 'Hydro Pump']],
    evoMoves: {},
    final: {ability: 'Regenerator', item: 'Black Sludge', nature: 'Calm', evs: {hp: 252, spd: 252, def: 4}, moves: ['Scald', 'Sludge Bomb', 'Recover', 'Toxic Spikes']}},

  {key: 'wild5', color: '#86d8ec', catchRate: 120,
    stages: [
      {name: 'Wild 5', types: ['Ice', 'Flying'], stats: S(45, 45, 45, 55, 50, 60), abilities: ['Snow Cloak', 'Keen Eye'], h: .3, w: 3,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
      {name: 'Wild 5 Stage 2', at: 34, types: ['Ice', 'Flying'], stats: S(75, 70, 70, 105, 85, 100), abilities: ['Snow Cloak', 'Snow Warning'], h: 1.3, w: 32,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
    ],
    moves: [[1, 'Peck'], [1, 'Powder Snow'], [6, 'Gust'], [11, 'Ice Shard'], [16, 'Air Cutter'], [21, 'Icy Wind'], [26, 'Roost'],
      [31, 'Air Slash'], [34, 'Ice Beam'], [40, 'Hurricane'], [46, 'Blizzard'], [52, 'Aurora Veil']],
    evoMoves: {},
    final: {ability: 'Snow Warning', item: 'Light Clay', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Blizzard', 'Hurricane', 'Aurora Veil', 'Roost']}},

  {key: 'wild6', color: '#7f6bb0', catchRate: 120,
    stages: [
      {name: 'Wild 6', types: ['Ghost'], stats: S(40, 55, 40, 40, 40, 60), abilities: ['Cursed Body', 'Frisk'], h: .4, w: 4,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
      {name: 'Wild 6 Stage 2', at: 25, types: ['Ghost', 'Dark'], stats: S(60, 80, 60, 60, 60, 85), abilities: ['Cursed Body', 'Intimidate'], h: 1.0, w: 26,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
      {name: 'Wild 6 Stage 3', at: 42, types: ['Ghost', 'Dark'], stats: S(80, 120, 80, 75, 80, 105), abilities: ['Cursed Body', 'Intimidate'], h: 1.7, w: 75,
        entry: 'Placeholder. This Pokémon is waiting for its design from Tyler.'},
    ],
    moves: [[1, 'Lick'], [1, 'Leer'], [5, 'Astonish'], [9, 'Bite'], [14, 'Shadow Sneak'], [19, 'Hex'], [25, 'Crunch'],
      [30, 'Shadow Claw'], [35, 'Play Rough'], [42, 'Shadow Bone'], [48, 'Psychic Fangs'], [54, 'Poltergeist']],
    evoMoves: {},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Poltergeist', 'Crunch', 'Shadow Sneak', 'Play Rough']}},
];

// Routes: index i joins map point i and i+1 (0 = Pallet-style home town, 18 = Victory Summit).
// With 6 wild families every route has two of them; once the roster grows each route can get its own.
export const ROUTES = [
  ['Route 1', ['wild1', 'wild2']],
  ['Route 2', ['wild1', 'wild3']],
  ['Route 3', ['wild2', 'wild6']],
  ['Route 4', ['wild3', 'wild4']],
  ['Route 5', ['wild4', 'wild5']],
  ['Route 6', ['wild6', 'wild1']],
  ['Route 7', ['wild5', 'wild2']],
  ['Route 8', ['wild3', 'wild6']],
  ['Route 9', ['wild4', 'wild1']],
  ['Route 10', ['wild2', 'wild5']],
  ['Route 11', ['wild6', 'wild4']],
  ['Route 12', ['wild1', 'wild5']],
  ['Route 13', ['wild3', 'wild2']],
  ['Route 14', ['wild4', 'wild6']],
  ['Route 15', ['wild5', 'wild3']],
  ['Route 16', ['wild1', 'wild4']],
  ['Route 17', ['wild2', 'wild6']],
  ['Victory Road', ['wild3', 'wild5', 'wild1']],
].map(([name, fams], i) => ({name, families: fams, idx: i}));

// ---------- inject into the simulator ----------
let num = 1;
export const SPECIES = []; // flat list in dex order
for (const fam of FAMILIES) {
  fam.stages.forEach((st, i) => {
    const id = toID(st.name);
    st.id = id; st.num = num++; st.family = fam.key; st.stage = i;
    const abil = {0: st.abilities[0]}; if (st.abilities[1]) abil.H = st.abilities[1];
    dex.data.Pokedex[id] = {
      num: -3000 - st.num, name: st.name, types: st.types, baseStats: st.stats, abilities: abil,
      heightm: st.h, weightkg: st.w, color: 'Gray', eggGroups: ['Undiscovered'],
      ...(i > 0 ? {prevo: fam.stages[i - 1].name, evoLevel: st.at} : {}),
      ...(i < fam.stages.length - 1 ? {evos: [fam.stages[i + 1].name]} : {}),
    };
    // each stage only knows moves from before its next evolution; the battle-set extras are final-form only
    const isLast = i === fam.stages.length - 1;
    const cap = isLast ? Infinity : fam.stages[i + 1].at;
    const ls = {};
    for (const [lv, mv] of fam.moves) { if (lv >= cap) continue; const m = toID(mv); (ls[m] = ls[m] || []).push(`9L${lv}`); }
    for (const mv of (fam.evoMoves[st.name] || [])) { const m = toID(mv); ls[m] = (ls[m] || []).filter(s => !s.startsWith('9L')); ls[m].unshift('9L0'); }
    if (isLast) for (const mv of fam.final.moves) { const m = toID(mv); if (!ls[m]) ls[m] = ['9M']; }
    dex.data.Learnsets[id] = {learnset: ls};
    SPECIES.push(st);
  });
  const last = fam.stages[fam.stages.length - 1];
  fam.finalSet = {name: last.name, species: last.name, ...JSON.parse(JSON.stringify(fam.final)), ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}};
}
export const REGIONAL_IDS = new Set(SPECIES.map(s => s.id));
export const isRegional = name => REGIONAL_IDS.has(toID(name));
export function regionalInfo(name) {
  const id = toID(name);
  const st = SPECIES.find(s => s.id === id);
  if (!st) return null;
  const fam = FAMILIES.find(f => f.key === st.family);
  const routes = ROUTES.filter(r => r.families.includes(fam.key)).map(r => r.name);
  return {...st, familyKey: fam.key, color: fam.color, catchRate: fam.catchRate, starter: !!fam.starter, routes, line: fam.stages.map(s => ({name: s.name, at: s.at || 1}))};
}
export const familyOf = key => FAMILIES.find(f => f.key === key);
export const STARTERS = FAMILIES.filter(f => f.starter);

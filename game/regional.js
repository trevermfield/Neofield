// Neofield Region: new Mons designed by Tyler. Types, stats and moves are picked to
// fit each design; change them here.
// Each family: stages (base → final), level-up moves, a battle-set goal for the final form,
// and MonDex info. Everything is injected into the simulator's data so battles just work.
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
      {name: 'Zapybara', types: ['Electric'], stats: S(80, 85, 70, 80, 70, 95), abilities: ['Static', 'Volt Absorb'], h: .6, w: 35,
        entry: 'A calm, chubby rodent with a lightning-bolt mark. Static crackles between its ears when it is happy. Designed by Tyler.'},
    ],
    moves: [[1, 'Quick Attack'], [1, 'Tail Whip'], [5, 'Thunder Shock'], [9, 'Double Kick'], [14, 'Spark'], [19, 'Nuzzle'], [24, 'Body Slam'],
      [28, 'Volt Switch'], [33, 'Thunder Fang'], [38, 'Extreme Speed'], [44, 'Wild Charge'], [50, 'Double-Edge']],
    evoMoves: {},
    final: {ability: 'Volt Absorb', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Extreme Speed', 'Wild Charge', 'Double-Edge', 'Volt Switch']}},

  {key: 'wild4', color: '#4f86d6', catchRate: 190,
    stages: [
      {name: 'Bloogilp', types: ['Water'], stats: S(45, 50, 45, 40, 40, 60), abilities: ['Swift Swim', 'Water Veil'], h: .3, w: 1.5,
        entry: 'A round little fish with blue stripes. Schools of them flash through every pond in Neofield. Designed by Tyler.'},
      {name: 'Poseigunk', at: 28, types: ['Water', 'Poison'], stats: S(95, 95, 85, 70, 80, 55), abilities: ['Swift Swim', 'Poison Touch'], h: 1.6, w: 120,
        entry: 'It lurks in murky water under a coat of slime and grabs prey with its long, wriggling whiskers. Designed by Tyler.'},
    ],
    moves: [[1, 'Water Gun'], [1, 'Tail Whip'], [5, 'Supersonic'], [9, 'Aqua Jet'], [14, 'Bite'], [19, 'Water Pulse'], [24, 'Aqua Tail'],
      [28, 'Poison Jab'], [33, 'Liquidation'], [38, 'Gunk Shot'], [44, 'Crunch'], [50, 'Wave Crash']],
    evoMoves: {'Poseigunk': ['Poison Jab']},
    final: {ability: 'Swift Swim', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Liquidation', 'Gunk Shot', 'Aqua Jet', 'Crunch']}},

  {key: 'yucrane', color: '#e8b830', catchRate: 75,
    stages: [
      {name: 'Yucrane', types: ['Water', 'Flying'], stats: S(80, 90, 70, 95, 80, 100), abilities: ['Keen Eye', 'Sniper'], h: 1.7, w: 22,
        entry: 'A graceful crane with blue and gold wings. It stands perfectly still in the shallows, then strikes in a flash. Designed by Tyler.'},
    ],
    moves: [[1, 'Peck'], [1, 'Water Gun'], [5, 'Gust'], [9, 'Wing Attack'], [14, 'Water Pulse'], [19, 'Air Cutter'], [24, 'Roost'],
      [29, 'Air Slash'], [34, 'Scald'], [40, 'Hurricane'], [46, 'Hydro Pump']],
    evoMoves: {},
    final: {ability: 'Sniper', item: 'Scope Lens', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Hurricane', 'Hydro Pump', 'Roost', 'U-turn']}},

  {key: 'bizon', color: '#6b4f3f', catchRate: 120,
    stages: [
      {name: 'Bizon', types: ['Normal'], stats: S(70, 70, 60, 30, 45, 45), abilities: ['Reckless', 'Thick Fat'], h: 1.0, w: 85,
        entry: 'A shaggy young bison with a crescent moon on its side. It charges at anything that wakes it up at night. Designed by Tyler.'},
      {name: 'Werebizon', at: 30, types: ['Normal', 'Fighting'], stats: S(105, 130, 90, 40, 70, 75), abilities: ['Reckless', 'Iron Fist'], h: 2.1, w: 260,
        entry: 'Under a full moon it rises up on two legs. The glowing moon on its chest gives it the strength to toss boulders. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Leer'], [5, 'Horn Attack'], [10, 'Headbutt'], [15, 'Rock Smash'], [20, 'Stomp'], [25, 'Take Down'],
      [30, 'Brick Break'], [35, 'Zen Headbutt'], [40, 'Bulk Up'], [45, 'Close Combat'], [52, 'Double-Edge']],
    evoMoves: {'Werebizon': ['Brick Break']},
    final: {ability: 'Reckless', item: 'Choice Band', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Double-Edge', 'Close Combat', 'Earthquake', 'Zen Headbutt']}},

  {key: 'wild6', color: '#8f7cc2', catchRate: 120,
    stages: [
      {name: 'Riptome', types: ['Rock', 'Ghost'], stats: S(40, 45, 70, 40, 50, 25), abilities: ['Cursed Body', 'Sturdy'], h: .6, w: 60,
        entry: 'An old gravestone with one glowing eye. Purple mist drifts from it on quiet nights. Designed by Tyler.'},
      {name: 'Ripblok', at: 20, types: ['Rock', 'Ghost'], stats: S(60, 70, 100, 55, 70, 40), abilities: ['Cursed Body', 'Sturdy'], h: 1.1, w: 180,
        entry: 'A heavy stone block that scuttles around on striped legs, watching every direction at once. Designed by Tyler.'},
      {name: 'Ripgool', at: 40, types: ['Rock', 'Ghost'], stats: S(85, 115, 130, 70, 90, 45), abilities: ['Cursed Body', 'Solid Rock'], h: 2.6, w: 420,
        entry: 'A towering stone head with floating hands. It drools glowing slime and never seems to blink. Designed by Tyler.'},
    ],
    moves: [[1, 'Astonish'], [1, 'Defense Curl'], [5, 'Rock Throw'], [9, 'Night Shade'], [14, 'Rock Tomb'], [20, 'Shadow Sneak'], [25, 'Hex'],
      [30, 'Rock Slide'], [35, 'Shadow Claw'], [40, 'Stone Edge'], [46, 'Poltergeist'], [52, 'Head Smash']],
    evoMoves: {'Ripgool': ['Stone Edge']},
    final: {ability: 'Solid Rock', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Stone Edge', 'Poltergeist', 'Shadow Sneak', 'Stealth Rock']}},

  {key: 'campyre', color: '#f07a3a', catchRate: 150,
    stages: [
      {name: 'Campyre', types: ['Fire'], stats: S(45, 50, 45, 60, 50, 60), abilities: ['Flash Fire', 'Flame Body'], h: .5, w: 6,
        entry: 'A cheerful little campfire that roasts marshmallows on its stick arms. It loves a good story. Designed by Tyler.'},
      {name: 'Bonpyre', at: 30, types: ['Fire', 'Grass'], stats: S(85, 90, 80, 110, 85, 65), abilities: ['Flash Fire', 'Flame Body'], h: 1.8, w: 140,
        entry: 'A roaring heap of branches and autumn leaves. Anything that gets too close is swept into its blaze. Designed by Tyler.'},
    ],
    moves: [[1, 'Ember'], [1, 'Growl'], [5, 'Smokescreen'], [9, 'Flame Charge'], [14, 'Incinerate'], [19, 'Leafage'], [24, 'Flame Wheel'],
      [30, 'Giga Drain'], [35, 'Flamethrower'], [40, 'Will-O-Wisp'], [45, 'Energy Ball'], [52, 'Fire Blast']],
    evoMoves: {'Bonpyre': ['Giga Drain']},
    final: {ability: 'Flash Fire', item: 'Life Orb', nature: 'Modest', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Fire Blast', 'Giga Drain', 'Will-O-Wisp', 'Synthesis']}},

  {key: 'maraudur', color: '#e3b23c', catchRate: 120,
    stages: [
      {name: 'Maraudur', types: ['Fighting'], stats: S(60, 70, 55, 30, 45, 50), abilities: ['Guts', 'Scrappy'], h: .9, w: 40,
        entry: 'Nobody has ever seen its face under all that golden hair. It wears a horned helmet and loves a scrap. Designed by Tyler.'},
      {name: 'Maraudoom', at: 32, types: ['Fighting', 'Steel'], stats: S(95, 125, 95, 45, 75, 70), abilities: ['Guts', 'Mold Breaker'], h: 1.9, w: 150,
        entry: 'It swings a carved battle axe as heavy as a boulder and lets out a war cry before every fight. Designed by Tyler.'},
    ],
    moves: [[1, 'Pound'], [1, 'Leer'], [5, 'Arm Thrust'], [10, 'Bite'], [15, 'Low Kick'], [20, 'Headbutt'], [26, 'Brick Break'],
      [32, 'Iron Head'], [37, 'Bulk Up'], [42, 'Close Combat'], [48, 'Swords Dance'], [54, 'Head Smash']],
    evoMoves: {'Maraudoom': ['Iron Head']},
    final: {ability: 'Guts', item: 'Flame Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Close Combat', 'Iron Head', 'Facade', 'Swords Dance']}},

  {key: 'wild5', color: '#86d8ec', catchRate: 150,
    stages: [
      {name: 'Icerpent', types: ['Ice'], stats: S(45, 55, 45, 50, 45, 55), abilities: ['Shed Skin', 'Ice Body'], h: 1.5, w: 7,
        entry: 'A frosty snake covered in snowflake scales. Its rattle chimes like icicles in the wind. Designed by Tyler.'},
      {name: 'Coldbra', at: 28, types: ['Ice', 'Poison'], stats: S(80, 95, 75, 85, 80, 95), abilities: ['Intimidate', 'Ice Body'], h: 3.2, w: 60,
        entry: 'When it spreads its hood a great snowflake appears, and the air around it freezes solid. Designed by Tyler.'},
    ],
    moves: [[1, 'Wrap'], [1, 'Leer'], [5, 'Powder Snow'], [9, 'Poison Sting'], [14, 'Ice Shard'], [19, 'Glare'], [24, 'Ice Fang'],
      [28, 'Poison Fang'], [33, 'Icicle Crash'], [38, 'Coil'], [44, 'Gunk Shot'], [50, 'Blizzard']],
    evoMoves: {'Coldbra': ['Poison Fang']},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Icicle Crash', 'Gunk Shot', 'Ice Shard', 'Coil']}},

  {key: 'marooner', color: '#9b2a3a', catchRate: 75,
    stages: [
      {name: 'Marooner', types: ['Electric', 'Flying'], stats: S(70, 75, 65, 105, 75, 120), abilities: ['Motor Drive', 'Speed Boost'], h: .9, w: 14,
        entry: 'A tiny messenger with winged boots and a winged helmet. It throws lightning bolts and is gone before they land. Designed by Tyler.'},
    ],
    moves: [[1, 'Thunder Shock'], [1, 'Quick Attack'], [5, 'Gust'], [10, 'Spark'], [15, 'Air Cutter'], [20, 'Shock Wave'], [26, 'Air Slash'],
      [32, 'Thunderbolt'], [38, 'Volt Switch'], [44, 'Hurricane'], [50, 'Thunder']],
    evoMoves: {},
    final: {ability: 'Speed Boost', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Thunderbolt', 'Hurricane', 'Volt Switch', 'Roost']}},

  {key: 'weldonrust', color: '#a8573a', catchRate: 75,
    stages: [
      {name: 'Weldonrust', types: ['Steel', 'Fighting'], stats: S(95, 120, 120, 50, 75, 40), abilities: ['Iron Fist', 'Heavy Metal'], h: 2.2, w: 380,
        entry: 'An old welding robot that woke up in a junkyard. The rust on its arms never slows its punches. Designed by Tyler.'},
    ],
    moves: [[1, 'Metal Claw'], [1, 'Harden'], [6, 'Mach Punch'], [12, 'Iron Defense'], [18, 'Rock Smash'], [24, 'Bullet Punch'], [30, 'Hammer Arm'],
      [36, 'Iron Head'], [42, 'Drain Punch'], [48, 'Heavy Slam'], [54, 'Meteor Mash']],
    evoMoves: {},
    final: {ability: 'Iron Fist', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Meteor Mash', 'Drain Punch', 'Bullet Punch', 'Ice Punch']}},

  {key: 'noterish', color: '#3fae4a', catchRate: 120,
    stages: [
      {name: 'Noterish', types: ['Grass'], stats: S(50, 55, 50, 50, 50, 55), abilities: ['Serene Grace', 'Chlorophyll'], h: .6, w: 4,
        entry: 'A four-leaf clover in curly buckled shoes. Finding one is said to bring a whole year of good luck. Designed by Tyler.'},
      {name: 'Damerish', at: 30, types: ['Grass', 'Fighting'], stats: S(80, 115, 85, 60, 80, 100), abilities: ['Serene Grace', 'Iron Fist'], h: 1.5, w: 55,
        entry: 'It wears a gold helmet and boxing gloves, and it fights hardest when everyone says it will lose. Designed by Tyler.'},
    ],
    moves: [[1, 'Leafage'], [1, 'Growl'], [5, 'Absorb'], [9, 'Sweet Scent'], [14, 'Magical Leaf'], [19, 'Mach Punch'], [24, 'Seed Bomb'],
      [30, 'Drain Punch'], [35, 'Leaf Blade'], [40, 'Bulk Up'], [46, 'Close Combat'], [52, 'Power Whip']],
    evoMoves: {'Damerish': ['Drain Punch']},
    final: {ability: 'Iron Fist', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Drain Punch', 'Leaf Blade', 'Mach Punch', 'Bulk Up']}},

  {key: 'pinedale', color: '#4f9a3c', catchRate: 45,
    stages: [
      {name: 'Pinedale', types: ['Grass'], stats: S(45, 55, 45, 40, 45, 60), abilities: ['Run Away', 'Sap Sipper'], h: .9, w: 30,
        entry: 'A spry foal with a pine-needle mane. It wears a pinecone charm and gallops through the forest all day. Designed by Tyler.'},
      {name: 'Broncho', at: 18, types: ['Grass'], stats: S(65, 80, 60, 50, 60, 85), abilities: ['Run Away', 'Sap Sipper'], h: 1.6, w: 220,
        entry: 'A wild, bucking horse with flowers in its mane. Nobody has ever kept it in a stable for long. Designed by Tyler.'},
      {name: 'Coltmare', at: 38, types: ['Grass', 'Steel'], stats: S(90, 120, 105, 60, 85, 90), abilities: ['Sap Sipper', 'Steadfast'], h: 2.2, w: 620,
        entry: 'A mighty warhorse clad in silver armor and white roses. Its steel horseshoes ring like bells. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Growl'], [4, 'Leafage'], [8, 'Double Kick'], [12, 'Razor Leaf'], [18, 'Stomp'], [23, 'Bullet Seed'],
      [28, 'Seed Bomb'], [33, 'High Horsepower'], [38, 'Iron Head'], [43, 'Leaf Blade'], [49, 'Swords Dance'], [55, 'Head Smash']],
    evoMoves: {'Coltmare': ['Iron Head']},
    final: {ability: 'Sap Sipper', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Leaf Blade', 'Iron Head', 'High Horsepower', 'Swords Dance']}},

  {key: 'mugnbud', color: '#4fb04a', catchRate: 120,
    stages: [
      {name: 'Mugnbud', types: ['Bug', 'Ground'], stats: S(75, 95, 100, 45, 70, 55), abilities: ['Shell Armor', 'Sand Rush'], h: .5, w: 20,
        entry: 'A shiny horned beetle that rolls its best friend, a smiling ball of mud, everywhere it goes. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Mud-Slap'], [6, 'Bug Bite'], [12, 'Rollout'], [18, 'Mud Shot'], [24, 'X-Scissor'], [30, 'Dig'],
      [36, 'Megahorn'], [42, 'Earthquake'], [48, 'Stealth Rock']],
    evoMoves: {},
    final: {ability: 'Sand Rush', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Megahorn', 'Earthquake', 'Stealth Rock', 'Rock Slide']}},

  {key: 'nidomonk', color: '#d85a8a', catchRate: 60,
    stages: [
      {name: 'Nidomonk', types: ['Rock', 'Psychic'], stats: S(95, 90, 100, 100, 90, 55), abilities: ['Sturdy', 'Inner Focus'], h: 1.4, w: 160,
        entry: 'It sits so still in meditation that rocks float around it. The crystal on its brow glows with calm power. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Confusion'], [6, 'Rock Throw'], [12, 'Calm Mind'], [18, 'Psybeam'], [24, 'Ancient Power'], [30, 'Psychic'],
      [36, 'Power Gem'], [42, 'Stealth Rock'], [48, 'Future Sight']],
    evoMoves: {},
    final: {ability: 'Sturdy', item: 'Leftovers', nature: 'Modest', evs: {hp: 252, spa: 252, spd: 4}, moves: ['Psychic', 'Power Gem', 'Calm Mind', 'Stealth Rock']}},

  {key: 'chetswatch', color: '#6aa6e6', catchRate: 75,
    stages: [
      {name: 'Chetswatch', types: ['Normal', 'Fighting'], stats: S(100, 115, 75, 50, 70, 90), abilities: ['Scrappy', 'Hustle'], h: 2.4, w: 210,
        entry: 'A long-armed blue giant who never misses a game. It can reach the hoop without even jumping. Designed by Tyler.'},
    ],
    moves: [[1, 'Pound'], [1, 'Leer'], [6, 'Low Kick'], [12, 'Fake Out'], [18, 'Slam'], [24, 'Brick Break'], [30, 'Body Slam'],
      [36, 'Bulk Up'], [42, 'Close Combat'], [48, 'Double-Edge']],
    evoMoves: {},
    final: {ability: 'Scrappy', item: 'Choice Band', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Double-Edge', 'Close Combat', 'Knock Off', 'Earthquake']}},

  {key: 'banchief', color: '#3fd8a0', catchRate: 60,
    stages: [
      {name: 'Banchief', types: ['Ghost', 'Fighting'], stats: S(80, 115, 70, 95, 75, 95), abilities: ['Cursed Body', 'Intimidate'], h: 2.0, w: 30,
        entry: 'A ghostly chief in a feathered headdress of skulls. Its green spirit-fire flares when it raises its spear. Designed by Tyler.'},
    ],
    moves: [[1, 'Astonish'], [1, 'Leer'], [6, 'Night Shade'], [12, 'Low Kick'], [18, 'Hex'], [24, 'Shadow Claw'], [30, 'Brick Break'],
      [36, 'Shadow Ball'], [42, 'Close Combat'], [48, 'Poltergeist']],
    evoMoves: {},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Poltergeist', 'Close Combat', 'Shadow Sneak', 'Swords Dance']}},

  {key: 'cryodon', color: '#7fb8e0', catchRate: 90,
    stages: [
      {name: 'Cryodon', types: ['Ice', 'Ground'], stats: S(70, 80, 100, 40, 60, 40), abilities: ['Ice Body', 'Battle Armor'], h: 1.2, w: 190,
        entry: 'Its back is covered in thick ice plates, and it swings a spiked ice club on its tail. Designed by Tyler.'},
      {name: 'Rimeocerus', at: 34, types: ['Ice', 'Ground'], stats: S(105, 125, 120, 50, 75, 55), abilities: ['Ice Body', 'Thick Fat'], h: 2.6, w: 750,
        entry: 'A woolly giant armored in ice crystals. Its horn can crack a frozen lake in one charge. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Defense Curl'], [5, 'Powder Snow'], [10, 'Mud-Slap'], [15, 'Ice Shard'], [20, 'Bulldoze'], [26, 'Ice Fang'],
      [34, 'Icicle Crash'], [39, 'Iron Defense'], [44, 'Earthquake'], [50, 'Megahorn'], [56, 'Head Smash']],
    evoMoves: {'Rimeocerus': ['Icicle Crash']},
    final: {ability: 'Thick Fat', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Icicle Crash', 'Earthquake', 'Ice Shard', 'Stealth Rock']}},

  {key: 'wyrmie', color: '#5f8a3a', catchRate: 45,
    stages: [
      {name: 'Wyrmie', types: ['Bug'], stats: S(45, 55, 45, 35, 40, 40), abilities: ['Shed Skin', 'Shield Dust'], h: .5, w: 6,
        entry: 'A spiky green caterpillar with a red stripe. It eats leaves all day to grow into something far more fearsome. Designed by Tyler.'},
      {name: 'Wyrmpod', at: 22, types: ['Bug', 'Dragon'], stats: S(65, 80, 110, 50, 70, 30), abilities: ['Shed Skin', 'Shell Armor'], h: 1.0, w: 90,
        entry: 'It curls into a spiked ball and waits. Its glowing eyes peek out from inside the shell. Designed by Tyler.'},
      {name: 'Wyrmega', at: 45, types: ['Dragon', 'Bug'], stats: S(91, 134, 95, 80, 90, 110), abilities: ['Moxie', 'Tough Claws'], h: 3.0, w: 250,
        entry: 'A huge winged dragon born from Wyrmpod. Its roar shakes the trees, and its torn wings carry it across the region. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'String Shot'], [5, 'Bug Bite'], [10, 'Twister'], [15, 'Harden'], [22, 'Dragon Breath'], [28, 'X-Scissor'],
      [34, 'Iron Defense'], [40, 'Dragon Claw'], [45, 'Dragon Dance'], [50, 'Outrage'], [56, 'Megahorn']],
    evoMoves: {'Wyrmega': ['Dragon Dance']},
    final: {ability: 'Moxie', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Dragon Dance', 'Outrage', 'Megahorn', 'Earthquake']}},

  // ---------- rare (legendary) Mons: only show up now and then on late routes ----------
  {key: 'nivalux', color: '#bfe0f5', catchRate: 30, rare: true,
    stages: [
      {name: 'Nivalux', types: ['Ice'], stats: S(95, 80, 90, 120, 105, 100), abilities: ['Snow Warning', 'Pressure'], h: 2.0, w: 180,
        entry: 'A snow-white wolf said to bring the first blizzard of winter. Silver bands circle its legs. Designed by Tyler.'},
    ],
    moves: [[1, 'Powder Snow'], [1, 'Leer'], [10, 'Ice Shard'], [20, 'Icy Wind'], [30, 'Aurora Beam'], [40, 'Ice Beam'], [50, 'Aurora Veil'], [60, 'Blizzard']],
    evoMoves: {},
    final: {ability: 'Snow Warning', item: 'Light Clay', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Blizzard', 'Freeze-Dry', 'Aurora Veil', 'Shadow Ball']}},

  {key: 'storment', color: '#e8c040', catchRate: 30, rare: true,
    stages: [
      {name: 'Storment', types: ['Electric', 'Dark'], stats: S(90, 120, 85, 95, 85, 115), abilities: ['Pressure', 'Strong Jaw'], h: 2.0, w: 175,
        entry: 'A black wolf streaked with lightning. Thunder rolls across the sky wherever it runs. Designed by Tyler.'},
    ],
    moves: [[1, 'Thunder Fang'], [1, 'Bite'], [10, 'Spark'], [20, 'Crunch'], [30, 'Wild Charge'], [40, 'Volt Switch'], [50, 'Psychic Fangs'], [60, 'Thunder']],
    evoMoves: {},
    final: {ability: 'Strong Jaw', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Thunder Fang', 'Crunch', 'Psychic Fangs', 'Wild Charge']}},

  {key: 'rensylk', color: '#f08a4b', catchRate: 30, rare: true,
    stages: [
      {name: 'Rensylk', types: ['Fire', 'Fairy'], stats: S(90, 85, 85, 120, 110, 100), abilities: ['Pressure', 'Flash Fire'], h: 1.8, w: 120,
        entry: 'A fox whose fur glows in the colors of a sunset. Its ears flicker with soft flames. Designed by Tyler.'},
    ],
    moves: [[1, 'Ember'], [1, 'Fairy Wind'], [10, 'Flame Charge'], [20, 'Dazzling Gleam'], [30, 'Flamethrower'], [40, 'Calm Mind'], [50, 'Moonblast'], [60, 'Fire Blast']],
    evoMoves: {},
    final: {ability: 'Flash Fire', item: 'Leftovers', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Flamethrower', 'Moonblast', 'Calm Mind', 'Morning Sun']}},

  {key: 'okloyama', color: '#e88a9a', catchRate: 20, rare: true,
    stages: [
      {name: 'Okloyama', types: ['Rock', 'Fairy'], stats: S(110, 130, 120, 80, 100, 70), abilities: ['Pressure', 'Solid Rock'], h: 3.1, w: 900,
        entry: 'A giant of rose crystal that walks inside its own storm clouds. Roses bloom wherever it steps. Designed by Tyler.'},
    ],
    moves: [[1, 'Rock Throw'], [1, 'Fairy Wind'], [10, 'Rock Tomb'], [20, 'Draining Kiss'], [30, 'Rock Slide'], [40, 'Play Rough'], [50, 'Stone Edge'], [60, 'Diamond Storm']],
    evoMoves: {},
    final: {ability: 'Solid Rock', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Diamond Storm', 'Play Rough', 'Earthquake', 'Stealth Rock']}},

  {key: 'hexabeake', color: '#3a2a2a', catchRate: 20, rare: true,
    stages: [
      {name: 'Hexabeake', types: ['Fire', 'Dark'], stats: S(100, 115, 90, 125, 90, 100), abilities: ['Pressure', 'Flame Body'], h: 3.5, w: 200,
        entry: 'A dark phoenix whose wings drip with burning tar. Legends say it curses anyone who looks at it too long. Designed by Tyler.'},
    ],
    moves: [[1, 'Ember'], [1, 'Snarl'], [10, 'Wing Attack'], [20, 'Dark Pulse'], [30, 'Flamethrower'], [40, 'Nasty Plot'], [50, 'Fiery Wrath'], [60, 'Overheat']],
    evoMoves: {},
    final: {ability: 'Flame Body', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Fiery Wrath', 'Flamethrower', 'Nasty Plot', 'Roost']}},

  {key: 'aerialyn', color: '#f4a58a', catchRate: 20, rare: true,
    stages: [
      {name: 'Aerialyn', types: ['Flying', 'Fairy'], stats: S(100, 100, 100, 100, 100, 100), abilities: ['Serene Grace', 'Pixilate'], h: .4, w: 2,
        entry: 'A tiny, playful bird that is almost never seen. It is said to know a little of every move there is. Designed by Tyler.'},
    ],
    moves: [[1, 'Pound'], [1, 'Gust'], [10, 'Fairy Wind'], [20, 'Air Slash'], [30, 'Moonblast'], [40, 'Roost'], [50, 'Hurricane'], [60, 'Calm Mind']],
    evoMoves: {},
    final: {ability: 'Serene Grace', item: 'Leftovers', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Air Slash', 'Moonblast', 'Calm Mind', 'Roost']}},
];

// Routes: index i joins map point i and i+1 (0 = home town, 18 = Victory Summit).
// Rare (legendary) families only turn up now and then; see regionalWild in adventure.js.
export const ROUTES = [
  ['Route 1', ['wild1', 'wild2', 'wild4']],
  ['Route 2', ['wild3', 'campyre', 'wild1']],
  ['Route 3', ['bizon', 'noterish', 'wild4']],
  ['Route 4', ['pinedale', 'wild6', 'wild2']],
  ['Route 5', ['mugnbud', 'maraudur', 'yucrane']],
  ['Route 6', ['wild5', 'wyrmie', 'campyre']],
  ['Route 7', ['marooner', 'bizon', 'noterish']],
  ['Route 8', ['pinedale', 'weldonrust', 'wild6']],
  ['Route 9', ['chetswatch', 'maraudur', 'wild5']],
  ['Route 10', ['wyrmie', 'banchief', 'yucrane']],
  ['Route 11', ['cryodon', 'nidomonk', 'mugnbud']],
  ['Route 12', ['weldonrust', 'marooner', 'wild4']],
  ['Route 13', ['banchief', 'cryodon', 'wild3', 'nivalux']],
  ['Route 14', ['nidomonk', 'chetswatch', 'wyrmie', 'storment']],
  ['Route 15', ['wild6', 'pinedale', 'cryodon', 'rensylk']],
  ['Route 16', ['maraudur', 'banchief', 'noterish', 'hexabeake']],
  ['Route 17', ['wyrmie', 'weldonrust', 'bizon', 'okloyama']],
  ['Victory Road', ['chetswatch', 'nidomonk', 'wild5', 'wild2', 'nivalux', 'storment', 'rensylk', 'okloyama', 'hexabeake', 'aerialyn']],
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

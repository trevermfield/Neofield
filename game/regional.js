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
    evoMoves: {},
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
    evoMoves: {},
    final: {ability: 'Torrent', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Shell Smash', 'Liquidation', 'Crunch', 'Aqua Jet']}},

  // ---------- wild ----------
  {key: 'wild1', color: '#f2a7b8', catchRate: 190,
    stages: [
      {name: 'Eggyhen', types: ['Fairy'], stats: S(45, 50, 45, 35, 40, 55), abilities: ['Early Bird', 'Big Pecks'], h: .3, w: 1.8,
        entry: 'A round puff of pink fluff that waddles after anything that moves. Designed by Tyler.'},
      {name: 'Leggyhen', at: 22, types: ['Fairy', 'Flying'], stats: S(80, 100, 70, 50, 65, 95), abilities: ['Early Bird', 'Intimidate'], h: 1.2, w: 24,
        entry: 'It spreads its big pink wings and crows loud enough to wake a whole town. Designed by Tyler.'},
    ],
    moves: [[1, 'Peck'], [1, 'Growl'], [5, 'Fairy Wind'], [9, 'Wing Attack'], [13, 'Draining Kiss'], [17, 'Aerial Ace'], [22, 'Roost'],
      [27, 'Play Rough'], [32, 'Drill Peck'], [38, 'Brave Bird'], [44, 'Double-Edge']],
    evoMoves: {},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Brave Bird', 'Play Rough', 'Roost', 'Swords Dance']}},

  {key: 'wild2', color: '#7fa8e6', catchRate: 150,
    stages: [
      {name: 'Sycasqeek', types: ['Normal'], stats: S(40, 45, 40, 60, 50, 65), abilities: ['Synchronize', 'Inner Focus'], h: .4, w: 5,
        entry: 'A curious little critter with a striped tail. It senses what others are thinking. Designed by Tyler.'},
      {name: 'Sycamage', at: 26, types: ['Normal', 'Psychic'], stats: S(70, 60, 65, 110, 90, 105), abilities: ['Synchronize', 'Magic Guard'], h: 1.3, w: 30,
        entry: 'Wrapped in a tattered dark cloak, it spins rings of psychic power around its claws. Designed by Tyler.'},
    ],
    moves: [[1, 'Scratch'], [1, 'Leer'], [5, 'Quick Attack'], [10, 'Confusion'], [15, 'Swift'], [20, 'Psybeam'], [26, 'Psychic'],
      [31, 'Hyper Voice'], [36, 'Nasty Plot'], [42, 'Psyshock'], [48, 'Shadow Ball']],
    evoMoves: {'Sycamage': ['Psychic']},
    final: {ability: 'Magic Guard', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Nasty Plot', 'Psychic', 'Hyper Voice', 'Focus Blast']}},

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
      {name: 'Poseigunk', at: 28, types: ['Water'], stats: S(95, 95, 85, 70, 80, 55), abilities: ['Swift Swim', 'Poison Touch'], h: 1.6, w: 120,
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
    moves: [[1, 'Peck'], [1, 'Growl'], [5, 'Water Gun'], [9, 'Wing Attack'], [14, 'Aqua Jet'], [19, 'Air Cutter'], [24, 'Roost'],
      [29, 'Air Slash'], [34, 'Surf'], [40, 'Hurricane'], [46, 'Hydro Pump']],
    evoMoves: {},
    final: {ability: 'Sniper', item: 'Scope Lens', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Hurricane', 'Hydro Pump', 'Roost', 'U-turn']}},

  {key: 'bizon', color: '#6b4f3f', catchRate: 120,
    stages: [
      {name: 'Bizon', types: ['Dark'], stats: S(70, 70, 60, 30, 45, 45), abilities: ['Intimidate', 'Thick Fat'], h: 1.0, w: 85,
        entry: 'A shaggy young bison with a crescent moon on its side. It charges at anything that wakes it up at night. Designed by Tyler.'},
      {name: 'Werebizon', at: 30, types: ['Dark'], stats: S(105, 130, 90, 40, 70, 75), abilities: ['Intimidate', 'Iron Fist'], h: 2.1, w: 260,
        entry: 'Under a full moon it rises up on two legs. The glowing moon on its chest gives it the strength to toss boulders. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Leer'], [5, 'Bite'], [10, 'Horn Attack'], [15, 'Assurance'], [20, 'Stomp'], [25, 'Crunch'],
      [30, 'Brick Break'], [35, 'Night Slash'], [40, 'Bulk Up'], [45, 'Close Combat'], [52, 'Knock Off']],
    evoMoves: {'Werebizon': ['Brick Break']},
    final: {ability: 'Intimidate', item: 'Life Orb', nature: 'Adamant', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Knock Off', 'Close Combat', 'Sucker Punch', 'Bulk Up']}},

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
      {name: 'Campyre', types: ['Fire', 'Grass'], stats: S(45, 50, 45, 60, 50, 60), abilities: ['Flash Fire', 'Flame Body'], h: .5, w: 6,
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
      {name: 'Icerpent', types: ['Ice', 'Poison'], stats: S(45, 55, 45, 50, 45, 55), abilities: ['Shed Skin', 'Ice Body'], h: 1.5, w: 7,
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
      {name: 'Weldonrust', types: ['Steel', 'Ground'], stats: S(95, 120, 120, 50, 75, 40), abilities: ['Iron Fist', 'Sand Force'], h: 2.2, w: 380,
        entry: 'An old welding robot that woke up in a junkyard. The rust on its arms never slows its punches. Designed by Tyler.'},
    ],
    moves: [[1, 'Metal Claw'], [1, 'Harden'], [6, 'Mud-Slap'], [12, 'Iron Defense'], [18, 'Bulldoze'], [24, 'Bullet Punch'], [30, 'Iron Head'],
      [36, 'Drill Run'], [42, 'Earthquake'], [48, 'Heavy Slam'], [54, 'Meteor Mash']],
    evoMoves: {},
    final: {ability: 'Iron Fist', item: 'Leftovers', nature: 'Adamant', evs: {hp: 252, atk: 252, def: 4}, moves: ['Meteor Mash', 'Earthquake', 'Bullet Punch', 'Stealth Rock']}},

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
      {name: 'Pinedale', types: ['Grass', 'Steel'], stats: S(45, 55, 45, 40, 45, 60), abilities: ['Run Away', 'Sap Sipper'], h: .9, w: 30,
        entry: 'A spry foal with a pine-needle mane. It wears a pinecone charm and gallops through the forest all day. Designed by Tyler.'},
      {name: 'Broncho', at: 18, types: ['Grass', 'Steel'], stats: S(65, 80, 60, 50, 60, 85), abilities: ['Run Away', 'Sap Sipper'], h: 1.6, w: 220,
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
      {name: 'Nidomonk', types: ['Psychic', 'Dragon'], stats: S(95, 90, 100, 100, 90, 55), abilities: ['Sturdy', 'Inner Focus'], h: 1.4, w: 160,
        entry: 'It sits so still in meditation that rocks float around it. The crystal on its brow glows with calm power. Designed by Tyler.'},
    ],
    moves: [[1, 'Tackle'], [1, 'Confusion'], [6, 'Dragon Breath'], [12, 'Calm Mind'], [18, 'Psybeam'], [24, 'Dragon Pulse'], [30, 'Psychic'],
      [36, 'Recover'], [42, 'Draco Meteor'], [48, 'Future Sight']],
    evoMoves: {},
    final: {ability: 'Sturdy', item: 'Leftovers', nature: 'Modest', evs: {hp: 252, spa: 252, spd: 4}, moves: ['Psychic', 'Draco Meteor', 'Calm Mind', 'Recover']}},

  {key: 'chetswatch', color: '#6aa6e6', catchRate: 75,
    stages: [
      {name: 'Chetswatch', types: ['Normal'], stats: S(100, 115, 75, 50, 70, 90), abilities: ['Scrappy', 'Hustle'], h: 2.4, w: 210,
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
      {name: 'Wyrmpod', at: 22, types: ['Bug'], stats: S(65, 80, 110, 50, 70, 30), abilities: ['Shed Skin', 'Shell Armor'], h: 1.0, w: 90,
        entry: 'It curls into a spiked ball and waits. Its glowing eyes peek out from inside the shell. Designed by Tyler.'},
      {name: 'Wyrmega', at: 45, types: ['Bug', 'Dragon'], stats: S(91, 134, 95, 80, 90, 110), abilities: ['Moxie', 'Tough Claws'], h: 3.0, w: 250,
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
      {name: 'Storment', types: ['Electric'], stats: S(90, 120, 85, 95, 85, 115), abilities: ['Pressure', 'Strong Jaw'], h: 2.0, w: 175,
        entry: 'A black wolf streaked with lightning. Thunder rolls across the sky wherever it runs. Designed by Tyler.'},
    ],
    moves: [[1, 'Thunder Fang'], [1, 'Bite'], [10, 'Spark'], [20, 'Crunch'], [30, 'Wild Charge'], [40, 'Volt Switch'], [50, 'Psychic Fangs'], [60, 'Thunder']],
    evoMoves: {},
    final: {ability: 'Strong Jaw', item: 'Life Orb', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Thunder Fang', 'Crunch', 'Psychic Fangs', 'Wild Charge']}},

  {key: 'rensylk', color: '#f08a4b', catchRate: 30, rare: true,
    stages: [
      {name: 'Rensylk', types: ['Fire'], stats: S(90, 85, 85, 120, 110, 100), abilities: ['Pressure', 'Flash Fire'], h: 1.8, w: 120,
        entry: 'A fox whose fur glows in the colors of a sunset. Its ears flicker with soft flames. Designed by Tyler.'},
    ],
    moves: [[1, 'Ember'], [1, 'Quick Attack'], [10, 'Flame Charge'], [20, 'Extrasensory'], [30, 'Flamethrower'], [40, 'Calm Mind'], [50, 'Energy Ball'], [60, 'Fire Blast']],
    evoMoves: {},
    final: {ability: 'Flash Fire', item: 'Leftovers', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Flamethrower', 'Energy Ball', 'Calm Mind', 'Morning Sun']}},

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
      {name: 'Hexabeake', types: ['Fire', 'Poison'], stats: S(100, 115, 90, 125, 90, 100), abilities: ['Pressure', 'Flame Body'], h: 3.5, w: 200,
        entry: 'A dark phoenix whose wings drip with burning tar. Legends say it curses anyone who looks at it too long. Designed by Tyler.'},
    ],
    moves: [[1, 'Ember'], [1, 'Poison Sting'], [10, 'Wing Attack'], [20, 'Sludge Bomb'], [30, 'Flamethrower'], [40, 'Nasty Plot'], [50, 'Sludge Wave'], [60, 'Overheat']],
    evoMoves: {},
    final: {ability: 'Levitate', item: 'Life Orb', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Sludge Bomb', 'Flamethrower', 'Nasty Plot', 'Roost']}},

  {key: 'aerialyn', color: '#f4a58a', catchRate: 20, rare: true,
    stages: [
      {name: 'Aerialyn', types: ['Psychic', 'Flying'], stats: S(100, 100, 100, 100, 100, 100), abilities: ['Serene Grace', 'Inner Focus'], h: .4, w: 2,
        entry: 'A tiny, playful bird that is almost never seen. It is said to know a little of every move there is. Designed by Tyler.'},
    ],
    moves: [[1, 'Pound'], [1, 'Gust'], [10, 'Confusion'], [20, 'Air Slash'], [30, 'Psychic'], [40, 'Roost'], [50, 'Hurricane'], [60, 'Calm Mind']],
    evoMoves: {},
    final: {ability: 'Serene Grace', item: 'Leftovers', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Air Slash', 'Psychic', 'Calm Mind', 'Roost']}},
  // ---------- the Champion's six (never wild, never in the MonDex) ----------
  {key: 'chemo', boss: true, rare: true, color: '#8bd42a', catchRate: 0,
    stages: [{name: 'Chemo', types: ['Poison', 'Steel'], stats: S(100, 110, 120, 80, 100, 60), abilities: ['Corrosion'], h: 2.0, w: 80, entry: 'A skeleton in a tattered hospital gown, pushing an IV stand full of glowing green poison.'}],
    moves: [[1, 'Poison Sting'], [30, 'Iron Head'], [50, 'Gunk Shot'], [60, 'Toxic']], evoMoves: {},
    final: {ability: 'Corrosion', item: '', nature: 'Impish', evs: {hp: 252, def: 252, atk: 4}, moves: ['Gunk Shot', 'Iron Head', 'Toxic', 'Recover']}},
  {key: 'fatigue', boss: true, rare: true, color: '#6b6fa8', catchRate: 0,
    stages: [{name: 'Fatigue', types: ['Normal', 'Dark'], stats: S(140, 120, 90, 50, 90, 40), abilities: ['Thick Fat'], h: 1.4, w: 300, entry: 'A huge sloth that is always half asleep. Faint ghosts drift off its heavy fur.'}],
    moves: [[1, 'Tackle'], [30, 'Crunch'], [50, 'Body Slam'], [60, 'Yawn']], evoMoves: {},
    final: {ability: 'Thick Fat', item: '', nature: 'Adamant', evs: {hp: 252, atk: 252, spd: 4}, moves: ['Yawn', 'Body Slam', 'Crunch', 'Slack Off']}},
  {key: 'fear', boss: true, rare: true, color: '#7a4fd6', catchRate: 0,
    stages: [{name: 'Fear', types: ['Ghost', 'Psychic'], stats: S(80, 60, 75, 130, 105, 110), abilities: ['Pressure'], h: 2.2, w: 1, entry: 'A tall shadow with huge claws, wrapped in screaming faces.'}],
    moves: [[1, 'Astonish'], [30, 'Shadow Ball'], [50, 'Psychic'], [60, 'Nasty Plot']], evoMoves: {},
    final: {ability: 'Pressure', item: '', nature: 'Timid', evs: {spa: 252, spe: 252, hp: 4}, moves: ['Shadow Ball', 'Psychic', 'Nasty Plot', 'Dark Pulse']}},
  {key: 'pain', boss: true, rare: true, color: '#d6283a', catchRate: 0,
    stages: [{name: 'Pain', types: ['Rock', 'Fighting'], stats: S(85, 140, 100, 60, 70, 105), abilities: ['Sturdy'], h: 1.8, w: 400, entry: 'A wolf made of jagged red crystal. Every step cracks the ground.'}],
    moves: [[1, 'Rock Throw'], [30, 'Stone Edge'], [50, 'Close Combat'], [60, 'Swords Dance']], evoMoves: {},
    final: {ability: 'Sturdy', item: '', nature: 'Jolly', evs: {atk: 252, spe: 252, hp: 4}, moves: ['Swords Dance', 'Close Combat', 'Stone Edge', 'Earthquake']}},
  {key: 'loneliness', boss: true, rare: true, color: '#7fb6e8', catchRate: 0,
    stages: [{name: 'Loneliness', types: ['Ice', 'Psychic'], stats: S(95, 55, 110, 125, 115, 70), abilities: ['Snow Cloak'], h: 1.2, w: 30, entry: 'A lonely child curled up inside a sphere of ice, circled by pale ghosts.'}],
    moves: [[1, 'Icy Wind'], [30, 'Psychic'], [50, 'Freeze-Dry'], [60, 'Calm Mind']], evoMoves: {},
    final: {ability: 'Snow Cloak', item: '', nature: 'Calm', evs: {hp: 252, spa: 252, spd: 4}, moves: ['Freeze-Dry', 'Psychic', 'Calm Mind', 'Recover']}},
  {key: 'relapse', boss: true, rare: true, color: '#4a2a5a', catchRate: 0,
    stages: [{name: 'Relapse', types: ['Dragon', 'Dark'], stats: S(95, 110, 95, 115, 95, 90), abilities: ['Regenerator'], h: 3.0, w: 250, entry: 'Seven heads of black scale and violet flame. Cut one off and it grows back, stronger than before.'}],
    moves: [[1, 'Bite'], [30, 'Dragon Pulse'], [50, 'Dark Pulse'], [60, 'Draco Meteor']], evoMoves: {},
    final: {ability: 'Regenerator', item: '', nature: 'Naive', evs: {atk: 128, spa: 128, spe: 252}, moves: ['Draco Meteor', 'Dark Pulse', 'Flamethrower', 'Recover']}},
];

// Tyler's move/ability revisions: each listed [level, move] replaces the move(s) at that level
// (in order), or is added when the level has none. Applies to every stage of the line.
const MOVE_EDITS = {
  starter1: [[1, 'Bind'], [1, 'Flash'], [24, 'Light Screen'], [32, 'Shock Wave'], [36, 'Solar Beam'], [46, 'Horn Leech'], [52, 'Solar Blade'], [65, 'Frenzy Plant']],
  starter2: [[1, 'Scratch'], [1, 'Tail Whip'], [52, 'Dragon Dance'], [58, 'Fire Blast'], [65, 'Blast Burn']],
  starter3: [[1, 'Tackle'], [1, 'Growl'], [20, 'Protect'], [24, 'Crunch'], [28, 'Iron Defense'], [32, 'Hyper Voice'], [36, 'Aqua Tail'], [65, 'Hydro Cannon']],
  wild2: [[10, 'Confuse Ray'], [20, 'Confusion'], [31, 'Tri Attack']],
  bizon: [[45, 'Lunar Blessing']],
  wild6: [[1, 'Astonish'], [1, 'Harden'], [5, 'Accelerock'], [30, 'Ancient Power'], [35, 'Last Respects']],
  maraudur: [[10, 'Rage'], [54, 'Behemoth Blade']],
  wild5: [[33, 'Super Fang'], [50, 'Ice Beam']],
  marooner: [[38, 'Tailwind']],
  weldonrust: [[6, 'Magnitude']],
  noterish: [[1, 'Pay Day'], [1, 'Minimize'], [5, 'Leafage'], [9, 'Lucky Chant'], [46, 'Focus Punch']],
  pinedale: [[23, 'Trailblaze'], [28, 'Trop Kick'], [55, 'Behemoth Bash']],
  nidomonk: [[24, 'Dragon Claw'], [55, 'Expanding Force']],
  chetswatch: [[1, 'Pound'], [1, 'Hone Claws']],
  banchief: [[1, 'Astonish'], [1, 'Spite'], [12, 'Revenge'], [18, 'Poison Jab'], [30, 'Sacred Sword'], [36, 'Destiny Bond'], [48, 'Shadow Force']],
  cryodon: [[5, 'Ice Ball'], [26, 'Snowscape'], [50, 'Head Smash'], [56, 'Mountain Gale']],
  wyrmie: [[1, 'Cut'], [1, 'String Shot'], [15, 'Sticky Web']],
  nivalux: [[1, 'Powder Snow'], [1, 'Noble Roar'], [10, 'Icy Wind'], [20, 'Aurora Beam'], [30, 'Psychic'], [50, 'Tailwind'], [60, 'Aurora Veil'], [70, 'Blizzard']],
  storment: [[1, 'Thunder Fang'], [1, 'Torment'], [60, 'Wildbolt Storm'], [70, 'Electro Shot']],
  rensylk: [[1, 'Ember'], [1, 'Howl'], [10, 'Mystical Fire'], [40, 'Morning Sun'], [50, 'Calm Mind'], [60, 'Weather Ball'], [70, 'Blue Flare']],
  aerialyn: [[1, 'Gust'], [1, 'Agility'], [10, 'Icy Wind'], [20, 'Aerial Ace'], [30, 'Esper Wing'], [40, 'Zippy Zap'], [50, 'Torch Song'], [70, 'Bleakwind Storm']],
};
// The two legendaries below know exactly these four moves and nothing else.
const ONLY_MOVES = {
  okloyama: ['Play Rough', 'Swords Dance', 'Earthquake', 'Diamond Storm'],
  hexabeake: ['Fire Blast', 'Nasty Plot', 'Sludge Wave', 'Draco Meteor'],
};
// [family, stage index, [normal ability, hidden ability]] and the final set's ability to match
const ABILITY_EDITS = [
  ['starter1', 2, ['Mega Sol', 'Lightning Rod']],
  ['marooner', 0, ['Wind Power', 'Speed Boost']],
  ['nidomonk', 0, ['Psychic Surge', 'Inner Focus']],
  ['storment', 0, ['Drizzle', 'Strong Jaw']],
  ['rensylk', 0, ['Drought', 'Flash Fire']],
  ['hexabeake', 0, ['Levitate', 'Flame Body']],
];
for (const f of FAMILIES) {
  const edits = MOVE_EDITS[f.key];
  if (edits) {
    const byLv = new Map();
    for (const [lv, mv] of edits) { if (!byLv.has(lv)) byLv.set(lv, []); byLv.get(lv).push(mv); }
    const out = [];
    const seen = new Map();
    for (const [lv, mv] of f.moves) {
      const rep = byLv.get(lv);
      if (rep) {
        const i = seen.get(lv) || 0; seen.set(lv, i + 1);
        if (i < rep.length) { if (rep[i]) out.push([lv, rep[i]]); continue; }
      }
      out.push([lv, mv]);
    }
    for (const [lv, rep] of byLv) for (let i = seen.get(lv) || 0; i < rep.length; i++) if (rep[i]) out.push([lv, rep[i]]);
    f.moves = out.sort((a, b) => a[0] - b[0]);
  }
  const only = ONLY_MOVES[f.key];
  if (only) { f.moves = only.map(m => [1, m]); f.final.moves = only.slice(); f.evoMoves = {}; }
}
for (const [key, si, ab] of ABILITY_EDITS) {
  const f = FAMILIES.find(x => x.key === key);
  f.stages[si].abilities = ab;
  const last = f.stages[f.stages.length - 1];
  if (!last.abilities.includes(f.final.ability)) f.final.ability = last.abilities[0];
}

// Routes: index i joins map point i and i+1 (0 = home town, 18 = Victory Summit).
// Rare (legendary) families are never random encounters: each one guards a legendary side quest on the Laurel Pass.
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
  ['Route 13', ['banchief', 'cryodon', 'wild3']],
  ['Route 14', ['nidomonk', 'chetswatch', 'wyrmie']],
  ['Route 15', ['wild6', 'pinedale', 'cryodon']],
  ['Route 16', ['maraudur', 'banchief', 'noterish']],
  ['Route 17', ['wyrmie', 'weldonrust', 'bizon']],
  ['Laurel Pass', ['chetswatch', 'nidomonk', 'wild5', 'wild2']],
].map(([name, fams], i) => ({name, families: fams, idx: i}));

// Dex category line under each name in the MonDex ("The Bulb Mon").
const CATEGORY = {Bulbazoid: 'Bulb', Ivyzoid: 'Spotlight', Venuzoid: 'Satellite', Shardmander: 'Gem', Shardmeleon: 'Crystal', Shardizar: 'Amethyst', Grrtle: 'Turtle', Roartortle: 'Angry', Bellowtoise: 'Tank', Eggyhen: 'Chick', Leggyhen: 'Rooster', Sycasqeek: 'Critter', Sycamage: 'Mage', Zapybara: 'Capybara', Bloogilp: 'Sunfish', Poseigunk: 'Swamp', Yucrane: 'Heron', Bizon: 'Bison', Werebizon: 'Beast', Riptome: 'Tombstone', Ripblok: 'Graveyard', Ripgool: 'Moai', Campyre: 'Campfire', Bonpyre: 'Bonfire', Maraudur: 'Viking', Maraudoom: 'Marauder', Icerpent: 'Snow Snake', Coldbra: 'Ice Cobra', Marooner: 'Hermes', Weldonrust: 'Colossal', Noterish: 'Shamrock', Damerish: 'Irish', Pinedale: 'Wrangler', Broncho: 'Mustang', Coltmare: 'Stallion', Mugnbud: 'Dung Beetle', Nidomonk: 'Mystical', Chetswatch: 'Bigfoot', Banchief: 'Phantom', Cryodon: 'Glyptodon', Rimeocerus: 'Woolly Rhino', Wyrmie: 'Larva', Wyrmpod: 'Chrysalis', Wyrmega: 'Wyrm', Nivalux: 'Ice Storm', Storment: 'Thunderstorm', Rensylk: 'Sunset', Okloyama: 'Conservation', Hexabeake: 'Industry', Aerialyn: 'Flycatcher'};

// ---------- inject into the simulator ----------
let num = 1;
export const SPECIES = []; // flat list in dex order
export const BOSS_SPECIES = []; // the Champion's six: battle-only, kept out of the MonDex
for (const fam of FAMILIES) {
  fam.stages.forEach((st, i) => {
    const id = toID(st.name);
    st.id = id; st.num = num++; st.family = fam.key; st.stage = i;
    st.cat = CATEGORY[st.name] ? `The ${CATEGORY[st.name]} Mon` : '';
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
    (fam.boss ? BOSS_SPECIES : SPECIES).push(st);
  });
  const last = fam.stages[fam.stages.length - 1];
  fam.finalSet = {name: last.name, species: last.name, ...JSON.parse(JSON.stringify(fam.final)), ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}};
}
export const REGIONAL_IDS = new Set([...SPECIES, ...BOSS_SPECIES].map(s => s.id));
export const isRegional = name => REGIONAL_IDS.has(toID(name));
export function regionalInfo(name) {
  const id = toID(name);
  const st = SPECIES.find(s => s.id === id) || BOSS_SPECIES.find(s => s.id === id);
  if (!st) return null;
  const fam = FAMILIES.find(f => f.key === st.family);
  const routes = ROUTES.filter(r => r.families.includes(fam.key)).map(r => r.name);
  return {...st, familyKey: fam.key, color: fam.color, catchRate: fam.catchRate, starter: !!fam.starter, rare: !!fam.rare, routes, line: fam.stages.map(s => ({name: s.name, at: s.at || 1}))};
}
export const familyOf = key => FAMILIES.find(f => f.key === key);
export const STARTERS = FAMILIES.filter(f => f.starter);

// The Champion's team (Victory Summit), as set text
const SHORT = {hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
export const CHAMPION_ORDER = ['fatigue', 'loneliness', 'pain', 'chemo', 'fear', 'relapse'];
export const CHAMPION_TEXT = CHAMPION_ORDER.map(k => {
  const f = FAMILIES.find(x => x.key === k), fs = f.final, n = f.stages[0].name;
  return `${n}\nAbility: ${fs.ability}\nEVs: ${Object.entries(fs.evs).map(([a, v]) => v + ' ' + SHORT[a]).join(' / ')}\n${fs.nature} Nature\n${fs.moves.map(m => '- ' + m).join('\n')}`;
}).join('\n\n');

// XP rules for Adventure. The game and the playthrough simulator (../sim) both read these numbers,
// so changing one here changes the real game and the simulator together.
//
// A Mon beats a foe -> base XP for that kind of fight x a multiplier for how far apart their levels are.
// Mons that fought get full XP, the rest of the team gets a share, Mons on the Farm get nothing.
export const XP = {
  perLevel: 100,                                   // XP needed for one level
  base: {wild: 40, trainer: 55, gym: 45, legend: 200},
  benchShare: 0.5,                                 // team Mons that did not fight
  // Foe level minus your Mon's level: +5 or more is an underdog bonus, within 4 below is normal,
  // then it falls away. Points are [gap, multiplier]; gaps in between are blended.
  bonusGap: 5, bonusMult: 1.5,
  fullDownTo: -4,
  falloff: [[-5, 0.6], [-10, 0.3], [-15, 0.1], [-20, 0]],
};

// XP to climb out of a level: early levels are quicker (half up to level 14, three quarters up to 19)
export function xpNeed(level, cfg = XP) {
  return Math.round(cfg.perLevel * (level < 15 ? 0.5 : level < 20 ? 0.75 : 1));
}

export function xpMultiplier(foeLevel, myLevel, cfg = XP) {
  const gap = foeLevel - myLevel;
  if (gap >= cfg.bonusGap) return cfg.bonusMult;
  if (gap >= cfg.fullDownTo) return 1;
  const pts = cfg.falloff;
  if (gap >= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (gap >= pts[i][0]) {
      const [g0, m0] = pts[i - 1], [g1, m1] = pts[i];
      return m1 + (m0 - m1) * (gap - g1) / (g0 - g1);
    }
  }
  return pts[pts.length - 1][1];
}

// kind: 'wild' | 'trainer' | 'gym' | 'legend'
export function xpForKO(kind, foeLevel, myLevel, cfg = XP) {
  return Math.round((cfg.base[kind] || 0) * xpMultiplier(foeLevel, myLevel, cfg));
}

// Which team slots were sent out in a battle, read from the battle log. names[slot] is the name used in the battle.
export function participantsFromLog(log, names) {
  const seen = new Set();
  for (const line of log || []) {
    const m = /^\|(?:switch|drag)\|p1[a-z]?: ([^|]+)\|/.exec(line);
    if (m) seen.add(m[1]);
  }
  const slots = new Set();
  names.forEach((n, i) => { if (seen.has(n)) slots.add(i); });
  return slots;
}

// Small deterministic PRNG. Vasav is into randomization, so the collage
// reshuffles once a day (seeded from the date in Kochi) and on demand.

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** YYYY-MM-DD in IST, so the daily seed flips at midnight in Kochi. */
export function istDate(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d)
}

export function dailySeed(d = new Date()) {
  return hashString(istDate(d))
}

export type Rng = () => number

export const range = (rng: Rng, min: number, max: number) => min + rng() * (max - min)
export const pick = <T,>(rng: Rng, items: readonly T[]) => items[Math.floor(rng() * items.length)] as T

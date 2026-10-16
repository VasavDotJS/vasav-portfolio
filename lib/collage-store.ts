import { dailySeed, hashString } from './seeded-random'

// The collage seed: daily by default (IST), re-rolled by typing "random".
let seed = 0
const listeners = new Set<(s: number) => void>()

export const getSeed = () => seed || (seed = dailySeed())
export function reseed() {
  seed = hashString(`${Date.now()}-${Math.random()}`)
  listeners.forEach((fn) => fn(seed))
}
export function onSeed(fn: (s: number) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

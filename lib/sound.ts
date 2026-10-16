// Opt-in sound, off by default, never autoplays. Every sample is synthesized with the
// Web Audio API on first use (no files to download). A nod to "audio mapping".
import { useSyncExternalStore } from 'react'

export type SoundKind = 'click' | 'key' | 'rustle' | 'hum' | 'stamp'

let enabled = false
let ctx: AudioContext | null = null
const buffers = new Map<SoundKind, AudioBuffer>()
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((fn) => fn())
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
export const isSoundOn = () => enabled
export const useSoundOn = () => useSyncExternalStore(subscribe, isSoundOn, () => false)

export function setSound(on: boolean) {
  enabled = on
  if (on) ensureContext()
  emit()
}

function ensureContext() {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  synthesize(ctx)
  return ctx
}

function synthesize(ac: AudioContext) {
  const sr = ac.sampleRate
  const make = (seconds: number, fn: (t: number, i: number) => number) => {
    const len = Math.floor(sr * seconds)
    const buf = ac.createBuffer(1, len, sr)
    const ch = buf.getChannelData(0)
    for (let i = 0; i < len; i++) ch[i] = fn(i / sr, i)
    return buf
  }
  let seed = 7
  const noise = () => {
    seed = (seed * 16807) % 2147483647
    return (seed / 2147483647) * 2 - 1
  }
  // dry tick
  buffers.set('click', make(0.04, (t) => noise() * Math.exp(-t * 180) * 0.5))
  // keycap thock: low body + bright tick
  buffers.set(
    'key',
    make(0.09, (t) => Math.sin(2 * Math.PI * 165 * t) * Math.exp(-t * 55) * 0.45 + noise() * Math.exp(-t * 260) * 0.35),
  )
  // paper rustle: noise with a lumpy envelope
  buffers.set(
    'rustle',
    make(0.28, (t) => noise() * (0.5 + 0.5 * Math.sin(t * 90) * Math.sin(t * 37)) * Math.exp(-t * 9) * 0.22),
  )
  // riso drum hum
  buffers.set(
    'hum',
    make(1.3, (t) => {
      const env = Math.min(1, t * 6) * Math.exp(-t * 1.6)
      return (Math.sin(2 * Math.PI * 55 * t) * 0.5 + Math.sin(2 * Math.PI * 110 * t) * 0.2 + noise() * 0.05) * env * 0.35
    }),
  )
  // stamp slam
  buffers.set(
    'stamp',
    make(0.2, (t) => (Math.sin(2 * Math.PI * 70 * t) * 0.7 + noise() * 0.3) * Math.exp(-t * 28) * 0.6),
  )
}

export function play(kind: SoundKind, { rate = 1, gain = 1 } = {}) {
  if (!enabled) return
  const ac = ensureContext()
  const buf = buffers.get(kind)
  if (!ac || !buf) return
  const src = ac.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = rate * (0.94 + Math.random() * 0.12)
  const g = ac.createGain()
  g.gain.value = gain
  src.connect(g).connect(ac.destination)
  src.start()
}

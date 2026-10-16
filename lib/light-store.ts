// One global light source. Two outputs, because they cost very different amounts:
//
//  - parallax (--px/--py) is written every frame, but only onto registered elements (the hero
//    collage). Restyling one subtree of transformed scraps is cheap.
//  - the shared light (--lx/--ly on :root) drives every neomorphic shadow and specular. Writing
//    it restyles and repaints the whole page, so it moves per frame only with a fine pointer.
//    On touch it follows the gyro coarsely (big steps, a couple of times a second). Without a gyro
//    the collage drifts via a CSS animation on `translate` (compositor-only, data-drift below).
//    A JS drift writing vars cost ~6.8s of blocking per 8s on a 4x-throttled phone.
//
// The 3D scene reads getLight(), so CSS shadows and WebGL share one light either way.

type Light = { x: number; y: number }

const REST: Light = { x: -0.35, y: -0.45 }
const target: Light = { ...REST }
const current: Light = { ...REST }
let raf = 0
let lastRoot = { x: NaN, y: NaN, t: 0 }
let coarse = false
let drifting = false
const listeners = new Set<() => void>()
const parallax = new Set<HTMLElement>()

export const getLight = (): Light => current

export function subscribeLight(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** Elements that read --px/--py (parallax). Written every frame while the light moves. */
export function registerParallax(el: HTMLElement) {
  parallax.add(el)
  el.dataset.drift = String(drifting)
  el.style.setProperty('--px', current.x.toFixed(3))
  el.style.setProperty('--py', current.y.toFixed(3))
  return () => {
    parallax.delete(el)
  }
}

function write(now: number) {
  for (const el of parallax) {
    el.style.setProperty('--px', current.x.toFixed(3))
    el.style.setProperty('--py', current.y.toFixed(3))
  }
  const dx = Math.abs(current.x - lastRoot.x)
  const dy = Math.abs(current.y - lastRoot.y)
  const due = coarse ? (dx > 0.12 || dy > 0.12) && now - lastRoot.t > 500 : dx > 0.002 || dy > 0.002
  if (!due && !Number.isNaN(lastRoot.x)) return
  const s = document.documentElement.style
  s.setProperty('--lx', current.x.toFixed(3))
  s.setProperty('--ly', current.y.toFixed(3))
  lastRoot = { x: current.x, y: current.y, t: now }
  listeners.forEach((fn) => fn())
}

function tick(now: number) {
  current.x += (target.x - current.x) * 0.12
  current.y += (target.y - current.y) * 0.12
  write(now)
  if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
    raf = requestAnimationFrame(tick)
  } else {
    raf = 0
  }
}

export function setLightTarget(x: number, y: number) {
  target.x = Math.max(-1, Math.min(1, x))
  target.y = Math.max(-1, Math.min(1, y))
  if (!raf) raf = requestAnimationFrame(tick)
}

function setDrift(on: boolean) {
  drifting = on
  for (const el of parallax) el.dataset.drift = String(on)
}

export function initLight() {
  const cleanups: (() => void)[] = []
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  coarse = !fine

  if (fine) {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setLightTarget((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', onMove))
  } else if (!reduced) {
    // Touch: the gyro where it needs no permission prompt; otherwise a slow idle drift.
    const needsPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
    if (!needsPermission && 'DeviceOrientationEvent' in window) {
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return
        setLightTarget(e.gamma / 35, (e.beta - 45) / 35)
      }
      window.addEventListener('deviceorientation', onTilt, { passive: true })
      cleanups.push(() => window.removeEventListener('deviceorientation', onTilt))
    }
    // no gyro (yet): CSS idle drift on the compositor until the first orientation event
    setDrift(true)
    const stopDrift = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return // some browsers fire one empty event
      setDrift(false)
      window.removeEventListener('deviceorientation', stopDrift)
    }
    window.addEventListener('deviceorientation', stopDrift, { passive: true })
    cleanups.push(() => {
      window.removeEventListener('deviceorientation', stopDrift)
      setDrift(false)
    })
  }

  return () => {
    cleanups.forEach((c) => c())
    cancelAnimationFrame(raf)
    raf = 0
  }
}

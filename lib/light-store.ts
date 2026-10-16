// One global light source tied to the pointer. Writes lerped --lx/--ly (-1..1) on :root
// and exposes the same values to the 3D scene, so CSS shadows and WebGL share a light.

type Light = { x: number; y: number }

const REST: Light = { x: -0.35, y: -0.45 }
const target: Light = { ...REST }
const current: Light = { ...REST }
let raf = 0
let lastWrite = { x: NaN, y: NaN }
const listeners = new Set<() => void>()

export const getLight = (): Light => current

export function subscribeLight(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function write() {
  if (Math.abs(current.x - lastWrite.x) < 0.002 && Math.abs(current.y - lastWrite.y) < 0.002) return
  const s = document.documentElement.style
  s.setProperty('--lx', current.x.toFixed(3))
  s.setProperty('--ly', current.y.toFixed(3))
  lastWrite = { x: current.x, y: current.y }
  listeners.forEach((fn) => fn())
}

function tick() {
  current.x += (target.x - current.x) * 0.12
  current.y += (target.y - current.y) * 0.12
  write()
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

export function initLight() {
  const cleanups: (() => void)[] = []
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (fine) {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setLightTarget((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    cleanups.push(() => window.removeEventListener('pointermove', onMove))
  } else if (!reduced) {
    // Touch: use the gyro where it needs no permission prompt; otherwise a slow idle drift.
    const needsPermission =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
    let gotGyro = false
    if (!needsPermission && 'DeviceOrientationEvent' in window) {
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return
        gotGyro = true
        setLightTarget(e.gamma / 35, (e.beta - 45) / 35)
      }
      window.addEventListener('deviceorientation', onTilt, { passive: true })
      cleanups.push(() => window.removeEventListener('deviceorientation', onTilt))
    }
    const start = performance.now()
    const id = window.setInterval(() => {
      if (gotGyro || document.hidden) return
      const t = (performance.now() - start) / 1000
      setLightTarget(Math.sin(t * 0.35) * 0.7, Math.cos(t * 0.27) * 0.5 - 0.2)
    }, 1000 / 15)
    cleanups.push(() => window.clearInterval(id))
  }

  return () => {
    cleanups.forEach((c) => c())
    cancelAnimationFrame(raf)
    raf = 0
  }
}

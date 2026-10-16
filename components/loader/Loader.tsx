'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { misc } from '@/content/copy'
import { profile } from '@/content/profile'
import { sceneMilestones } from '@/lib/scene-state'
import { startScroll, stopScroll } from '@/lib/scroll'
import { hashString, mulberry32, range } from '@/lib/seeded-random'
import { play } from '@/lib/sound'

/**
 * "The print run". The counter follows real loading (fonts, the lazy 3D chunk, its first
 * rendered frame, window load), lerped so it never goes backwards or sits still.
 * A halftone dot field assembles into the monogram, three ink passes print it,
 * it presses in like a button, and the sheet tears open onto the hero.
 */

type Dot = { sx: number; sy: number; tx: number; ty: number; th: number; arrive: number }

const SEEN_KEY = 'vpr-loaded'
const MAX_WAIT = 8000

function tornEdge(seed: string) {
  const rng = mulberry32(hashString(seed))
  const n = 26
  return Array.from({ length: n + 1 }, (_, i) => ({ x: (i / n) * 100, y: 50 + range(rng, -2.2, 2.2) }))
}

export function Loader() {
  const root = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    const canvas = canvasRef.current
    const counter = counterRef.current
    if (!el || !canvas || !counter) return
    const html = document.documentElement
    const mode = html.dataset.loader ?? 'full'
    const start = performance.now()
    let raf = 0
    let finished = false
    let exiting = false

    const done = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {}
      html.classList.remove('is-loading')
      html.dataset.loaderDone = 'true'
      el.style.display = 'none'
      startScroll()
      window.dispatchEvent(new Event('vpr:reveal'))
    }

    stopScroll()

    // ---------- reduced motion: counter + crossfade only ----------
    if (mode === 'calm') {
      counter.textContent = '100'
      const t = window.setTimeout(() => {
        gsap.to(el, { opacity: 0, duration: 0.3, onComplete: done })
      }, 250)
      return () => window.clearTimeout(t)
    }

    // ---------- canvas setup ----------
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = canvas.clientWidth
    const H = canvas.clientHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.scale(dpr, dpr)
    const cell = Math.max(6, Math.round(W / 74))
    const css = getComputedStyle(html)
    const dark = html.dataset.theme === 'dark'
    const ink = {
      plate: css.getPropertyValue('--ink-muted').trim() || '#5b5852',
      y: css.getPropertyValue('--riso-yellow').trim() || '#fce244',
      c: css.getPropertyValue('--riso-coral').trim() || '#eb6461',
      k: dark ? '#edebe6' : '#0e0e0e',
    }
    const rng = mulberry32(hashString(`${profile.monogram}-${Date.now() >> 16}`))
    let dots: Dot[] = []

    const buildTargets = () => {
      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const o = off.getContext('2d')!
      const family = css.getPropertyValue('--font-display').trim() || 'Arial, sans-serif'
      o.font = `800 ${Math.round(H * 1.02)}px ${family}`
      o.textAlign = 'center'
      o.textBaseline = 'alphabetic'
      if ('letterSpacing' in o) (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-H * 0.05}px`
      o.fillStyle = '#000'
      o.fillText(profile.monogram, W / 2, H * 0.86)
      const data = o.getImageData(0, 0, W, H).data
      const out: Dot[] = []
      for (let y = cell / 2; y < H; y += cell) {
        for (let x = cell / 2; x < W; x += cell) {
          if (data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3]! > 128) {
            const a = rng() * Math.PI * 2
            const r = range(rng, 0.6, 1.4) * Math.max(W, H)
            out.push({ sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r * 0.6, tx: x, ty: y, th: rng() * 0.82, arrive: -1 })
          }
        }
      }
      dots = out
    }

    // ---------- progress ----------
    let fontsReady = false
    let windowLoaded = document.readyState === 'complete'
    document.fonts?.ready.then(() => {
      fontsReady = true
      buildTargets()
    })
    if (!document.fonts) {
      fontsReady = true
      buildTargets()
    }
    const onLoad = () => (windowLoaded = true)
    window.addEventListener('load', onLoad, { once: true })

    const target = () => {
      const m = sceneMilestones
      let t = 0.08
      if (fontsReady) t += 0.22
      if (windowLoaded) t += 0.12
      if (m.requested) t += 0.08
      if (m.chunk) t += 0.3
      if (m.ready) t += 0.2
      return Math.min(1, t)
    }

    let shown = 0
    let prevShown = 0
    const minLoad = mode === 'short' ? 0 : 900
    const printStart = { t: -1 }

    // ---------- skip ----------
    const skip = () => {
      if (performance.now() - start < 600 || exiting) return
      shown = 1
      printStart.t = performance.now() - 2000
      exit(true)
    }
    const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchmove'] as const
    skipEvents.forEach((e) => window.addEventListener(e, skip, { passive: true }))

    // ---------- draw ----------
    // Cheap by construction: ink layers are rendered once and wiped in with drawImage; dots that
    // have landed are baked into a plate; only dots in flight are drawn per frame (dots that haven't
    // launched sit off-canvas). The canvas repaints at ~30fps, which suits the stepped print feel.
    const ease = (k: number) => 1 - Math.pow(1 - k, 3)
    const r = cell * 0.36
    const mis = cell * 0.42
    const layer = (color: string, rad: number, dx: number, dy: number) => {
      const c = document.createElement('canvas')
      c.width = canvas.width
      c.height = canvas.height
      const g = c.getContext('2d')!
      g.scale(dpr, dpr)
      g.fillStyle = color
      g.beginPath()
      for (const d of dots) {
        g.moveTo(d.tx + dx + rad, d.ty + dy)
        g.arc(d.tx + dx, d.ty + dy, rad, 0, Math.PI * 2)
      }
      g.fill()
      return c
    }
    let inks: { plate: HTMLCanvasElement; y: HTMLCanvasElement; c: HTMLCanvasElement; k: HTMLCanvasElement } | null = null
    const baked = document.createElement('canvas')
    baked.width = canvas.width
    baked.height = canvas.height
    const bake = baked.getContext('2d')!
    bake.scale(dpr, dpr)
    bake.fillStyle = ink.plate
    // draw `src` (device-pixel canvas) revealed from the top down to `wipe` (0..1)
    const wipeIn = (src: HTMLCanvasElement, wipe: number, alpha = 1) => {
      const h = Math.min(src.height, Math.ceil(wipe * (H + cell) * dpr))
      if (h <= 0 || alpha <= 0) return
      ctx.globalAlpha = alpha
      ctx.drawImage(src, 0, 0, src.width, h, 0, 0, W, h / dpr)
      ctx.globalAlpha = 1
    }

    let last = start
    let lastDraw = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      // rAF timestamps can precede `start`; never let dt go negative
      const dt = Math.max(0, Math.min(0.25, (now - last) / 1000))
      last = Math.max(last, now)
      const elapsed = now - start
      // displayed progress: chase the real target, creep while waiting, never backwards
      const real = elapsed > MAX_WAIT ? 1 : target()
      const ceiling = real >= 1 ? 1 : Math.min(real + 0.07, 0.97)
      const timeCap = mode === 'short' ? 1 : Math.min(1, elapsed / minLoad)
      const goal = Math.min(ceiling, Math.max(real * timeCap, shown))
      // time-based chase so a busy main thread can't stall the number
      shown += (goal - shown) * (1 - Math.exp(-dt * (mode === 'short' ? 30 : 6))) + (goal > shown ? dt * 0.05 : 0)
      shown = Math.max(prevShown, Math.min(shown, ceiling, 1))
      prevShown = shown
      if (real >= 1 && timeCap >= 1 && 1 - shown < 0.004) shown = 1
      const label = String(Math.floor(shown * 100)).padStart(3, '0')
      if (counter.textContent !== label) counter.textContent = label

      if (!dots.length || now - lastDraw < 30) return
      lastDraw = now

      if (shown >= 1 && printStart.t < 0) {
        printStart.t = now
        play('hum')
      }
      ctx.clearRect(0, 0, W, H)
      if (printStart.t < 0) {
        // assembling plate: baked arrivals + dots in flight
        ctx.drawImage(baked, 0, 0, W, H)
        ctx.fillStyle = ink.plate
        ctx.beginPath()
        for (const d of dots) {
          if (d.arrive === -2) continue // baked
          if (d.arrive < 0) {
            if (shown < d.th) continue // not launched, off-canvas
            d.arrive = now
          }
          const k = ease(Math.min(1, (now - d.arrive) / 520))
          if (k >= 1) {
            bake.beginPath()
            bake.arc(d.tx, d.ty, r, 0, Math.PI * 2)
            bake.fill()
            d.arrive = -2
            continue
          }
          const x = d.sx + (d.tx - d.sx) * k
          const y = d.sy + (d.ty - d.sy) * k
          const rr = r * (0.35 + 0.65 * k)
          ctx.moveTo(x + rr, y)
          ctx.arc(x, y, rr, 0, Math.PI * 2)
        }
        ctx.fill()
      } else {
        // three ink passes, each wiping down, offset like a misregistered riso drum
        inks ??= {
          plate: layer(ink.plate, r, 0, 0),
          y: layer(ink.y, cell * 0.5, mis, -mis * 0.6),
          c: layer(ink.c, cell * 0.38, -mis * 0.8, mis * 0.4),
          k: layer(ink.k, cell * (dark ? 0.22 : 0.3), 0, 0),
        }
        const t = (now - printStart.t) / (mode === 'short' ? 160 : 620)
        const wipe = (i: number) => Math.max(0, Math.min(1, (t - i * 0.28) / 0.6))
        // paper: inks multiply like real riso. OLED: inks stack in order so each pass stays readable
        ctx.globalCompositeOperation = dark ? 'source-over' : 'multiply'
        wipeIn(inks.plate, 1, 1 - wipe(2))
        wipeIn(inks.y, wipe(0))
        wipeIn(inks.c, wipe(1))
        wipeIn(inks.k, wipe(2))
        ctx.globalCompositeOperation = 'source-over'
        if (wipe(2) >= 1) exit(false)
      }
    }
    raf = requestAnimationFrame(frame)
    // hard failsafe: whatever happens, the overlay never outlives MAX_WAIT by much
    const failsafe = window.setTimeout(() => exit(true), MAX_WAIT + 2500)
    const finalFailsafe = window.setTimeout(done, MAX_WAIT + 5000)

    // ---------- exit: press in, sink, tear ----------
    const exit = (fast: boolean) => {
      if (exiting) return
      exiting = true
      skipEvents.forEach((e) => window.removeEventListener(e, skip))
      const tl = gsap.timeline({ onComplete: done })
      const k = fast || mode === 'short' ? 0.45 : 1
      tl.to(el.querySelector('.loader-mark'), { scale: 1.12, duration: 0.28 * k, ease: 'power3.out' })
        .to(el.querySelector('.loader-btn'), { opacity: 1, scale: 1, duration: 0.24 * k, ease: 'power3.out' }, '<')
        .add(() => {
          el.querySelector('.loader-btn')?.setAttribute('data-pressed', 'true')
          play('key')
        })
        .to(el.querySelector('.loader-mark'), { scale: 1.04, duration: 0.12 * k, ease: 'power2.in' })
        .to(el, { '--sink': 1, duration: 0.25 * k, ease: 'power2.out' }, '<')
        .to(el.querySelector('.loader-content'), { opacity: 0, duration: 0.14 * k }, `+=${0.08 * k}`)
        .add(() => {
          el.dataset.split = 'true'
          play('rustle')
        })
        .to(el.querySelector('.loader-panel.is-top'), { yPercent: -100, duration: 0.55 * k, ease: 'steps(9)' })
        .to(el.querySelector('.loader-panel.is-bottom'), { yPercent: 100, duration: 0.55 * k, ease: 'steps(9)' }, '<')
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(failsafe)
      window.clearTimeout(finalFailsafe)
      skipEvents.forEach((e) => window.removeEventListener(e, skip))
      window.removeEventListener('load', onLoad)
    }
  }, [])

  const edge = tornEdge('loader-tear')
  const top = `polygon(0 0, 100% 0, ${edge
    .slice()
    .reverse()
    .map((p) => `${p.x}% ${p.y}%`)
    .join(', ')})`
  const bottom = `polygon(${edge.map((p) => `${p.x}% calc(${p.y}% - 1px)`).join(', ')}, 100% 100%, 0 100%)`

  return (
    <div ref={root} className="loader" aria-hidden>
      <div className="loader-panel is-top">
        <div className="loader-sheet" style={{ clipPath: top }} />
      </div>
      <div className="loader-panel is-bottom">
        <div className="loader-sheet" style={{ clipPath: bottom }} />
      </div>
      <div className="loader-content">
        <p className="meta loader-meta">{misc.loaderMeta}</p>
        <div className="loader-mark">
          <span className="loader-btn soft" />
          <canvas ref={canvasRef} className="loader-canvas" />
        </div>
        <p className="loader-count mono tnum">
          <span ref={counterRef}>000</span>
        </p>
        <p className="meta loader-skip">{misc.skip}</p>
      </div>
    </div>
  )
}

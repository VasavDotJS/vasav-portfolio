'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { collageLayout, type PieceDef } from '@/lib/collage-layout'
import { getSeed, onSeed } from '@/lib/collage-store'
import { hashString, mulberry32, range } from '@/lib/seeded-random'
import { play } from '@/lib/sound'

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** Torn edge as a clip-path polygon. Seeded per piece id so SSR and client agree. */
function tornPath(id: string, edges: PieceDef['torn'] = []) {
  if (!edges.length) return undefined
  const rng = mulberry32(hashString(`torn-${id}`))
  const n = 18
  const jag = () => `${range(rng, 1, 7).toFixed(1)}px`
  const pts: string[] = []
  // top: left → right
  if (edges.includes('t')) for (let i = 0; i <= n; i++) pts.push(`${((i / n) * 100).toFixed(1)}% ${jag()}`)
  else pts.push('0% 0%', '100% 0%')
  // right: top → bottom
  if (edges.includes('r')) for (let i = 1; i < n; i++) pts.push(`calc(100% - ${jag()}) ${((i / n) * 100).toFixed(1)}%`)
  // bottom: right → left
  if (edges.includes('b')) for (let i = n; i >= 0; i--) pts.push(`${((i / n) * 100).toFixed(1)}% calc(100% - ${jag()})`)
  else pts.push('100% 100%', '0% 100%')
  // left: bottom → top
  if (edges.includes('l')) for (let i = n - 1; i > 0; i--) pts.push(`${jag()} ${((i / n) * 100).toFixed(1)}%`)
  return `polygon(${pts.join(', ')})`
}

/** Per-piece pose from a seed: rest rotation, offset, stepped jitter frames, delay. */
function pose(p: PieceDef, seed: number) {
  const rng = mulberry32(seed ^ hashString(p.id))
  const j = () => `${range(rng, -2, 2).toFixed(2)}px`
  const jr = () => `${range(rng, -0.6, 0.6).toFixed(2)}deg`
  const vars: Record<string, string> = {
    '--r': `${(p.rot + range(rng, -2.5, 2.5)).toFixed(2)}deg`,
    '--ox': `${range(rng, -14, 14).toFixed(1)}px`,
    '--oy': `${range(rng, -10, 10).toFixed(1)}px`,
    '--jd': `${(-range(rng, 0, 0.5)).toFixed(3)}s`,
  }
  for (let k = 1; k <= 4; k++) {
    vars[`--j${k}x`] = j()
    vars[`--j${k}y`] = j()
    vars[`--j${k}r`] = jr()
  }
  return vars
}

const SSR_SEED = hashString('vasav p ramesh')

export function Collage() {
  const root = useRef<HTMLDivElement>(null)

  // apply the daily seed (and later reseeds) straight to the DOM; SSR keeps a fixed pose
  useEffect(() => {
    const el = root.current
    if (!el) return
    const apply = (seed: number) => {
      collageLayout.forEach((p) => {
        const node = el.querySelector<HTMLElement>(`[data-piece="${p.id}"]`)
        if (!node) return
        Object.entries(pose(p, seed)).forEach(([k, v]) => node.style.setProperty(k, v))
      })
    }
    apply(getSeed())
    return onSeed((s) => {
      apply(s)
      play('rustle')
      gsap.fromTo(
        el.querySelectorAll('.piece-jit'),
        { y: -24, rotation: () => gsap.utils.random(-8, 8) },
        { y: 0, rotation: 0, duration: 0.5, ease: 'steps(5)', stagger: 0.02 },
      )
    })
  }, [])

  // entry drop (after the loader) + scroll peel. The drop moves .piece-jit (body, shadow
  // copies and back together) via `transform`; the CSS jitter uses translate/rotate, so they compose.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const drop = () => {
      if (reduced) return
      play('rustle', { gain: 0.8 })
      gsap.fromTo(
        el.querySelectorAll('.piece-jit'),
        { y: () => -gsap.utils.random(60, 140), rotation: () => gsap.utils.random(-14, 14) },
        { y: 0, rotation: 0, duration: 0.55, ease: 'steps(6)', stagger: { each: 0.035, from: 'random' } },
      )
    }
    if (document.documentElement.dataset.loaderDone === 'true') drop()
    else window.addEventListener('vpr:reveal', drop, { once: true })

    const ctx = gsap.context(() => {
      if (reduced) return
      const hero = el.closest('section')
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.utils.toArray<HTMLElement>('.piece', el).forEach((piece, i) => {
        const rng = mulberry32(hashString(`peel-${piece.dataset.piece}`))
        const speed = range(rng, 0.4, 1.2)
        tl.to(
          piece,
          {
            yPercent: 0,
            y: -(60 + speed * 240),
            x: range(rng, -140, 140),
            rotation: range(rng, -28, 28),
            rotationY: piece.dataset.flip === 'true' ? 180 : 0,
            ease: 'none',
          },
          i * 0.004,
        )
      })
      tl.fromTo(el, { '--split': 0 }, { '--split': 26, ease: 'none' }, 0)
    }, el)
    return () => {
      window.removeEventListener('vpr:reveal', drop)
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    // fonts change scrap sizes; let ScrollTrigger re-measure
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div ref={root} className="collage" aria-hidden>
      {collageLayout.map((p) => (
        <Piece key={p.id} p={p} />
      ))}
    </div>
  )
}

function Piece({ p }: { p: PieceDef }) {
  const style: Vars = {
    '--l-d': p.d.l,
    '--t-d': p.d.t,
    '--l-m': p.m?.l ?? '0',
    '--t-m': p.m?.t ?? '0',
    '--dp': p.depth,
    zIndex: p.z,
    ...pose(p, SSR_SEED),
  }
  const clip = tornPath(p.id, p.torn)
  return (
    <div
      className={`piece piece--${p.kind}${p.m ? '' : ' is-desktop-only'}`}
      data-piece={p.id}
      data-flip={p.flip ? 'true' : 'false'}
      style={style}
    >
      <div className="piece-par">
        <div className={`piece-jit${clip ? ' is-torn' : ''}`}>
          {clip && (
            <>
              <span className="piece-shadow is-far" style={{ clipPath: clip }} />
              <span className="piece-shadow is-near" style={{ clipPath: clip }} />
            </>
          )}
          <div className={`piece-body tone-${p.tone}`} style={clip ? { clipPath: clip } : undefined}>
            {p.ghost && (
              <>
                <span className="piece-ghost is-yellow">{p.text}</span>
                <span className="piece-ghost is-coral">{p.text}</span>
              </>
            )}
            <span className="piece-text">{p.text}</span>
          </div>
          {p.flip && (
            <div className={`piece-back tone-${p.tone}`}>
              <span className="piece-text">{p.text}</span>
            </div>
          )}
          {p.tape?.map((t, i) => (
            <span
              key={i}
              className="tape"
              style={{ left: t.x, top: t.y, width: t.w ?? 80, rotate: `${t.r}deg` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

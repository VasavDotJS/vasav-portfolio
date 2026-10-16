'use client'

import { useEffect, useRef, useState } from 'react'
import { Keycap } from '@/components/soft/Keycap'
import { stackCopy } from '@/content/copy'
import { stack, stackFlat } from '@/content/stack'
import { gsap } from '@/lib/gsap'
import { play } from '@/lib/sound'

/** A board of neomorphic keycaps. Keys wave down when the board scrolls in; press one to see where it's used. */
export function Keyboard() {
  const [active, setActive] = useState<string | null>(null)
  const board = useRef<HTMLDivElement>(null)
  const key = stackFlat.find((k) => k.id === active)

  useEffect(() => {
    const el = board.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const caps = el.querySelectorAll<HTMLElement>('.keycap')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
    tl.to(caps, {
      keyframes: [
        { '--press': 1, duration: 0.09 },
        { '--press': 0, duration: 0.16 },
      ],
      stagger: { each: 0.035, grid: 'auto', from: 'start' },
      onStart: () => play('key', { gain: 0.5 }),
    })
    caps.forEach((c, i) =>
      tl.add(() => {
        c.dataset.pressed = 'true'
        window.setTimeout(() => (c.dataset.pressed = 'false'), 110)
      }, i * 0.035),
    )
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <div className="keyboard-wrap">
      <output id="stack-lcd" className="lcd soft-well mono" aria-live="polite">
        {key ? (
          <>
            <span className="lcd-key">{key.label}</span>
            <span>
              {stackCopy.usedIn}: {key.usedIn.join(', ')}
            </span>
          </>
        ) : (
          <span className="text-ink-muted">{stackCopy.idle}</span>
        )}
      </output>
      <div ref={board} className="keyboard soft soft-card" role="group" aria-label="languages and tools">
        {stack.map((row, r) => (
          <div key={r} className="keyboard-row">
            {row.map((k) => (
              <Keycap
                key={k.id}
                legend={k.legend ?? k.label}
                name={k.label}
                sub={k.kind === 'language' ? 'lang' : ''}
                w={k.w}
                active={active === k.id}
                aria-controls="stack-lcd"
                onClick={() => {
                  play('key')
                  setActive((a) => (a === k.id ? null : k.id))
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

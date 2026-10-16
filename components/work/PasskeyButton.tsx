'use client'

import { useEffect, useRef, useState } from 'react'
import { work } from '@/content/copy'
import { play } from '@/lib/sound'

const HOLD_MS = 900

/** Press and hold: the pad sinks and fills. Nothing is sent anywhere. */
export function PasskeyButton() {
  const ref = useRef<HTMLButtonElement>(null)
  const [done, setDone] = useState(false)
  const raf = useRef(0)
  const fill = useRef(0)
  const holding = useRef(false)

  const loop = (last: number) => (now: number) => {
    const dt = now - last
    fill.current = Math.max(0, Math.min(1, fill.current + (holding.current ? dt / HOLD_MS : -dt / 400)))
    ref.current?.style.setProperty('--fill', fill.current.toFixed(3))
    if (fill.current >= 1 && holding.current) {
      holding.current = false
      setDone(true)
      play('key', { rate: 0.8 })
      return
    }
    if (holding.current || fill.current > 0) raf.current = requestAnimationFrame(loop(now))
  }

  const start = () => {
    if (done) return
    holding.current = true
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(loop(performance.now()))
  }
  const stop = () => {
    holding.current = false
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div className="passkey">
      <button
        ref={ref}
        type="button"
        className="passkey-btn soft is-hoverable"
        data-pressed={done ? 'true' : undefined}
        data-done={done ? 'true' : 'false'}
        data-cursor={work.xprso.hold}
        aria-label={done ? work.xprso.passkeys.done : 'press and hold to sign in (demo)'}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault()
            start()
          }
        }}
        onKeyUp={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        <svg viewBox="0 0 120 120" className="passkey-print" aria-hidden>
          {[14, 22, 30, 38, 46].map((r, i) => (
            <path
              key={r}
              d={`M ${60 - r} ${62 + i * 2} A ${r} ${r + 6} 0 0 1 ${60 + r} ${62 - i}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={i % 2 ? '18 7' : '40 6'}
            />
          ))}
          <path d="M60 58 v26 M52 66 q0 22 10 30 M68 64 q2 18 -2 28" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </svg>
        <span className="passkey-fill" aria-hidden />
      </button>
      <p className="mono passkey-status" role="status" aria-live="polite">
        {done ? work.xprso.passkeys.done : ''}
      </p>
    </div>
  )
}

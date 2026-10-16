'use client'

import { useEffect, useRef } from 'react'

/**
 * Ink dot + a ring that lags behind and turns into a neomorphic pill with a mono label over
 * anything carrying data-cursor. Pointer-fine devices only; text inputs keep the system caret.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    const el = root.current!
    const html = document.documentElement
    html.classList.add('has-cursor')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0
    let current: string | null = null

    const tick = () => {
      const k = reduced ? 1 : 0.18
      ringPos.x += (pos.x - ringPos.x) * k
      ringPos.y += (pos.y - ringPos.y) * k
      ring.current!.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      raf = Math.abs(pos.x - ringPos.x) + Math.abs(pos.y - ringPos.y) > 0.3 ? requestAnimationFrame(tick) : 0
    }

    const setLabel = (text: string | null) => {
      if (text === current) return
      current = text
      if (text) {
        label.current!.textContent = text
        el.dataset.label = text
        el.style.setProperty('--cw', `${label.current!.scrollWidth + 2}px`)
      } else {
        delete el.dataset.label
        el.style.removeProperty('--cw')
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pos.x = e.clientX
      pos.y = e.clientY
      dot.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      const t = e.target as HTMLElement
      const typing = t.closest?.('input, textarea, [contenteditable]')
      if (typing) el.dataset.hidden = ''
      else delete el.dataset.hidden
      setLabel(typing ? null : (t.closest?.('[data-cursor]')?.getAttribute('data-cursor') ?? null))
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onDown = () => (el.dataset.down = '')
    const onUp = () => delete el.dataset.down
    const onLeave = () => (el.dataset.hidden = '')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      html.classList.remove('has-cursor')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={root} className="cursor" aria-hidden>
      <div ref={ring} className="cursor-ring-pos" style={{ position: 'absolute' }}>
        <div className="cursor-ring">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot-pos" style={{ position: 'absolute' }}>
        <div className="cursor-dot" />
      </div>
    </div>
  )
}

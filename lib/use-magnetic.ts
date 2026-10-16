'use client'

import { useEffect, useRef } from 'react'

/** Pulls an element toward the pointer (max `strength` px). Pointer-fine devices only. */
export function useMagnetic<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    const write = () => {
      raf = 0
      el.style.setProperty('--mx', `${tx.toFixed(2)}px`)
      el.style.setProperty('--my', `${ty.toFixed(2)}px`)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(write)
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      tx = Math.max(-1, Math.min(1, dx)) * strength
      ty = Math.max(-1, Math.min(1, dy)) * strength
      schedule()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      schedule()
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])
  return ref
}

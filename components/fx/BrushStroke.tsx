'use client'

import { useEffect, useId, useRef } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * The one hand-made element: a dry-brush stroke. A plain SVG path, roughened with
 * turbulence displacement and eaten by a noise mask so it reads as bristles on paper.
 * Draws on in steps when it scrolls into view.
 */
export function BrushStroke({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const path = useRef<SVGPathElement>(null)
  useEffect(() => {
    const p = path.current
    if (!p || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const len = p.getTotalLength()
    const tw = gsap.fromTo(
      p,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.7, ease: 'steps(8)', scrollTrigger: { trigger: p, start: 'top 85%', once: true } },
    )
    return () => {
      tw.scrollTrigger?.kill()
      tw.kill()
    }
  }, [])
  return (
    <svg className={`brush ${className}`} viewBox="0 0 600 70" preserveAspectRatio="none" aria-hidden focusable="false">
      <defs>
        <filter id={`rough-${id}`} x="-5%" y="-40%" width="110%" height="180%">
          {/* wobble the edges */}
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.09" numOctaves="2" seed="7" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="12" xChannelSelector="R" yChannelSelector="G" result="d" />
          {/* bristle streaks run along the stroke: slow noise in x, fast in y */}
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.5" numOctaves="3" seed="3" result="bristle" />
          <feColorMatrix in="bristle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.5" result="mask" />
          <feComposite in="d" in2="mask" operator="in" />
        </filter>
      </defs>
      <path
        ref={path}
        d="M10 46 C 120 34, 230 50, 330 40 S 500 30, 590 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="34"
        strokeLinecap="round"
        filter={`url(#rough-${id})`}
      />
    </svg>
  )
}

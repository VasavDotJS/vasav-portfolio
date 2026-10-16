'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, loadSplitText, ScrollTrigger } from '@/lib/gsap'

/** Line-by-line mask reveal (SplitText), re-split on resize/font load. */
export function RevealLines({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tween: gsap.core.Tween | null = null
    let split: { revert: () => void } | null = null
    let cancelled = false
    loadSplitText().then((SplitText) => {
      if (cancelled) return
      split = SplitText.create(el.querySelectorAll('p'), {
        type: 'lines',
        mask: 'lines',
        // the lines hold the real text; "auto" would put aria-label on <p>, which isn't allowed
        aria: 'none',
        autoSplit: true,
        onSplit(self) {
          tween?.scrollTrigger?.kill()
          tween?.kill()
          tween = gsap.from(self.lines, {
            yPercent: 105,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          })
          return tween
        },
      })
    })
    return () => {
      cancelled = true
      tween?.scrollTrigger?.kill()
      tween?.kill()
      split?.revert()
      ScrollTrigger.refresh()
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

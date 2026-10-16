'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react'
import { initLight } from '@/lib/light-store'
import { initSectionObserver } from '@/lib/section-store'
import { initThemeSync } from '@/lib/theme-store'
import { scrollToHash, setLenis } from '@/lib/scroll'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const cleanups: (() => void)[] = [initLight(), initThemeSync(), initSectionObserver()]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    // scroll velocity → misregistration offset (px)
    const mis = { v: 3 }
    const writeMis = () => root.style.setProperty('--mis', mis.v.toFixed(2))
    const toMis = gsap.quickTo(mis, 'v', { duration: 0.5, ease: 'power3.out', onUpdate: writeMis })

    let settle = 0
    if (!reduced) {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: false })
      setLenis(lenis)
      lenis.on('scroll', (l: Lenis) => {
        ScrollTrigger.update()
        toMis(3 + Math.min(Math.abs(l.velocity) * 0.35, 6))
        window.clearTimeout(settle)
        settle = window.setTimeout(() => toMis(3), 120)
      })
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanups.push(() => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        setLenis(null)
      })
    }

    // in-page anchors go through Lenis; everything else stays native
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const hash = a.getAttribute('href')!
      if (hash === '#' || hash.length < 2) return
      e.preventDefault()
      scrollToHash(hash)
    }
    document.addEventListener('click', onClick)
    cleanups.push(() => document.removeEventListener('click', onClick))

    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}

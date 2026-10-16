'use client'

// Single entry for GSAP. Plugins are registered at module scope so they exist before
// any component effect builds a timeline (child effects run before parent effects).
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

/** SplitText is only needed below the fold, so it loads on demand. */
export async function loadSplitText() {
  const { SplitText } = await import('gsap/SplitText')
  gsap.registerPlugin(SplitText)
  return SplitText
}

export { gsap, ScrollTrigger }

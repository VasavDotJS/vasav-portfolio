'use client'

// Single entry for GSAP. Plugins are registered at module scope so they exist before
// any component effect builds a timeline (child effects run before parent effects).
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

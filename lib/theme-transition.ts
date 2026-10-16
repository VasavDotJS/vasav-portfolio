import { applyTheme, type Theme } from './theme-store'
import { play } from './sound'

/**
 * The new theme prints over the old one: a circle grows from the toggle and its edge is a
 * band of halftone dots (CSS masks on ::view-transition-new(root), see styles/theme.css).
 * Fallback without View Transitions: a short colour crossfade. Reduced motion: instant.
 */
export function switchTheme(next: Theme, origin?: HTMLElement | null) {
  const root = document.documentElement
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  play('click', { rate: next === 'dark' ? 0.8 : 1.2 })
  if (reduced) return applyTheme(next)

  const r = origin?.getBoundingClientRect()
  const x = r ? r.left + r.width / 2 : innerWidth / 2
  const y = r ? r.top + r.height / 2 : 0
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 80
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-r', `${radius}px`)

  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  if (typeof doc.startViewTransition === 'function') {
    root.classList.add('vt-theme')
    const t = doc.startViewTransition(() => applyTheme(next))
    t.finished.finally(() => root.classList.remove('vt-theme'))
    return
  }

  root.classList.add('theme-fade')
  applyTheme(next)
  window.setTimeout(() => root.classList.remove('theme-fade'), 450)
}

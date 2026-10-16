import type Lenis from 'lenis'

let lenis: Lenis | null = null
export const setLenis = (l: Lenis | null) => {
  lenis = l
}
export const getLenis = () => lenis

/** Smooth-scroll to an anchor when Lenis runs; native otherwise. Updates the hash. */
export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0 })
  else el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  history.replaceState(null, '', hash)
  // move focus for keyboard and screen-reader users without a second jump
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()

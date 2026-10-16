import { applyTheme, type Theme } from './theme-store'

/** Phase 1: instant swap. The printed circular reveal from `origin` lands in phase 7. */
export function switchTheme(next: Theme, origin?: HTMLElement | null) {
  void origin
  applyTheme(next)
}

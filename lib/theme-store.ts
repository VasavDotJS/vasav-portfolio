import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_COLORS: Record<Theme, string> = { light: '#E8E5DF', dark: '#000000' }
const STORAGE_KEY = 'theme'

const listeners = new Set<() => void>()

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function subscribeTheme(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** Swap tokens, theme-color and notify subscribers (3D, grain) in the same frame. */
export function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }
  listeners.forEach((fn) => fn())
}

export function hasStoredTheme() {
  try {
    const t = localStorage.getItem(STORAGE_KEY)
    return t === 'light' || t === 'dark'
  } catch {
    return false
  }
}

/** Follow the OS when the visitor hasn't picked a theme themselves. */
export function initThemeSync() {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = () => {
    if (!hasStoredTheme()) applyTheme(mq.matches ? 'dark' : 'light', false)
  }
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme, () => 'light')
}

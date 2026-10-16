'use client'

import { useEffect } from 'react'
import { misc } from '@/content/copy'
import { reseed } from '@/lib/collage-store'
import { toast } from '@/lib/toast'

/** Two easter eggs and the tab title. Typing "random" reshuffles the collage; ":wq" is a joke. */
export function Extras() {
  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-12)
      if (buffer.endsWith('random')) {
        buffer = ''
        reseed()
        toast(misc.reseedToast)
      } else if (buffer.endsWith(':wq')) {
        buffer = ''
        toast(misc.vimToast)
      }
    }
    const title = document.title
    const onVis = () => {
      document.title = document.hidden ? misc.tabAway : title
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onVis)
      document.title = title
    }
  }, [])
  return null
}

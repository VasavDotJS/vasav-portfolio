import { useSyncExternalStore } from 'react'
import type { SectionId } from '@/content/copy'

let current: SectionId = 'hero'
const listeners = new Set<() => void>()

export const getSection = () => current
export function setSection(id: SectionId) {
  if (id === current) return
  current = id
  listeners.forEach((fn) => fn())
}
function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
export const useSection = () => useSyncExternalStore(subscribe, getSection, () => 'hero' as SectionId)

/** Marks the section crossing the middle of the viewport as current. */
export function initSectionObserver() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setSection(e.target.getAttribute('data-section') as SectionId)
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  )
  els.forEach((el) => io.observe(el))
  return () => io.disconnect()
}

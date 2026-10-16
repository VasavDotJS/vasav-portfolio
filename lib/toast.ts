import { useSyncExternalStore } from 'react'

type Toast = { id: number; text: string }
let toasts: Toast[] = []
let seq = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((fn) => fn())

export function toast(text: string, ms = 1800) {
  const t = { id: ++seq, text }
  toasts = [...toasts.slice(-2), t]
  emit()
  window.setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id)
    emit()
  }, ms)
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
const empty: Toast[] = []
export const useToasts = () => useSyncExternalStore(subscribe, () => toasts, () => empty)

'use client'

import { useToasts } from '@/lib/toast'

/** Tiny label-maker toasts, announced politely. */
export function Toaster() {
  const toasts = useToasts()
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <p key={t.id} className="toast meta">
          {t.text}
        </p>
      ))}
    </div>
  )
}

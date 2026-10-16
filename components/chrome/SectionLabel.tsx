'use client'

import { sections } from '@/content/copy'
import { useSection } from '@/lib/section-store'

export function SectionLabel() {
  const id = useSection()
  return (
    <span className="meta" aria-live="off">
      {sections[id]}
    </span>
  )
}

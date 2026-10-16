import type { Metadata } from 'next'
import { LabPanel } from './LabPanel'

export const metadata: Metadata = {
  title: 'lab',
  robots: { index: false, follow: false },
}

export default function Lab() {
  return (
    <main id="main" className="pt-[var(--bar-h)]">
      <div className="grid lg:grid-cols-2">
        <LabPanel theme="light" />
        <LabPanel theme="dark" />
      </div>
    </main>
  )
}

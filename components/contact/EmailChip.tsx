'use client'

import { IconMail } from '@/components/icons'
import { contact, misc } from '@/content/copy'
import { profile } from '@/content/profile'
import { play } from '@/lib/sound'
import { toast } from '@/lib/toast'
import { useMagnetic } from '@/lib/use-magnetic'

export function EmailChip() {
  const ref = useMagnetic<HTMLButtonElement>(6)
  return (
    <div className="grid gap-3">
      <button
        ref={ref}
        type="button"
        className="email-chip soft is-hoverable is-pressable magnetic"
        data-cursor="copy"
        aria-label={`${contact.copy}: ${profile.email}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(profile.email)
            toast(misc.copiedToast)
            play('click')
          } catch {
            window.location.href = `mailto:${profile.email}`
          }
        }}
      >
        <span className="meta text-ink-muted">{contact.copy}</span>
        <span className="email-chip-addr mono">{profile.email}</span>
      </button>
      <a href={`mailto:${profile.email}`} className="meta inline-flex items-center gap-2" data-cursor="mail">
        <IconMail width={14} height={14} /> {contact.mailto}
      </a>
    </div>
  )
}

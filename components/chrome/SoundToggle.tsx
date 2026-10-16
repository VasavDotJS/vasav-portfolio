'use client'

import { IconSpeaker } from '@/components/icons'
import { misc } from '@/content/copy'
import { play, setSound, useSoundOn } from '@/lib/sound'

export function SoundToggle() {
  const on = useSoundOn()
  return (
    <button
      type="button"
      className="soft soft-btn is-icon is-hoverable is-pressable"
      style={{ width: 32, minHeight: 32, height: 32 }}
      aria-pressed={on}
      aria-label={on ? misc.soundOff : misc.soundOn}
      data-cursor={on ? 'mute' : 'sound'}
      onClick={() => {
        setSound(!on)
        if (!on) play('click')
      }}
    >
      <IconSpeaker on={on} width={16} height={16} />
    </button>
  )
}

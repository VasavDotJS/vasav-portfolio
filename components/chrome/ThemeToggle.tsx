'use client'

import { HalftoneMoon, HalftoneSun } from '@/components/icons'
import { SoftToggle } from '@/components/soft/SoftToggle'
import { switchTheme } from '@/lib/theme-transition'
import { useTheme } from '@/lib/theme-store'

export function ThemeToggle() {
  const theme = useTheme()
  const dark = theme === 'dark'
  return (
    <SoftToggle
      checked={dark}
      label={dark ? 'switch to paper theme' : 'switch to oled theme'}
      cursor={dark ? 'paper' : 'oled'}
      onChange={(next, el) => switchTheme(next ? 'dark' : 'light', el)}
      knob={dark ? <HalftoneMoon width={14} height={14} /> : <HalftoneSun width={14} height={14} />}
    />
  )
}

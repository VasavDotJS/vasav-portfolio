'use client'

import { m } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  checked: boolean
  onChange: (next: boolean, el: HTMLButtonElement) => void
  label: string
  knob?: ReactNode
  className?: string
  cursor?: string
}

/** Pill switch with a weighted knob: spring with overshoot, squashes on press. */
export function SoftToggle({ checked, onChange, label, knob, className = '', cursor }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-cursor={cursor}
      onClick={(e) => onChange(!checked, e.currentTarget)}
      className={`soft-toggle soft-well ${className}`}
    >
      <m.span
        className="soft-toggle__knob soft"
        initial={false}
        animate={{ x: checked ? 26 : 0 }}
        whileTap={{ scaleX: 1.18, scaleY: 0.86 }}
        transition={{ type: 'spring', stiffness: 520, damping: 22, mass: 1.1 }}
      >
        {knob}
      </m.span>
    </button>
  )
}

'use client'

import type { ReactNode } from 'react'

type Props = {
  checked: boolean
  onChange: (next: boolean, el: HTMLButtonElement) => void
  label: string
  knob?: ReactNode
  className?: string
  cursor?: string
}

/** Pill switch with a weighted knob: spring easing with overshoot, squashes while pressed. */
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
      <span className="soft-toggle__knob soft">{knob}</span>
    </button>
  )
}

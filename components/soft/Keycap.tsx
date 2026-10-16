'use client'

import type { ButtonHTMLAttributes } from 'react'

type Props = {
  legend: string
  /** full name for screen readers when the legend is abbreviated (TS -> TypeScript) */
  name?: string
  sub?: string
  active?: boolean
  pressed?: boolean
  w?: number
} & ButtonHTMLAttributes<HTMLButtonElement>

/** A neomorphic keycap: concave dish, legend top-left, LED dot bottom-right. */
export function Keycap({ legend, name, sub, active, pressed, w = 1, className = '', style, ...rest }: Props) {
  return (
    <button
      type="button"
      data-active={active ? 'true' : 'false'}
      data-pressed={pressed ? 'true' : 'false'}
      aria-pressed={active}
      className={`keycap soft is-hoverable is-pressable ${className}`}
      style={{ flexGrow: w, flexBasis: `calc(var(--key) * ${w})`, ...style }}
      {...rest}
    >
      <span className="keycap__legend">
        {legend}
        {name && name !== legend && <span className="sr-only"> ({name})</span>}
      </span>
      <span className="flex items-end justify-between gap-2" aria-hidden>
        <span className="meta keycap__sub">{sub}</span>
        <span className="keycap__dot" aria-hidden />
      </span>
    </button>
  )
}

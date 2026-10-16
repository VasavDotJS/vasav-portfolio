'use client'

import { useState, type KeyboardEvent } from 'react'
import { work } from '@/content/copy'
import { formatINR, gstIntra, rupeesToPaise } from '@/lib/xprso-math'
import { play } from '@/lib/sound'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'] as const
const k = work.xprso.keypad

/** A neomorphic PIN-pad style keypad. Type a price, see what XPRSO would store. */
export function PaiseKeypad() {
  const [value, setValue] = useState('249')

  const press = (key: string) => {
    play('key', { rate: 1.1 })
    setValue((v) => {
      if (key === 'del') return v.length > 1 ? v.slice(0, -1) : '0'
      if (key === 'clear') return '0'
      if (key === '.') return v.includes('.') ? v : `${v}.`
      const [r = '', p] = v.split('.')
      if (p !== undefined && p.length >= 2) return v
      if (p === undefined && r.length >= 6) return v
      return v === '0' ? key : v + key
    })
  }

  const onKey = (e: KeyboardEvent) => {
    if (/^[0-9.]$/.test(e.key)) press(e.key)
    else if (e.key === 'Backspace') press('del')
    else if (e.key === 'Escape') press('clear')
    else return
    e.preventDefault()
  }

  const paise = rupeesToPaise(value)
  const { cgst, sgst, total } = gstIntra(paise)
  const [r, p] = value.split('.')

  return (
    <div className="keypad" onKeyDown={onKey}>
      <output className="keypad-display soft-well" aria-live="polite" aria-label={`${formatINR(paise)}, stored as ${paise} paise`}>
        <span className="keypad-amount tnum">
          ₹{r}
          <span className="text-ink-muted">.{(p ?? '').padEnd(2, '0')}</span>
        </span>
        <dl className="keypad-rows mono tnum">
          <div>
            <dt>{k.stored}</dt>
            <dd>
              <b>{paise}</b> {k.paise}
            </dd>
          </div>
          <div>
            <dt>{k.cgst}</dt>
            <dd>{cgst}</dd>
          </div>
          <div>
            <dt>{k.sgst}</dt>
            <dd>{sgst}</dd>
          </div>
          <div className="is-total">
            <dt>{k.total}</dt>
            <dd>
              {total} <span className="text-ink-muted">({formatINR(total)})</span>
            </dd>
          </div>
        </dl>
      </output>
      <div className="keypad-grid" role="group" aria-label="keypad">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className="keypad-key soft is-hoverable is-pressable"
            aria-label={key === 'del' ? k.del : key}
            onClick={() => press(key)}
          >
            {key === 'del' ? '⌫' : key}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536e6],
  ['month', 2592e6],
  ['week', 6048e5],
  ['day', 864e5],
  ['hour', 36e5],
  ['minute', 6e4],
]

function relative(iso: string, now: number) {
  const diff = new Date(iso).getTime() - now
  for (const [unit, ms] of UNITS) if (Math.abs(diff) >= ms || unit === 'minute') return rtf.format(Math.round(diff / ms), unit)
  return 'just now'
}

/** Absolute date on the server (ISR pages go stale), relative once hydrated. */
export function RelTime({ iso }: { iso: string }) {
  const [text, setText] = useState(() =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).toLowerCase(),
  )
  useEffect(() => {
    const update = () => setText(relative(iso, Date.now()))
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [iso])
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  )
}

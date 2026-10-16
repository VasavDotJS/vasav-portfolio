'use client'

import { useEffect, useState } from 'react'
import { profile } from '@/content/profile'

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: profile.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Live IST clock with a blinking colon. Renders dashes on the server. */
export function Clock() {
  const [time, setTime] = useState<[string, string] | null>(null)
  useEffect(() => {
    const update = () => {
      const [h = '--', mm = '--'] = fmt.format(new Date()).split(':')
      setTime([h, mm])
    }
    update()
    const id = window.setInterval(update, 10_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="meta tnum whitespace-nowrap" aria-label={time ? `time in ${profile.city}: ${time[0]}:${time[1]}` : undefined}>
      {profile.city.toUpperCase()}{' '}
      <span aria-hidden>{time?.[0] ?? '--'}</span>
      <span aria-hidden className="clock-colon">:</span>
      <span aria-hidden>{time?.[1] ?? '--'}</span>
    </span>
  )
}

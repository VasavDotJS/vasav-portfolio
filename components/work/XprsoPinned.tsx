'use client'

import { useEffect, useRef } from 'react'
import { IconArrowUpRight } from '@/components/icons'
import { SoftLink } from '@/components/soft/SoftButton'
import { work } from '@/content/copy'
import { featured } from '@/content/projects'
import { gsap } from '@/lib/gsap'
import { PaiseKeypad } from './PaiseKeypad'
import { PasskeyButton } from './PasskeyButton'
import { SettledReceipt } from './SettledReceipt'

const x = featured.find((p) => p.id === 'xprso')!
const c = work.xprso

/** XPRSO: pinned section, vertical scroll drives a horizontal track of panels (desktop). */
export function XprsoPinned() {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = section.current
    const tr = track.current
    if (!el || !tr) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => tr.scrollWidth - window.innerWidth
      gsap.to(tr, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={section} className="xprso" aria-label={`${x.index} ${x.name}`} role="region">
      <div ref={track} className="xprso-track">
        {/* 1 · title card */}
        <article className="xprso-panel is-title">
          <p className="meta text-ink-muted">
            {x.index} · {x.language.toLowerCase()} · {x.dateLabel} · {x.repo}
          </p>
          <h3 className="xprso-name misreg">
            <span className="misreg-ghost is-yellow" data-text={x.name} aria-hidden />
            <span className="misreg-ghost is-coral" data-text={x.name} aria-hidden />
            {x.name}
          </h3>
          <p className="xprso-oneliner">{x.oneLiner}</p>
          <p className="xprso-body">{x.body}</p>
          <ul className="chips" aria-label="stack">
            {x.stack.map((s) => (
              <li key={s} className="chip soft">
                {s}
              </li>
            ))}
          </ul>
          {x.note && <p className="xprso-note mono">{x.note}</p>}
        </article>

        {/* 2 · money in paise */}
        <article className="xprso-panel is-demo">
          <div className="xprso-copy">
            <p className="meta text-ink-muted">01.1</p>
            <h4 className="xprso-h">{c.paise.title}</h4>
            <p>{c.paise.text}</p>
            <p className="meta text-ink-muted demo-label">{c.paise.caption}</p>
          </div>
          <PaiseKeypad />
        </article>

        {/* 3 · settled means settled */}
        <article className="xprso-panel is-demo">
          <div className="xprso-copy">
            <p className="meta text-ink-muted">01.2</p>
            <h4 className="xprso-h">{c.settled.title}</h4>
            <p>{c.settled.text}</p>
            <p className="meta text-ink-muted demo-label">
              {c.settled.caption} {c.settled.demoLabel}
            </p>
          </div>
          <SettledReceipt />
        </article>

        {/* 4 · passkeys */}
        <article className="xprso-panel is-demo">
          <div className="xprso-copy">
            <p className="meta text-ink-muted">01.3</p>
            <h4 className="xprso-h">{c.passkeys.title}</h4>
            <p>{c.passkeys.text}</p>
            <p className="meta text-ink-muted demo-label">{c.passkeys.caption}</p>
          </div>
          <PasskeyButton />
        </article>

        {/* 5 · out */}
        <article className="xprso-panel is-out">
          <ul className="xprso-facts mono">
            {x.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <SoftLink href={x.url} className="xprso-repo" cursor="open">
            {c.outro} <IconArrowUpRight width={18} height={18} />
          </SoftLink>
        </article>
      </div>
    </div>
  )
}

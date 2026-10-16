'use client'

import { useId, useMemo, useState } from 'react'
import { IconArrowUpRight } from '@/components/icons'
import { SoftLink } from '@/components/soft/SoftButton'
import { work } from '@/content/copy'
import type { FeaturedProject } from '@/content/projects'
import { asciiChart, randomWalk } from '@/lib/ascii-chart'
import { getSeed } from '@/lib/collage-store'
import { MOOD_GENRES, mood, polarity, spotifySearch } from '@/lib/mood-toy'

const d = work.desktop

export function WindowContent({ p }: { p: FeaturedProject }) {
  return (
    <div className="win-content">
      <p className="win-oneliner">{p.oneLiner}</p>
      <p className="win-body">{p.body}</p>
      {p.id === 'fintarot' && <FinChart />}
      {p.id === 'moodtunes' && <MoodToy />}
      {p.id === 'designdump' && <DumpTree />}
      {p.id === 'mediplan' && <MediFlow />}
      <ul className="win-bullets">
        {p.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {p.note && <p className="mono win-note">{p.note}</p>}
      <ul className="chips" aria-label="stack">
        {p.stack.map((s) => (
          <li key={s} className="chip soft">
            {s}
          </li>
        ))}
      </ul>
      <SoftLink href={p.url} cursor="open" className="justify-self-start">
        {p.repo} <IconArrowUpRight width={16} height={16} />
      </SoftLink>
    </div>
  )
}

function FinChart() {
  const chart = useMemo(() => asciiChart(randomWalk(getSeed()), 12, 56), [])
  return (
    <figure className="win-demo">
      <pre className="ascii mono" aria-label="ascii line chart of a random walk">{chart}</pre>
      <figcaption className="meta text-ink-muted">{d.chartLabel}</figcaption>
    </figure>
  )
}

function MoodToy() {
  const id = useId()
  const [text, setText] = useState('')
  const p = polarity(text)
  const m = mood(p)
  return (
    <figure className="win-demo">
      <label className="sr-only" htmlFor={id}>
        {d.moodPlaceholder}
      </label>
      <input
        id={id}
        className="soft-input soft-well"
        placeholder={d.moodPlaceholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={140}
        autoComplete="off"
      />
      <p className="mono mood-readout" aria-live="polite">
        polarity {p >= 0 ? '+' : ''}
        {p.toFixed(2)} → {m.toLowerCase()}
      </p>
      <ul className="chips">
        {MOOD_GENRES[m].map((g) => (
          <li key={g}>
            <a className="chip soft is-hoverable" href={spotifySearch(g)} target="_blank" rel="noreferrer" data-cursor="open">
              {g}
            </a>
          </li>
        ))}
      </ul>
      <figcaption className="meta text-ink-muted">{d.moodLabel}</figcaption>
    </figure>
  )
}

function DumpTree() {
  return (
    <pre className="ascii mono win-demo" aria-label="files designdump writes">
      {`prompts/example-com/
├── style-guide.md
├── ai-design-system.prompt.md
├── design-tokens.json
└── screenshots/
    ├── desktop.png    1440×900
    ├── tablet.png     768×1024
    ├── mobile.png     375×667
    └── fullpage.png`}
    </pre>
  )
}

function MediFlow() {
  return (
    <div className="win-demo medi-flow mono" aria-label="appointment status flow">
      <span className="flow-role">patient</span>
      <span aria-hidden>→</span>
      <span className="flow-chip">pending</span>
      <span aria-hidden>→</span>
      <span className="flow-role">doctor / admin</span>
      <span aria-hidden>→</span>
      <span className="flow-stack">
        <span className="flow-chip is-ok">confirmed</span>
        <span className="flow-chip">cancelled</span>
        <span className="flow-chip is-ok">completed</span>
      </span>
    </div>
  )
}

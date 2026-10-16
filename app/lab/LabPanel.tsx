'use client'

import { useState } from 'react'
import { IconArrowUpRight, IconGitHub, IconMail } from '@/components/icons'
import { Keycap } from '@/components/soft/Keycap'
import { SoftButton, SoftLink } from '@/components/soft/SoftButton'
import { SoftCard } from '@/components/soft/SoftCard'
import { SoftInput, SoftTextarea } from '@/components/soft/SoftInput'
import { SoftToggle } from '@/components/soft/SoftToggle'

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-4 border-t border-hairline py-6">
    <p className="meta text-ink-muted">{label}</p>
    <div className="flex flex-wrap items-center gap-5">{children}</div>
  </div>
)

export function LabPanel({ theme }: { theme: 'light' | 'dark' }) {
  const [on, setOn] = useState(theme === 'dark')
  const [active, setActive] = useState('python')
  return (
    <section data-theme={theme} className="paper-grid min-h-svh bg-bg px-6 pb-40 pt-10 text-ink md:px-10">
      <p className="meta mb-6">lab / {theme}</p>

      <Row label="soft button · rest / hover / pressed / focus / disabled">
        <SoftButton>open</SoftButton>
        <SoftButton className="force-hover">hover</SoftButton>
        <SoftButton data-pressed="true">pressed</SoftButton>
        <SoftButton className="force-focus">focus</SoftButton>
        <SoftButton disabled>disabled</SoftButton>
      </Row>

      <Row label="ink button · icon buttons · link">
        <SoftButton variant="ink">send</SoftButton>
        <SoftButton icon aria-label="github">
          <IconGitHub />
        </SoftButton>
        <SoftButton icon aria-label="mail" data-pressed="true">
          <IconMail />
        </SoftButton>
        <SoftLink href="https://github.com/VasavDotJS">
          view repo <IconArrowUpRight width={16} height={16} />
        </SoftLink>
      </Row>

      <Row label="toggle · off / on">
        <SoftToggle checked={false} onChange={() => {}} label="off" />
        <SoftToggle checked={on} onChange={setOn} label="interactive" />
      </Row>

      <Row label="input · empty / filled / error">
        <div className="grid w-full gap-5 sm:grid-cols-2">
          <SoftInput label="name" placeholder="your name" />
          <SoftInput label="email" defaultValue="someone@example.com" />
          <SoftInput label="email" defaultValue="nope@" error="that email doesn't look right." />
          <SoftInput label="disabled" disabled placeholder="disabled" />
        </div>
        <div className="w-full">
          <SoftTextarea label="message" rows={3} placeholder="say something." />
        </div>
      </Row>

      <Row label="card">
        <SoftCard className="w-full p-6">
          <p className="meta text-ink-muted">01 · xprso</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">a café point-of-sale built for one hand and a morning rush.</p>
        </SoftCard>
      </Row>

      <Row label="keycaps · rest / active / pressed">
        <div className="flex w-full flex-wrap gap-3 [--key:76px]">
          {['C', 'Python', 'TS', 'Lua'].map((k) => (
            <Keycap
              key={k}
              legend={k}
              sub={k === 'Python' ? '5 repos' : ''}
              active={active === k.toLowerCase()}
              onClick={() => setActive(k.toLowerCase())}
              w={k === 'Python' ? 1.5 : 1}
            />
          ))}
          <Keycap legend="pressed" pressed w={1.25} />
        </div>
      </Row>

      <Row label="inset well">
        <div className="soft-well w-full rounded-[18px] p-5 font-mono text-3xl tnum">24900</div>
      </Row>
    </section>
  )
}

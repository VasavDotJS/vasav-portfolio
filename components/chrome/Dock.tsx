'use client'

import { useCallback, useEffect, useRef, type ComponentType, type SVGProps } from 'react'
import { usePathname } from 'next/navigation'
import {
  IconContact,
  IconGitHub,
  IconIndex,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconStack,
  IconWork,
} from '@/components/icons'
import type { SectionId } from '@/content/copy'
import { profile } from '@/content/profile'
import { useSection } from '@/lib/section-store'
import { play } from '@/lib/sound'

type Item = {
  label: string
  href: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  section?: SectionId
  external?: boolean
}

const nav: Item[] = [
  { label: 'index', href: '#index', Icon: IconIndex, section: 'index' },
  { label: 'work', href: '#work', Icon: IconWork, section: 'work' },
  { label: 'stack', href: '#stack', Icon: IconStack, section: 'stack' },
  { label: 'contact', href: '#contact', Icon: IconContact, section: 'contact' },
]
const out: Item[] = [
  { label: 'github', href: profile.links.github.href, Icon: IconGitHub, external: true },
  { label: 'linkedin', href: profile.links.linkedin.href, Icon: IconLinkedIn, external: true },
  { label: 'instagram', href: profile.links.instagram.href, Icon: IconInstagram, external: true },
  { label: 'mail', href: `mailto:${profile.email}`, Icon: IconMail },
]

const MAX = 1.5
const REACH = 110

/** macOS-style dock: neomorphic icons that magnify with pointer distance (max 1.5×). */
export function Dock() {
  const current = useSection()
  // off the home page (404, /lab) section anchors need the path in front
  const prefix = usePathname() === '/' ? '' : '/'
  const listRef = useRef<HTMLUListElement>(null)
  const raf = useRef(0)
  const pointerX = useRef<number | null>(null)

  const apply = useCallback(() => {
    raf.current = 0
    const list = listRef.current
    if (!list) return
    const x = pointerX.current
    list.querySelectorAll<HTMLElement>('[data-dock-item]').forEach((el) => {
      let s = 1
      if (x != null) {
        const r = el.getBoundingClientRect()
        const d = Math.abs(x - (r.left + r.width / 2))
        s = 1 + (MAX - 1) * Math.max(0, 1 - d / REACH) ** 1.6
      }
      el.style.setProperty('--s', s.toFixed(3))
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(apply)
  }

  const renderItem = (it: Item) => {
    const active = it.section && it.section === current
    return (
      <li key={it.label} data-dock-item className="dock-item">
        <a
          href={it.section ? `${prefix}${it.href}` : it.href}
          aria-label={it.label}
          aria-current={active ? 'location' : undefined}
          className="dock-btn soft is-hoverable is-pressable"
          data-cursor={it.label}
          onClick={() => play('click', { rate: 1.2 })}
          {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          <it.Icon width={20} height={20} />
          <span className="dock-tip meta" aria-hidden>
            {it.label}
          </span>
        </a>
        <span className="dock-dot" data-on={active ? 'true' : 'false'} aria-hidden />
      </li>
    )
  }

  return (
    <nav aria-label="sections and links" className="dock-wrap">
      <ul
        ref={listRef}
        className="dock soft soft-pill"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          pointerX.current = e.clientX
          schedule()
        }}
        onPointerLeave={() => {
          pointerX.current = null
          schedule()
        }}
      >
        {nav.map(renderItem)}
        <li aria-hidden className="dock-sep" />
        {out.map(renderItem)}
      </ul>
    </nav>
  )
}

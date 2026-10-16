'use client'

import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { IconArrowUpRight, IconClose } from '@/components/icons'
import { work } from '@/content/copy'
import { archive, featured, type FeaturedProject } from '@/content/projects'
import { profile } from '@/content/profile'
import { startScroll, stopScroll } from '@/lib/scroll'
import { play } from '@/lib/sound'
import { FileIcon, Thumb } from './Thumb'
import { WindowContent } from './WindowContent'

const d = work.desktop
const rest = featured.filter((p) => p.id !== 'xprso')

// designed scatter (% of the desktop), keeping the blurred centre clear
const FEATURED_POS: Record<string, [number, number]> = {
  fintarot: [23, 30],
  designdump: [72, 24],
  moodtunes: [28, 70],
  mediplan: [75, 66],
}
const ARCHIVE_POS: [number, number][] = [
  [47, 12], [9, 20], [11, 50], [8, 82], [90, 14], [91, 44], [88, 82], [50, 88], [62, 9], [30, 90],
]

type Open = { kind: 'project'; p: FeaturedProject } | { kind: 'file'; i: number } | null

export function Desktop() {
  const [open, setOpen] = useState<Open>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const lastIcon = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dlg = dialog.current
    if (!dlg) return
    if (open && !dlg.open) {
      dlg.showModal()
      stopScroll()
      play('click', { rate: 0.9 })
    }
    if (!open && dlg.open) dlg.close()
  }, [open])

  const close = () => {
    setOpen(null)
    startScroll()
    lastIcon.current?.focus()
  }

  const file = open?.kind === 'file' ? archive[open.i] : null
  const title = open?.kind === 'project' ? `${open.p.index} ${open.p.label}` : file ? file.file : ''

  return (
    <section id="desktop" data-section="work" className="desktop-section" aria-label="other projects">
      <div className="wrap">
        <div className="metabar meta">
          {d.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      {profile.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="desktop-portrait" src={profile.portrait.src} alt={profile.portrait.alt} />
      ) : (
        // without WebGL the blurred centrepiece comes from the static print
        <span className="desktop-backdrop" aria-hidden />
      )}

      {/* pointer devices: a desktop you can poke at */}
      <div className="desktop" data-desktop>
        <p className="sr-only">{d.hint}</p>
        {rest.map((p) => (
          <DesktopIcon
            key={p.id}
            id={p.id}
            pos={FEATURED_POS[p.id] ?? [50, 50]}
            label={p.label}
            selected={selected === p.id}
            onSelect={() => setSelected(p.id)}
            onOpen={(el) => {
              lastIcon.current = el
              setOpen({ kind: 'project', p })
            }}
          >
            <Thumb id={p.id} />
          </DesktopIcon>
        ))}
        {archive.map((a, i) => (
          <DesktopIcon
            key={a.repo}
            id={a.repo}
            small
            pos={ARCHIVE_POS[i] ?? [50, 50]}
            label={a.file}
            selected={selected === a.repo}
            onSelect={() => setSelected(a.repo)}
            onOpen={(el) => {
              lastIcon.current = el
              setOpen({ kind: 'file', i })
            }}
          >
            <FileIcon file={a.file} language={a.language} />
          </DesktopIcon>
        ))}
      </div>

      {/* small screens: the same windows, stacked */}
      <div className="wrap desktop-list">
        <p className="meta text-ink-muted">{d.mobileHint}</p>
        {rest.map((p) => (
          <article key={p.id} className="win soft soft-card">
            <header className="win-bar">
              <span className="win-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <h3 className="meta">
                {p.index} {p.label}
              </h3>
            </header>
            <WindowContent p={p} />
          </article>
        ))}
        <ul className="archive-list mono">
          {archive.map((a) => (
            <li key={a.repo}>
              <a href={a.url} target="_blank" rel="noreferrer">
                <span>{a.file}</span>
                <span className="text-ink-muted">{a.line}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="win win-dialog soft soft-card"
        aria-label={title}
        onClose={() => open && close()}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        {open && (
          <>
            <header className="win-bar">
              <span className="win-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <h3 className="meta">{title}</h3>
              <button type="button" className="win-close soft is-pressable" onClick={close} aria-label="close window" data-cursor="close">
                <IconClose width={14} height={14} />
              </button>
            </header>
            <div className="win-scroll" data-lenis-prevent>
              {open.kind === 'project' ? (
                <WindowContent p={open.p} />
              ) : (
                file && (
                  <div className="win-content">
                    <p className="win-oneliner">{file.line}</p>
                    <p className="mono text-ink-muted">
                      {file.language} · {file.date}
                    </p>
                    <a className="inline-flex items-center gap-2" href={file.url} target="_blank" rel="noreferrer" data-cursor="open">
                      github.com/VasavDotJS/{file.repo} <IconArrowUpRight width={14} height={14} />
                    </a>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  )
}

type IconProps = {
  id: string
  pos: [number, number]
  label: string
  small?: boolean
  selected: boolean
  onSelect: () => void
  onOpen: (el: HTMLElement) => void
  children: React.ReactNode
}

/** Draggable (pointer-fine only) icon with inertia, bounded to the desktop. */
function DesktopIcon({ pos, label, small, selected, onSelect, onOpen, children }: IconProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const st = useRef({ x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, t: 0, dragging: false, moved: false, raf: 0 })

  useEffect(() => () => cancelAnimationFrame(st.current.raf), [])

  const bounds = () => {
    const el = ref.current!
    const parent = el.parentElement!.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const s = st.current
    // current rect already includes the offset; compute allowed offset range
    const baseL = r.left - s.x
    const baseT = r.top - s.y
    return {
      minX: parent.left - baseL,
      maxX: parent.right - r.width - baseL,
      minY: parent.top - baseT,
      maxY: parent.bottom - r.height - baseT,
    }
  }

  const apply = () => {
    const s = st.current
    ref.current?.style.setProperty('--dx', `${s.x}px`)
    ref.current?.style.setProperty('--dy', `${s.y}px`)
  }

  const onDown = (e: RPointerEvent<HTMLButtonElement>) => {
    onSelect()
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
    const s = st.current
    cancelAnimationFrame(s.raf)
    s.dragging = true
    s.moved = false
    s.px = e.clientX
    s.py = e.clientY
    s.t = performance.now()
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: RPointerEvent<HTMLButtonElement>) => {
    const s = st.current
    if (!s.dragging) return
    const now = performance.now()
    const dx = e.clientX - s.px
    const dy = e.clientY - s.py
    if (!s.moved && Math.hypot(dx, dy) < 4) return
    if (!s.moved) play('rustle', { gain: 0.5 })
    s.moved = true
    const dt = Math.max(1, now - s.t)
    s.vx = (dx / dt) * 16
    s.vy = (dy / dt) * 16
    s.x += dx
    s.y += dy
    s.px = e.clientX
    s.py = e.clientY
    s.t = now
    apply()
  }
  const onUp = () => {
    const s = st.current
    if (!s.dragging) return
    s.dragging = false
    if (!s.moved) return
    const b = bounds()
    const step = () => {
      s.vx *= 0.92
      s.vy *= 0.92
      s.x = Math.min(b.maxX, Math.max(b.minX, s.x + s.vx))
      s.y = Math.min(b.maxY, Math.max(b.minY, s.y + s.vy))
      apply()
      if (Math.abs(s.vx) + Math.abs(s.vy) > 0.2) s.raf = requestAnimationFrame(step)
    }
    s.raf = requestAnimationFrame(step)
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`dicon${small ? ' is-small' : ''}`}
      data-selected={selected ? 'true' : 'false'}
      style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
      data-cursor="open"
      aria-label={`open ${label}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onDoubleClick={(e) => onOpen(e.currentTarget)}
      onClick={(e) => {
        // touch and keyboard open on a single activation
        const coarse = matchMedia('(pointer: coarse)').matches
        if (e.detail === 0 || coarse) onOpen(e.currentTarget)
      }}
    >
      {children}
      <span className="dicon-label meta">{label}</span>
    </button>
  )
}

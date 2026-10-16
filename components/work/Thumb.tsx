import type { ProjectId } from '@/content/projects'

/** In-house covers: typographic / riso treatments of each project's own output. No images. */
export function Thumb({ id }: { id: ProjectId }) {
  switch (id) {
    case 'fintarot':
      return (
        <span className="thumb tone-coral" aria-hidden>
          <span className="thumb-chart mono">{'  ●●\n ●  ●  ●\n●    ●● ●\n         ●●'}</span>
        </span>
      )
    case 'designdump':
      return (
        <span className="thumb tone-paper" aria-hidden>
          <span className="thumb-swatches">
            <i style={{ background: 'var(--riso-coral)' }} />
            <i style={{ background: 'var(--riso-yellow)' }} />
            <i style={{ background: '#0e0e0e' }} />
            <i className="halftone" />
          </span>
          <span className="thumb-aa">Aa</span>
        </span>
      )
    case 'moodtunes':
      return (
        <span className="thumb tone-yellow" aria-hidden>
          <span className="thumb-words">
            hyperpop
            <br />
            IDM
            <br />
            black metal
            <br />
            bedroom pop
          </span>
        </span>
      )
    case 'mediplan':
      return (
        <span className="thumb tone-inverted" aria-hidden>
          <span className="thumb-chips mono">
            <i>pending</i>
            <i>confirmed</i>
            <i>completed</i>
          </span>
        </span>
      )
    default:
      return null
  }
}

export function FileIcon({ file, language }: { file: string; language: string }) {
  const ext = file.split('.').pop()
  return (
    <span className="file-icon" data-lang={language.toLowerCase()} aria-hidden>
      <span className="file-ext mono">.{ext}</span>
    </span>
  )
}

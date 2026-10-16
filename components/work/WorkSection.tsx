import { work } from '@/content/copy'
import { XprsoPinned } from './XprsoPinned'

export function WorkSection() {
  return (
    <section id="work" data-section="work" className="section work-section">
      <div className="wrap">
        <div className="metabar meta">
          {work.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="section-head">
          <span className="ghost-word" aria-hidden>
            WORK
          </span>
          <h2 className="h-section relative">work</h2>
        </div>
      </div>
      <XprsoPinned />
    </section>
  )
}

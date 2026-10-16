import { stackCopy } from '@/content/copy'
import { Keyboard } from './Keyboard'

export function StackSection() {
  return (
    <section id="stack" data-section="stack" className="section paper-grid">
      <div className="wrap">
        <div className="metabar meta">
          {stackCopy.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="section-head">
          <span className="ghost-word" aria-hidden>
            STACK
          </span>
          <h2 className="h-section relative">stack</h2>
        </div>
        <Keyboard />
      </div>
    </section>
  )
}

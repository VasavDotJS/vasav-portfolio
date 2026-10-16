import { BrushStroke } from '@/components/fx/BrushStroke'
import { RevealLines } from '@/components/fx/RevealLines'
import { IconArrowUpRight, IconGitHub, IconMail } from '@/components/icons'
import { about } from '@/content/copy'
import { profile } from '@/content/profile'

export function IndexSection() {
  return (
    <section id="index" data-section="index" className="section paper-grid">
      <div className="wrap">
        <div className="metabar meta">
          {about.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="section-head">
          <span className="ghost-word" data-text="INDEX" aria-hidden />
          <h2 className="h-section relative">
            index
            <BrushStroke className="section-brush" />
          </h2>
        </div>

        <div className="grid-12 gap-y-12 pb-20 md:pb-28">
          <RevealLines className="about col-span-12 md:col-span-7">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </RevealLines>

          <dl className="spec col-span-12 md:col-span-5">
            {about.spec.map((row) => (
              <div key={row.k} className="spec-row soft-well">
                <dt className="meta text-ink-muted">{row.k}</dt>
                <dd>
                  {'href' in row && row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer" className="tip" data-tip={row.title} data-cursor="open">
                      {row.v}
                      <IconArrowUpRight width={13} height={13} />
                    </a>
                  ) : (
                    row.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="metabar meta">
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 no-underline" data-cursor="mail">
            <IconMail width={14} height={14} /> {profile.email}
          </a>
          <a href={profile.links.github.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 no-underline" data-cursor="open">
            <IconGitHub width={13} height={13} /> {profile.links.github.handle}
          </a>
        </div>
      </div>
    </section>
  )
}

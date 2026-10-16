import { about, contact, sections } from '@/content/copy'

export default function Home() {
  return (
    <main id="main">
      <section id="top" data-section="hero" className="paper-grid relative flex min-h-svh items-end pb-28 pt-16">
        <div className="wrap">
          <h1 className="display text-[clamp(64px,17vw,300px)]">VASAV P RAMESH</h1>
        </div>
      </section>
      {(['index', 'work', 'stack'] as const).map((id) => (
        <section key={id} id={id} data-section={id} className="relative min-h-svh py-24">
          <div className="wrap">
            <div className="metabar meta">
              <span>{sections[id]}</span>
              <span>2024—2026</span>
              <span>kochi</span>
            </div>
            <h2 className="h-section mt-10">{sections[id]}</h2>
            {id === 'index' && (
              <div className="mt-10 max-w-xl space-y-4 text-lg">
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
      <section id="contact" data-section="contact" className="relative min-h-svh py-24">
        <div className="wrap">
          <h2 className="h-section">{contact.heading.join(' ')}</h2>
          <p className="mt-6 text-lg text-ink-muted">{contact.sub}</p>
        </div>
      </section>
    </main>
  )
}

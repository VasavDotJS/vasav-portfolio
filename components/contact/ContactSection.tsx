import { contact } from '@/content/copy'
import { ContactForm } from './ContactForm'
import { EmailChip } from './EmailChip'
import { Footer } from './Footer'
import { SocialTiles } from './SocialTiles'

export function ContactSection() {
  return (
    <section id="contact" data-section="contact" className="section contact paper-grid">
      <div className="wrap">
        <div className="metabar meta">
          {contact.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <h2 className="contact-heading">
          <span className="sr-only">{contact.heading.join(' ')}</span>
          {contact.heading.map((w, i) => (
            <span key={w} className={`scrap ${i ? 'tone-paper is-b' : 'tone-yellow is-a'}`} aria-hidden>
              <span className="piece-ghost is-coral">{w}</span>
              <span className="piece-text">{w}</span>
            </span>
          ))}
        </h2>
        <p className="contact-sub">{contact.sub}</p>
        <div className="grid-12 gap-y-14 pb-16">
          <div className="col-span-12 md:col-span-7">
            <ContactForm />
          </div>
          <div className="col-span-12 grid content-start gap-10 md:col-span-5">
            <EmailChip />
            <div className="grid gap-3">
              <p className="meta text-ink-muted">{contact.social}</p>
              <SocialTiles />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

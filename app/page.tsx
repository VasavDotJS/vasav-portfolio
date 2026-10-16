import { Hero } from '@/components/hero/Hero'
import { IndexSection } from '@/components/index/IndexSection'
import { StackSection } from '@/components/stack/StackSection'
import { Desktop } from '@/components/work/Desktop'
import { WorkSection } from '@/components/work/WorkSection'
import { contact } from '@/content/copy'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <IndexSection />
      <WorkSection />
      <Desktop />
      <StackSection />
      <section id="contact" data-section="contact" className="relative min-h-svh py-24">
        <div className="wrap">
          <h2 className="h-section">{contact.heading.join(' ')}</h2>
          <p className="mt-6 text-lg text-ink-muted">{contact.sub}</p>
        </div>
      </section>
    </main>
  )
}

import { hero } from '@/content/copy'
import { profile } from '@/content/profile'
import { Collage } from './Collage'

export function Hero() {
  return (
    <section id="top" data-section="hero" className="hero paper-grid">
      <h1 className="sr-only">{profile.name}</h1>
      <Collage />
      <p className="scroll-cue meta" aria-hidden>
        {hero.scroll}
        <i />
        <i />
        <i />
      </p>
    </section>
  )
}

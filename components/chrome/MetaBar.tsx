import Link from 'next/link'
import { profile } from '@/content/profile'
import { Clock } from './Clock'
import { SectionLabel } from './SectionLabel'
import { SoundToggle } from './SoundToggle'
import { ThemeToggle } from './ThemeToggle'

/** Fixed editorial top bar (inspo C): name · current section · Kochi clock + toggles. */
export function MetaBar() {
  return (
    <header className="metabar-top">
      <div className="wrap grid h-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/#top" className="metabar-name" data-cursor="top">
          {profile.name.toUpperCase()}
        </Link>
        <div className="hidden justify-center md:flex">
          <SectionLabel />
        </div>
        <div className="flex items-center justify-end gap-3 md:gap-4">
          <span className="hidden sm:inline">
            <Clock />
          </span>
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

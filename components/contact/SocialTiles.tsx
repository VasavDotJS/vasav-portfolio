import { IconArrowUpRight, IconGitHub, IconInstagram, IconLinkedIn } from '@/components/icons'
import { profile } from '@/content/profile'

const tiles = [
  { name: 'github', Icon: IconGitHub, ...profile.links.github },
  { name: 'linkedin', Icon: IconLinkedIn, ...profile.links.linkedin },
  { name: 'instagram', Icon: IconInstagram, ...profile.links.instagram },
]

export function SocialTiles() {
  return (
    <ul className="tiles">
      {tiles.map(({ name, Icon, href, handle }) => (
        <li key={name}>
          <a href={href} target="_blank" rel="noreferrer" className="tile soft soft-card is-hoverable is-pressable" data-cursor="open">
            <Icon width={26} height={26} />
            <span className="tile-name">{name}</span>
            <span className="mono tile-handle">{handle}</span>
            <IconArrowUpRight className="tile-arrow" width={16} height={16} />
          </a>
        </li>
      ))}
    </ul>
  )
}

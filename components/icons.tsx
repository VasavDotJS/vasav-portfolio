// Tiny hand-picked icon set. 24px grid, 1.6 stroke, currentColor.
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
})

export const IconIndex = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 6h16M4 12h10M4 18h13" />
  </svg>
)

export const IconWork = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
  </svg>
)

export const IconStack = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="5" width="16" height="12" rx="3" />
    <path d="M7 20h10M9 10h6" />
  </svg>
)

export const IconContact = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 17h-8l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 5z" />
  </svg>
)

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

export const IconGitHub = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" />
  </svg>
)

export const IconLinkedIn = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2c0-1.4.9-2.3 2-2.3s2 .9 2 2.3V16M11.5 10.5V16" />
  </svg>
)

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <path d="M17 7.1v.1" />
  </svg>
)

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const IconSpeaker = ({ on, ...p }: P & { on?: boolean }) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    {on ? <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" /> : <path d="m16 10 4 4m0-4-4 4" />}
  </svg>
)

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

/** Halftone sun / moon: built from dots so it reads as printed. */
export function HalftoneSun(p: P) {
  const dots: [number, number, number][] = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    dots.push([12 + Math.cos(a) * 9, 12 + Math.sin(a) * 9, 1.1])
  }
  for (const [x, y] of [[12, 12], [10, 10], [14, 10], [10, 14], [14, 14], [12, 9.2], [12, 14.8], [9.2, 12], [14.8, 12]] as const) {
    dots.push([x, y, x === 12 && y === 12 ? 1.6 : 1.25])
  }
  return (
    <svg {...base(p)} stroke="none" fill="currentColor">
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r} />
      ))}
    </svg>
  )
}

export function HalftoneMoon(p: P) {
  const dots: [number, number, number][] = []
  for (let y = 4; y <= 20; y += 2.4) {
    for (let x = 4; x <= 20; x += 2.4) {
      const inMoon = (x - 12) ** 2 + (y - 12) ** 2 < 64 && (x - 15.5) ** 2 + (y - 9) ** 2 > 36
      if (!inMoon) continue
      const edge = Math.hypot(x - 15.5, y - 9) - 6
      dots.push([x, y, Math.min(1.15, 0.45 + edge * 0.18)])
    }
  }
  return (
    <svg {...base(p)} stroke="none" fill="currentColor">
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r.toFixed(2)} />
      ))}
    </svg>
  )
}

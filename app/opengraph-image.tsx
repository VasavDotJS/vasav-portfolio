import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const alt = 'Vasav P Ramesh'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Inter Tight 800 as TTF (Satori can't read woff2). Falls back to the built-in font offline.
async function font() {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@800', {
      headers: { 'user-agent': 'Mozilla/4.0' },
    }).then((r) => r.text())
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null
  } catch {
    return null
  }
}

const scraps = [
  { t: 'VASAV', x: 60, y: 92, rot: -2.5, bg: '#F1EEE8' },
  { t: 'P', x: 860, y: 70, rot: 5, bg: '#FCE244' },
  { t: 'RAMESH', x: 150, y: 330, rot: 1.6, bg: '#F1EEE8' },
]

export default async function OG() {
  const data = await font()
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#E8E5DF', fontFamily: data ? 'Inter Tight' : 'sans-serif' }}>
        {scraps.map((s) => (
          <div
            key={s.t}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              display: 'flex',
              padding: '10px 18px 0',
              background: s.bg,
              transform: `rotate(${s.rot}deg)`,
              boxShadow: '0 22px 30px -18px rgba(0,0,0,0.45)',
              fontSize: 210,
              fontWeight: 800,
              letterSpacing: -12,
              lineHeight: 0.85,
              color: '#0E0E0E',
            }}
          >
            <div style={{ position: 'absolute', left: 13, top: 14, color: '#FCE244', display: 'flex' }}>{s.t}</div>
            <div style={{ position: 'absolute', left: 25, top: 6, color: '#EB6461', display: 'flex' }}>{s.t}</div>
            <div style={{ position: 'relative', display: 'flex' }}>{s.t}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', left: 60, bottom: 40, display: 'flex', gap: 24, fontSize: 22, color: '#0E0E0E', letterSpacing: 2 }}>
          <span>{profile.monogram} / PORTFOLIO / 2026</span>
          <span>KOCHI</span>
        </div>
      </div>
    ),
    { ...size, fonts: data ? [{ name: 'Inter Tight', data, weight: 800, style: 'normal' }] : [] },
  )
}

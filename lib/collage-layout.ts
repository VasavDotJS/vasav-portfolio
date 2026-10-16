import { hero } from '@/content/copy'

const frag = (id: (typeof hero.fragments)[number]['id']) =>
  hero.fragments.find((f) => f.id === id)?.text ?? ''

// Composition of the hero collage. Positions are per breakpoint (d = desktop ≥ 768px, m = mobile).
// Rotations/offsets here are the "designed" rest pose; the daily seed nudges them on the client.

export type PieceKind = 'name' | 'letter' | 'fragment'

export type PieceDef = {
  id: string
  kind: PieceKind
  text: string
  /** paper style */
  tone: 'paper' | 'paper-dark' | 'yellow' | 'coral' | 'inverted' | 'label' | 'sticker'
  d: { l: string; t: string }
  m?: { l: string; t: string } // omitted = hidden on mobile
  rot: number
  /** parallax depth in px at full light deflection; negative moves against the pointer */
  depth: number
  z: number
  torn?: ('t' | 'r' | 'b' | 'l')[]
  tape?: { x: string; y: string; r: number; w?: number }[]
  flip?: boolean
  ghost?: boolean
}

export const collageLayout: PieceDef[] = [
  // ---- the name, cut up ----
  {
    id: 'vasav', kind: 'name', text: 'VASAV', tone: 'paper',
    d: { l: '2.6vw', t: 'calc(var(--bar-h) + 7svh)' }, m: { l: '3vw', t: 'calc(var(--bar-h) + 15svh)' },
    rot: -2.2, depth: 14, z: 6, torn: ['b'], ghost: true,
    tape: [{ x: '-2%', y: '-10%', r: -24, w: 110 }],
  },
  {
    id: 'p', kind: 'letter', text: 'P', tone: 'yellow',
    d: { l: '61vw', t: 'calc(var(--bar-h) + 4svh)' }, m: { l: '76vw', t: 'calc(var(--bar-h) + 11svh)' },
    rot: 5.5, depth: 24, z: 7, flip: true, ghost: true,
  },
  {
    id: 'ram', kind: 'name', text: 'RAM', tone: 'paper',
    d: { l: '12vw', t: 'calc(var(--bar-h) + 37svh)' }, m: { l: '4vw', t: 'calc(var(--bar-h) + 33svh)' },
    rot: 1.6, depth: 9, z: 5, torn: ['t', 'r'], ghost: true,
  },
  {
    id: 'e', kind: 'letter', text: 'E', tone: 'paper-dark',
    d: { l: '47.5vw', t: 'calc(var(--bar-h) + 32svh)' }, m: { l: '52vw', t: 'calc(var(--bar-h) + 30svh)' },
    rot: -4.5, depth: 30, z: 8, flip: true, ghost: true,
  },
  {
    id: 'sh', kind: 'name', text: 'SH', tone: 'paper',
    d: { l: '60vw', t: 'calc(var(--bar-h) + 38.5svh)' }, m: { l: '68vw', t: 'calc(var(--bar-h) + 34svh)' },
    rot: 3, depth: 12, z: 6, torn: ['l', 'b'], ghost: true,
    tape: [{ x: '78%', y: '-12%', r: 18, w: 96 }],
  },

  // ---- fragments ----
  {
    id: 'readme', kind: 'fragment', text: frag('readme'), tone: 'sticker',
    d: { l: '38vw', t: 'calc(var(--bar-h) + 3svh)' }, m: { l: '8vw', t: 'calc(var(--bar-h) + 6svh)' },
    rot: -9, depth: 34, z: 9, flip: true,
  },
  {
    id: 'study', kind: 'fragment', text: frag('study'), tone: 'coral',
    d: { l: '63vw', t: 'calc(var(--bar-h) + 66svh)' }, m: { l: '5vw', t: 'calc(var(--bar-h) + 54svh)' },
    rot: -2.5, depth: 18, z: 4,
  },
  {
    id: 'year', kind: 'fragment', text: frag('year'), tone: 'label',
    d: { l: '3vw', t: 'calc(var(--bar-h) + 2.5svh)' },
    rot: 1.5, depth: -8, z: 4,
  },
  {
    id: 'college', kind: 'fragment', text: frag('college'), tone: 'paper',
    d: { l: '3.5vw', t: 'calc(var(--bar-h) + 68svh)' },
    rot: 1.8, depth: 6, z: 3, torn: ['r'],
  },
  {
    id: 'city', kind: 'fragment', text: frag('city'), tone: 'yellow',
    d: { l: '83vw', t: 'calc(var(--bar-h) + 27svh)' }, m: { l: '52vw', t: 'calc(var(--bar-h) + 60svh)' },
    rot: -6, depth: 26, z: 9,
    tape: [{ x: '30%', y: '-45%', r: 4, w: 54 }],
  },
  {
    id: 'random', kind: 'fragment', text: frag('random'), tone: 'inverted',
    d: { l: '36vw', t: 'calc(var(--bar-h) + 72svh)' }, m: { l: '12vw', t: 'calc(var(--bar-h) + 66svh)' },
    rot: 3.5, depth: -12, z: 4, flip: true,
  },
  {
    id: 'audio', kind: 'fragment', text: frag('audio'), tone: 'paper',
    d: { l: '84vw', t: 'calc(var(--bar-h) + 55svh)' },
    rot: 2.8, depth: 16, z: 4, torn: ['t'],
  },
  {
    id: 'langs', kind: 'fragment', text: frag('langs'), tone: 'yellow',
    d: { l: '17vw', t: 'calc(var(--bar-h) + 61svh)' },
    rot: -1.8, depth: 20, z: 7,
  },
  {
    id: 'est', kind: 'fragment', text: frag('est'), tone: 'label',
    d: { l: '86vw', t: 'calc(var(--bar-h) + 6svh)' },
    rot: -2, depth: -6, z: 4,
  },
]

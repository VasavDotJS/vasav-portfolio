// A toy stand-in for MoodTunes' TextBlob scoring, small enough to run in the browser.
// Genres and links mirror MoodTunes' app.py. Threshold order is the intended one
// (in app.py the "sad" branch sits after "angry" and can't be reached).

const LEX: Record<string, number> = {
  amazing: 0.6, awesome: 1, beautiful: 0.85, best: 1, better: 0.5, bright: 0.7, calm: 0.3, chill: 0.25,
  cool: 0.35, excited: 0.4, fantastic: 0.4, fine: 0.4, free: 0.4, fun: 0.3, glad: 0.5, good: 0.7,
  great: 0.8, happy: 0.8, hopeful: 0.4, lovely: 0.5, love: 0.5, nice: 0.6, okay: 0.5, ok: 0.5,
  peaceful: 0.4, perfect: 1, proud: 0.8, relaxed: 0.3, wonderful: 1, alive: 0.1, hyped: 0.6, wild: 0.1,
  angry: -0.5, annoyed: -0.4, anxious: -0.25, awful: -1, bad: -0.7, bored: -0.5, broke: -0.4,
  broken: -0.4, dead: -0.2, depressed: -0.7, done: -0.1, empty: -0.1, exhausted: -0.4, furious: -0.6,
  hate: -0.8, hurt: -0.5, lonely: -0.5, lost: -0.4, mad: -0.6, miserable: -1, sad: -0.5, sick: -0.7,
  stressed: -0.5, stupid: -0.8, terrible: -1, tired: -0.4, ugly: -0.7, upset: -0.5, worst: -1,
  worried: -0.3,
}
const BOOST: Record<string, number> = { very: 1.3, so: 1.3, really: 1.3, extremely: 1.5, kinda: 0.7, slightly: 0.6 }
const NEGATE = new Set(['not', "don't", 'dont', "isn't", 'isnt', 'never', 'no', "can't", 'cant'])

export function polarity(text: string) {
  const words = text.toLowerCase().match(/[a-z']+/g) ?? []
  const scores: number[] = []
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!
    if (!(w in LEX)) continue
    let s = LEX[w]!
    const prev = words[i - 1]
    const prev2 = words[i - 2]
    if (prev && prev in BOOST) s *= BOOST[prev]!
    if ((prev && NEGATE.has(prev)) || (prev2 && NEGATE.has(prev2))) s *= -0.5
    scores.push(Math.max(-1, Math.min(1, s)))
  }
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
}

export type Mood = 'Happy' | 'Energetic' | 'Calm' | 'Angry' | 'Sad'

export function mood(p: number): Mood {
  if (p > 0.5) return 'Happy'
  if (p > 0.1) return 'Energetic'
  if (p < -0.5) return 'Sad'
  if (p < -0.1) return 'Angry'
  return 'Calm'
}

// verbatim from MoodTunes app.py
export const MOOD_GENRES: Record<Mood, string[]> = {
  Happy: ['Pop', 'DnB', 'Hyperpop', 'Electrocrush'],
  Sad: ['Lo-fi HipHop', 'Orchestral', 'Indie', 'Bedroom Pop'],
  Calm: ['Ambient', 'Noise', 'IDM', 'Soul/R&B'],
  Angry: ['Black Metal', 'NuMetal', 'Trap', 'Hardstyle'],
  Energetic: ['Dubstep', 'Color Bass', 'Alternative'],
}

export const spotifySearch = (q: string) => `https://open.spotify.com/search/${encodeURIComponent(q)}`

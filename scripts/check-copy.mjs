// Fails if copy contains banned words/patterns (see CLAUDE.md).
// Scans /content and, when a production build exists, the rendered HTML text.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const words = [
  'passionate', 'passion', 'innovative', 'cutting-edge', 'state-of-the-art', 'leverage', 'leveraging',
  'seamless', 'seamlessly', 'journey', 'crafting', 'crafted', 'elevate', 'unlock', 'empower', 'delve',
  'tapestry', 'realm', 'landscape', 'synergy', 'robust', 'dynamic', 'transformative', 'game-changer',
  'next-level', 'world-class', 'pixel-perfect',
]
const phrases = [
  'turning ideas into reality', 'bringing ideas to life', 'who loves to', "let's build something",
  "let's connect", 'hi there', 'welcome to my portfolio', 'thanks for stopping by', "in today's fast-paced",
  'hire me', 'years of experience',
]
// his own lines are allowed to shout
const allowedBang = ['CODE OF NON-DUALITY!', 'lose my shit!!!!']

const hits = []
const check = (text, where) => {
  const lower = text.toLowerCase()
  for (const w of words) {
    const re = new RegExp(`(^|[^a-z-])${w.replace(/[-]/g, '\\-')}([^a-z-]|$)`, 'i')
    if (re.test(lower)) hits.push(`${where}: "${w}"`)
  }
  for (const p of phrases) if (lower.includes(p)) hits.push(`${where}: "${p}"`)
  let t = text
  for (const a of allowedBang) t = t.split(a).join('')
  if (/[A-Za-z)]!(?!=)/.test(t)) hits.push(`${where}: exclamation mark`)
  if (/\p{Extended_Pictographic}/u.test(text.replace(/[©®™]/g, ""))) hits.push(`${where}: emoji`)
}

// 1. content files: check string literals only
const strRe = /(['"`])((?:\\.|(?!\1).)*)\1/g
for (const f of readdirSync('content')) {
  const src = readFileSync(join('content', f), 'utf8')
  src.split('\n').forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('import ')) return
    for (const m of line.matchAll(strRe)) check(m[2], `content/${f}:${i + 1}`)
  })
}

// 2. rendered HTML from the last production build, if any
const appDir = '.next/server/app'
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : []
  })
if (existsSync(appDir)) {
  for (const f of walk(appDir)) {
    const text = readFileSync(f, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#x27;|&apos;/g, "'")
    check(text, f)
  }
}

if (hits.length) {
  console.error(`banned copy found (${hits.length}):\n  ` + hits.join('\n  '))
  process.exit(1)
}
console.log('copy check: clean')

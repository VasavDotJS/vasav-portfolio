// Screenshot the site at three sizes in both themes.
// usage: node scripts/shoot.mjs [path=/] [outDir] [--full] [--scroll=0,900,...] [--sizes=desktop,tablet,mobile] [--themes=light,dark]
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const flag = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}`))
  if (!a) return def
  const [, v] = a.split('=')
  return v ?? true
}
const positional = args.filter((a) => !a.startsWith('--'))
const path = positional[0] ?? '/'
const out = positional[1] ?? 'shots'
const base = process.env.BASE_URL ?? 'http://localhost:3000'
const full = flag('full', false)
const scrolls = String(flag('scroll', '0')).split(',').map(Number)
const allSizes = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
}
const sizes = String(flag('sizes', 'desktop,tablet,mobile')).split(',')
const themes = String(flag('themes', 'light,dark')).split(',')
const wait = Number(flag('wait', 900))
const loader = flag('loader', false)
const anchor = flag('el', null)

mkdirSync(out, { recursive: true })
const browser = await chromium.launch()
for (const size of sizes) {
  for (const theme of themes) {
    const ctx = await browser.newContext({
      viewport: allSizes[size],
      deviceScaleFactor: 1,
      hasTouch: size === 'mobile',
      isMobile: size === 'mobile',
      colorScheme: theme,
    })
    await ctx.addInitScript(
      ([t, skipLoader]) => {
        try {
          localStorage.setItem('theme', t)
          if (skipLoader) sessionStorage.setItem('vpr-loaded', '1')
        } catch {}
      },
      [theme, !loader],
    )
    const page = await ctx.newPage()
    page.on('pageerror', (e) => console.error(`[pageerror ${size}/${theme}]`, e.message))
    page.on('console', (m) => m.type() === 'error' && console.error(`[console ${size}/${theme}]`, m.text()))
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(wait)
    if (anchor) {
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), anchor)
      await page.waitForTimeout(wait)
      const file = join(out, `${String(anchor).replace(/\W+/g, '')}-${size}-${theme}.png`)
      await page.screenshot({ path: file })
      console.log(file)
      await ctx.close()
      continue
    }
    for (const y of scrolls) {
      if (y) {
        await page.evaluate((y) => window.scrollTo(0, y), y)
        await page.waitForTimeout(wait)
      }
      const file = join(out, `${path.replace(/\W+/g, '_') || 'home'}-${size}-${theme}${y ? `-y${y}` : ''}.png`)
      await page.screenshot({ path: file, fullPage: Boolean(full) })
      console.log(file)
    }
    await ctx.close()
  }
}
await browser.close()

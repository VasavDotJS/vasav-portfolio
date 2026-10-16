// Renders the 3D centrepiece once per theme and saves it as the static fallback
// (used when WebGL is missing or prefers-reduced-motion is set).
// usage: node scripts/capture-fallback.mjs  (dev server on :3000)
import { chromium } from 'playwright'
import sharp from 'sharp'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const browser = await chromium.launch()
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } })
  await ctx.addInitScript((t) => {
    localStorage.setItem('theme', t)
    sessionStorage.setItem('vpr-loaded', '1')
  }, theme)
  const page = await ctx.newPage()
  await page.goto(`${base}/?capture`, { waitUntil: 'networkidle' })
  await page.addStyleTag({
    content: `main, header, nav, .grain, .loader { display: none !important }
      html, body { background: ${theme === 'dark' ? '#000' : '#fff'} !important }`,
  })
  await page.waitForTimeout(3500)
  const png = await page.screenshot()
  await sharp(png).webp({ quality: 82, effort: 6 }).toFile(`public/halftone-${theme}.webp`)
  console.log(`public/halftone-${theme}.webp`)
  await ctx.close()
}
await browser.close()

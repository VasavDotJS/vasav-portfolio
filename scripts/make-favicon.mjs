// Generates app/icon.svg: a 5x7 dot-matrix "VPR" over offset coral/yellow inks.
// Dark tab bars get light ink via a media query inside the SVG.
import { writeFileSync } from 'node:fs'

const G = {
  V: ['10001', '10001', '10001', '10001', '01010', '01010', '00100'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
}
const cell = 3.4
const r = 1.45
const ox = (64 - (17 * cell - (cell - 2 * r))) / 2 + r
const oy = (64 - (7 * cell - (cell - 2 * r))) / 2 + r
const dots = []
;['V', 'P', 'R'].forEach((ch, i) =>
  G[ch].forEach((row, y) =>
    [...row].forEach((on, x) => {
      if (on === '1') dots.push([ox + (i * 6 + x) * cell, oy + y * cell])
    }),
  ),
)
const layer = (cls, dx, dy, rr) =>
  `<g class="${cls}">${dots.map(([x, y]) => `<circle cx="${(x + dx).toFixed(2)}" cy="${(y + dy).toFixed(2)}" r="${rr}"/>`).join('')}</g>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<style>.y{fill:#FCE244}.c{fill:#EB6461;mix-blend-mode:multiply}.k{fill:#0E0E0E}.bg{fill:#E8E5DF}
@media (prefers-color-scheme: dark){.bg{fill:#000}.k{fill:#EDEBE6}.c{fill:#F07A70;mix-blend-mode:normal}.y{fill:#FFE14A}}</style>
<rect class="bg" width="64" height="64" rx="14"/>
${layer('y', 1.3, -1, 1.75)}
${layer('c', -1.1, 0.9, 1.5)}
${layer('k', 0, 0, r)}
</svg>
`
writeFileSync('app/icon.svg', svg)
console.log('app/icon.svg', svg.length, 'bytes')

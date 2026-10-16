// Same drawing rules as FinTarot's fintarot/chart.py generate_ascii_chart():
// last `width` points, `height` rows, "●" per point, "%8.2f │ " row labels, "└───" axis.
import { mulberry32 } from './seeded-random'

export function asciiChart(prices: number[], height = 12, width = 80) {
  if (!prices.length) return 'No price data to display.'
  const pts = prices.slice(-width)
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const grid = Array.from({ length: height }, () => Array.from({ length: pts.length }, () => ' '))
  pts.forEach((p, col) => {
    const row = height - 1 - Math.round(((p - min) / range) * (height - 1))
    grid[row]![col] = '●'
  })
  const lines = grid.map((cells, row) => {
    const label = max - (row / (height - 1)) * range
    return `${label.toFixed(2).padStart(8)} │ ${cells.join('')}`
  })
  lines.push('         └' + '─'.repeat(pts.length))
  return lines.join('\n')
}

/** A seeded random walk. Not a stock. */
export function randomWalk(seed: number, n = 56, start = 100) {
  const rng = mulberry32(seed)
  const out = [start]
  for (let i = 1; i < n; i++) {
    const step = (rng() + rng() + rng() - 1.5) * 1.9
    out.push(Math.max(1, out[i - 1]! + step))
  }
  return out
}

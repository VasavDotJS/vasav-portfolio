// Port of the relevant bit of XPRSO's src/domain/tax (tax-exclusive, GST_INTRA, 500 bps):
// integer paise, basis points, half-up rounding in integers. Used only by the keypad demo.

export const TAX_BPS = 500

export function roundHalfUp(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : Math.round(numerator / denominator)
}

/** "249.5" -> 24950 paise, no floats in the stored value */
export function rupeesToPaise(input: string) {
  const [r = '0', p = ''] = input.split('.')
  return Number(r || '0') * 100 + Number((p + '00').slice(0, 2))
}

export function gstIntra(taxablePaise: number, rateBps = TAX_BPS) {
  const cgst = roundHalfUp(taxablePaise * (rateBps / 2), 10000)
  const sgst = cgst
  return { cgst, sgst, total: taxablePaise + cgst + sgst }
}

export const formatINR = (paise: number) =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** Indian financial year label, e.g. 26-27 for Apr 2026 – Mar 2027 */
export function fyShort(d = new Date()) {
  const y = d.getFullYear()
  const start = d.getMonth() >= 3 ? y : y - 1
  return `${String(start).slice(2)}-${String(start + 1).slice(2)}`
}

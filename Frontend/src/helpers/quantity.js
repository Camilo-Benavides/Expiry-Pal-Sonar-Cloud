import { parseQuantity as parseQty } from './units'

export function normalizeVulgarFractions(s) {
  if (!s) return s
  return String(s)
    .replace(/\u00BC/g, '1/4')
    .replace(/\u00BD/g, '1/2')
    .replace(/\u00BE/g, '3/4')
    .replace(/\u2153/g, '1/3')
    .replace(/\u2154/g, '2/3')
    .replace(/\u2155/g, '1/5')
    .replace(/\u2156/g, '2/5')
    .replace(/\u2157/g, '3/5')
    .replace(/\u2158/g, '4/5')
    .replace(/\u2159/g, '1/6')
    .replace(/\u215A/g, '5/6')
    .replace(/\u215B/g, '1/8')
    .replace(/\u215C/g, '3/8')
    .replace(/\u215D/g, '5/8')
    .replace(/\u215E/g, '7/8')
}

export function parseLeadingQuantity(s) {
  if (!s) return { qty: null, rest: String(s || '').trim(), rawQty: null }
  const str = normalizeVulgarFractions(String(s)).replace(/[-\u2013\u2014]/g, ' ').trim()
  const m = str.match(/^\s*([0-9]+(?:[\s\d\/\.]*[0-9])?)\s*(.*)$/)
  if (!m) return { qty: null, rest: str, rawQty: null }
  const rawQty = m[1]
  const qty = parseQty(rawQty.replace(',', '.'))
  const rest = (m[2] || '').trim()
  return { qty: qty, rest: rest, rawQty: rawQty }
}

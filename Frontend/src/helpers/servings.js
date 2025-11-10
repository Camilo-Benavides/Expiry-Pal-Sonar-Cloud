// Helpers for parsing and scaling recipe servings

export function parseServings(recipe) {
  if (!recipe) return null
  if (typeof recipe.servings === 'number' && recipe.servings > 0) return recipe.servings
  // try to parse 'portions' like '2 servings' or '2-3 servings'
  const p = recipe.portions || recipe.portionsText || ''
  if (p && typeof p === 'string') {
  const m = p.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–)?\s*(\d+(?:[.,]\d+)?)?/) 
    if (m) {
      const n1 = Number(String(m[1]).replace(',', '.'))
      if (!Number.isNaN(n1) && n1 > 0) return n1
    }
  }
  // try to extract from text like '12 servings'
  if (recipe.portions && typeof recipe.portions === 'string') {
    const m2 = recipe.portions.match(/(\d+)/)
    if (m2) return Number(m2[1])
  }
  return null
}

export function formatNumber(n) {
  if (n == null || Number.isNaN(Number(n))) return ''
  if (Number.isInteger(n)) return String(n)
  return Number(n).toFixed(2).replace(/\.00$/, '')
}

export default {
  parseServings,
  formatNumber
}

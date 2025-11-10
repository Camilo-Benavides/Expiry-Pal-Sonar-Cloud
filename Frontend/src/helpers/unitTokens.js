export function canonicalUnit(tok) {
  if (!tok) return tok
  const t = String(tok).toLowerCase().trim()
  if (['c','cup','cups'].includes(t)) return 'cup'
  if (['tsp','t','teaspoon','teaspoons'].includes(t)) return 'tsp'
  if (['tbsp','tbl','tbs','tablespoon','tablespoons'].includes(t)) return 'tbsp'
  if (['g','gram','grams'].includes(t)) return 'g'
  if (['kg','kilogram','kilograms'].includes(t)) return 'kg'
  if (['ml','milliliter','milliliters'].includes(t)) return 'ml'
  if (['l','liter','liters'].includes(t)) return 'l'
  if (['oz','ounce','ounces'].includes(t)) return 'oz'
  if (['lb','pound','pounds'].includes(t)) return 'lb'
  return t
}

export function isKnownUnit(tok) {
  const c = canonicalUnit(tok)
  return ['cup','tsp','tbsp','g','kg','ml','l','oz','lb'].includes(c)
}

import { parseQuantity, convertTemp, convertAmount, fmt } from './units'
import { canonicalUnit } from './unitTokens'

export function convertSummary(html, target) {
  if (!html || !target) return html
  try {
    let out = String(html)
    if (target === 'imperial') {
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(?:-|–|—)\s*([0-9]+(?:[\.,][0-9]+)?)\s*°?\s*(?:c|celsius)\b/gi, (m,p1,p2)=>{
        const f1 = convertTemp(p1, 'imperial')
        const f2 = convertTemp(p2, 'imperial')
        return (f1==null||f2==null) ? m : `${f1}–${f2}°F`
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*°?\s*(?:c|celsius)\b/gi, (m,p1)=>{
        const f = convertTemp(p1, 'imperial')
        return f == null ? m : `${f}°F`
      })
    } else {
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(?:-|–|—)\s*([0-9]+(?:[\.,][0-9]+)?)\s*°?\s*(?:f|fahrenheit)\b/gi, (m,p1,p2)=>{
        const c1 = convertTemp(p1, 'metric')
        const c2 = convertTemp(p2, 'metric')
        return (c1==null||c2==null) ? m : `${c1}–${c2}°C`
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*°?\s*(?:f|fahrenheit)\b/gi, (m,p1)=>{
        const c = convertTemp(p1, 'metric')
        return c == null ? m : `${c}°C`
      })
    }
    out = out.replace(/([0-9]+(?:[\s\d\/\.]*[0-9])?)\s*(?:-|–|—)\s*([0-9]+(?:[\s\d\/\.]*[0-9])?)\s*(g|grams?|kg|kilograms?|ml|milliliter|milliliters|l|liter|liters|c|cup|cups|tsp|teaspoon|teaspoons|tbsp|tablespoon|tablespoons|oz|ounce|ounces|lb|pound|pounds)\b/gi, (m, p1, p2, unitText)=>{
      const q1 = parseQuantity(p1.replace(',', '.'))
      const q2 = parseQuantity(p2.replace(',', '.'))
      if (q1 == null || q2 == null) return m
      const u = String(unitText).toLowerCase()
      const unitMap = (s) => {
        if (['g','gram','grams'].includes(s)) return 'g'
        if (['kg','kilogram','kilograms'].includes(s)) return 'kg'
        if (['ml','milliliter','milliliters'].includes(s)) return 'ml'
        if (['l','liter','liters'].includes(s)) return 'l'
        if (['c','cup','cups'].includes(s)) return 'cup'
        if (['tsp','teaspoon','teaspoons','t'].includes(s)) return 'tsp'
        if (['tbsp','tablespoon','tablespoons','tbs','tbl'].includes(s)) return 'tbsp'
        if (['oz','ounce','ounces'].includes(s)) return 'oz'
        if (['lb','pound','pounds'].includes(s)) return 'lb'
        return s
      }
      const srcUnit = unitMap(u)
      const conv1 = convertAmount(q1, srcUnit, target)
      const conv2 = convertAmount(q2, srcUnit, target)
      if (conv1 && conv2 && conv1.unit === conv2.unit) {
        return `${fmt(conv1.amount)}–${fmt(conv2.amount)} ${conv1.unit}`
      }
      return m
    })

    if (target === 'imperial') {
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(g|grams?)\b/gi, (m, p1) => {
        const a = parseQuantity(p1.replace(',', '.'))
        if (a == null) return m
        const conv = convertAmount(a, 'g', 'imperial')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(ml|milliliters?)\b/gi, (m,p1)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const conv = convertAmount(a, 'ml', 'imperial')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(c|cup|cups|tsp|tbsp)\b/gi, (m,p1,p2)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const src = String(p2).toLowerCase()
        const srcUnit = (src==='c' ? 'cup' : (src==='tsp' ? 'tsp' : (src==='tbsp' ? 'tbsp' : src)))
        const conv = convertAmount(a, srcUnit, target)
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
    } else {
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(oz|ounces?)\b/gi, (m,p1)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const conv = convertAmount(a, 'oz', 'metric')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(c|cup|cups)\b/gi, (m,p1,p2)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const conv = convertAmount(a, 'cup', 'metric')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(tbsp|tablespoon|tablespoons|tbs|tbl)\b/gi, (m,p1)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const conv = convertAmount(a, 'tbsp', 'metric')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
      out = out.replace(/([0-9]+(?:[\.,][0-9]+)?)\s*(tsp|teaspoon|teaspoons|t)\b/gi, (m,p1)=>{
        const a = parseQuantity(p1.replace(',', '.'))
        if (a==null) return m
        const conv = convertAmount(a, 'tsp', 'metric')
        return conv ? `${fmt(conv.amount)} ${conv.unit}` : m
      })
    }
    return out
  } catch (e) { return html }
}

export default convertSummary

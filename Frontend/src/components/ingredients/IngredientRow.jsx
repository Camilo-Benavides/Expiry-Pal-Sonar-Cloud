import React from 'react'
import { formatNumber as fmtServ } from '../../helpers/servings'
import { fmt, convertAmount } from '../../helpers/units'
import { parseLeadingQuantity, normalizeVulgarFractions } from '../../helpers/quantity'
import { canonicalUnit } from '../../helpers/unitTokens'
import { addOrMergeItem } from '../../helpers/cart'

export default function IngredientRow({ ingredient, scaleFactor = 1, unitSystem = 'metric' }){
  const name = ingredient.nameClean || ingredient.name

  const renderAmount = () => {
    if (ingredient.original) {
      const parsed = parseLeadingQuantity(ingredient.original)
      if (parsed && parsed.qty != null) {
        const scaledQty = parsed.qty * scaleFactor
        const restParts = (parsed.rest || '').split(/\s+/).filter(Boolean)
        const first = restParts[0] || ''
        const unitToken = (first || '').toLowerCase().replace(/[^a-z]/g,'')
        const unitCandidates = ['g','gram','grams','kg','kilogram','kilograms','ml','milliliter','milliliters','l','liter','liters','tsp','teaspoon','teaspoons','tbsp','tablespoon','tablespoons','cup','cups','c','oz','ounce','ounces','lb','pound','pounds']
        if (unitCandidates.includes(unitToken)) {
          const desc = restParts.slice(1).join(' ')
          const conv = convertAmount(scaledQty, canonicalUnit(unitToken), unitSystem)
          if (conv) return `${fmtServ(conv.amount)} ${conv.unit}${desc ? ' ' + desc : ''}`
        }
        return `${fmtServ(scaledQty)} ${parsed.rest}`
      }
    }
    if (typeof ingredient.amount === 'number' && ingredient.unit) {
      const scaled = ingredient.amount * scaleFactor
      const conv = convertAmount(scaled, canonicalUnit(ingredient.unit), unitSystem)
      if (conv) return `${fmtServ(conv.amount)} ${conv.unit}`
    }
    return ingredient.original || ''
  }

  const onAdd = () => {
    try{
      let qty = null; let unit = null; let note = ''
      if (ingredient.original) {
        const parsed = parseLeadingQuantity(ingredient.original)
        if (parsed && parsed.qty != null) {
          qty = parsed.qty * scaleFactor
          const restParts = (parsed.rest || '').split(/\s+/).filter(Boolean)
          if (restParts.length > 0) { unit = canonicalUnit(restParts[0].toLowerCase().replace(/[^a-z]/g,'')); note = restParts.slice(1).join(' ') }
        }
      }
      const payload = { name: name || ingredient.name || ingredient.original || 'Unknown', original: ingredient.original || '', qty, unit, note }
      addOrMergeItem(payload)
      try{ window.alert(`${payload.name} added to cart`) }catch(e){}
    }catch(e){ try{ window.alert('Could not add item to cart') }catch(_){} }
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div>
        <div style={{fontWeight:700}}>{name}</div>
        <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>{renderAmount()}</div>
      </div>
      <div>
        {ingredient.available ? (
          <span className="badge badge--fresh">✔︎</span>
        ) : (
          <button className="btn" aria-label={`Add ${name} to cart`} onClick={onAdd}>🛒</button>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import UnitToggle from '../ui/UnitToggle'
import { fmt, convertAmount, convertMgToOz } from '../../helpers/units'

export default function NutritionCard({ nutrition, unitSystem = 'metric', onChange, perLabel = 'per 100 g', showUnitToggle = true }){
  const renderTilesFromObject = (obj) => {
    const renderUnavailable = () => (
      <div key="unavailable" style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
        <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Nutrition</div>
        <div style={{fontWeight:700,fontSize:16}}>Nutritional information not available</div>
      </div>
    )
    const display = (name, value, suffix) => (
      <div key={name} style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
        <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>{name}</div>
        <div style={{fontWeight:800,fontSize:18}}>{value}{suffix}</div>
      </div>
    )

    const hasAny = ['calories','protein','carbs','fat','sugar','sodium'].some(k => typeof obj[k] !== 'undefined' && obj[k] !== null && obj[k] !== '')
    if (!hasAny) return [renderUnavailable()]

    if (unitSystem === 'metric'){
      return [
        display('Calories', obj.calories, ' kcal'),
        display('Protein', fmt(obj.protein), ' g'),
        display('Carbs', fmt(obj.carbs), ' g'),
        display('Fat', fmt(obj.fat), ' g'),
        display('Sugar', fmt(obj.sugar), ' g'),
        display('Sodium', fmt(obj.sodium), ' mg')
      ]
    }

    const pConv = convertAmount(obj.protein, 'g', 'imperial')
    const cConv = convertAmount(obj.carbs, 'g', 'imperial')
    const fConv = convertAmount(obj.fat, 'g', 'imperial')
    const sConv = convertAmount(obj.sugar, 'g', 'imperial')
    const sodiumOz = typeof obj.sodium === 'number' ? convertMgToOz(obj.sodium) : null

    return [
      display('Calories', obj.calories, ' kcal'),
      display('Protein', pConv ? fmt(pConv.amount) : fmt(obj.protein), ` ${pConv ? pConv.unit : 'g'}`),
      display('Carbs', cConv ? fmt(cConv.amount) : fmt(obj.carbs), ` ${cConv ? cConv.unit : 'g'}`),
      display('Fat', fConv ? fmt(fConv.amount) : fmt(obj.fat), ` ${fConv ? fConv.unit : 'g'}`),
      display('Sugar', sConv ? fmt(sConv.amount) : fmt(obj.sugar), ` ${sConv ? sConv.unit : 'g'}`),
      display('Sodium', sodiumOz != null ? fmt(Number(sodiumOz)) : fmt(obj.sodium), ` ${sodiumOz != null ? 'oz' : 'mg'}`)
    ]
  }

  const renderTilesFromArray = (arr) => {
    const names = ['Calories','Protein','Fat','Carbohydrates','Sugar','Sodium']
    const picks = names.map(n => arr.find(x => x.name === n)).filter(Boolean)
    const display = (name, value, suffix) => (
      <div key={name} style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
        <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>{name}</div>
        <div style={{fontWeight:800,fontSize:18}}>{value}{suffix}</div>
      </div>
    )

    if (!picks || picks.length === 0) return [(
      <div key="unavailable-array" style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
        <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Nutrition</div>
        <div style={{fontWeight:700,fontSize:16}}>Nutritional information not available</div>
      </div>
    )]

    return picks.map(n => {
      const scaled = (typeof n.amount === 'number') ? n.amount : n.amount
      const uname = (n.unit || '').toLowerCase()
      if (unitSystem === 'metric') return display(n.name, fmt(scaled), ` ${uname || ''}`)
      const conv = convertAmount(scaled, uname, 'imperial')
      if (n.name === 'Sodium' && typeof n.amount === 'number') {
        const sodiumOz = convertMgToOz(n.amount)
        return display(n.name, sodiumOz != null ? fmt(Number(sodiumOz)) : fmt(n.amount), ` ${sodiumOz != null ? 'oz' : (n.unit || '')}`)
      }
      return display(n.name, conv ? fmt(conv.amount) : fmt(scaled), ` ${conv ? conv.unit : (n.unit || '')}`)
    })
  }

  const tiles = Array.isArray(nutrition && nutrition.nutrients) ? renderTilesFromArray(nutrition.nutrients) : renderTilesFromObject(nutrition || {})

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontWeight:700}}>Nutrition <span style={{fontWeight:400,fontSize:13,marginLeft:8,color:'var(--md-sys-color-on-surface-variant)'}}>{perLabel}</span></div>
        <div>
          {showUnitToggle ? <UnitToggle value={unitSystem} onChange={onChange} /> : null}
        </div>
      </div>
      <div style={{marginTop:12, display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12}}>
        {tiles}
      </div>
    </div>
  )
}

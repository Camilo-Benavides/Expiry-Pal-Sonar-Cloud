import React from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'

export default function RecipeRow({ recipe }) {
  const sourceIngredients = Array.isArray(recipe.displayIngredients) ? recipe.displayIngredients : (Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
  const total = sourceIngredients.length
  const available = sourceIngredients.filter(i=>i.available).length
  const ratio = total === 0 ? 0 : available / total

  const badge = {
    text: `${available}/${total}`,
    bgVar: ratio > 0.5 ? 'var(--badge-fresh-bg)' : ratio === 0 ? 'var(--badge-danger-bg)' : 'var(--badge-soon-bg)',
    colorVar: ratio > 0.5 ? 'var(--badge-fresh-color)' : ratio === 0 ? 'var(--badge-danger-color)' : 'var(--badge-soon-color)'
  }

  const merged = { ...recipe }

  return (
    <Link to={`/recipes/${recipe.id}`} state={{ recipe: merged }} style={{textDecoration:'none',color:'inherit',display:'block',width:'100%'}}>
      <div className="card recipe-row" style={{display:'flex',alignItems:'center',gap:12,padding:10,border:'1px solid var(--md-sys-color-outline-variant)',borderRadius:10,width:'100%'}}>
        {merged.image ? (
          <img src={merged.image} alt={merged.name} style={{width:56,height:56,objectFit:'cover',borderRadius:8}} />
        ) : (
          <div style={{width:56,height:56,borderRadius:8,display:'grid',placeItems:'center',fontSize:26,background:'var(--md-sys-color-surface)'}}>{recipe.emoji || '🍽️'}</div>
        )}
        <div style={{flex:1}}>
          <div style={{fontWeight:700}}>{recipe.name}</div>
          {((merged.time || merged.readyInMinutes) || (merged.portions || merged.servings)) ? (
            (() => {
              const t = merged.time || (merged.readyInMinutes ? `${merged.readyInMinutes}m` : '')
              const p = merged.portions || (merged.servings ? `${merged.servings} servings` : '')
              const text = `${t}${(t && p) ? ' · ' : ''}${p}`
              return (
                <div style={{marginTop:4}}>
                  <Badge bgVar={'var(--badge-neutral-bg)'} colorVar={'var(--badge-neutral-color)'} style={{fontSize:12,padding:'4px 8px',borderRadius:12}}>{text}</Badge>
                </div>
              )
            })()
          ) : (
            <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>{(sourceIngredients||[]).slice(0,3).map(i=>i.name).join(', ')}{(sourceIngredients||[]).length>3 ? '...' : ''}</div>
          )}
          
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <Badge bgVar={badge.bgVar} colorVar={badge.colorVar} style={{fontSize:12,padding:'6px 8px',borderRadius:12}}>{badge.text}</Badge>
        </div>
      </div>
    </Link>
  )
}

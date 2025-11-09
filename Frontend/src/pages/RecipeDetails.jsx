import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import Topbar from '../components/navigation/Topbar'
import DetailCard from '../components/ui/DetailCard'
import { recipes } from '../data/recipes'
import { mockProducts } from '../data/mockProducts'

export default function RecipeDetails(){
  const { id } = useParams()
  const location = useLocation()
  const fromState = location && location.state && location.state.recipe ? location.state.recipe : null
  // fallback to static recipes
  const staticRecipe = recipes.find(r=>String(r.id)===String(id))

  const [recipe, setRecipe] = useState(fromState || staticRecipe || null)
  const [prepared, setPrepared] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    if (recipe) return

    let mounted = true
    async function load(){
      setLoading(true)
      setError(null)
      try{
        const resp = await fetch(`http://localhost:5000/recipes/${id}/information?includeNutrition=true`)
        if (!resp.ok) throw new Error(`Server returned ${resp.status}`)
        const data = await resp.json()

        // map spoonacular response to the frontend recipe shape used by this page
        const fridgeRaw = localStorage.getItem('ep_fridges')
        const arr = fridgeRaw ? JSON.parse(fridgeRaw) : []
        const fridge = arr && arr.length > 0 ? arr[0] : null
        const itemsSource = fridge && Array.isArray(fridge.items) && fridge.items.length > 0 ? fridge.items : mockProducts
        const availableNames = new Set((itemsSource||[]).map(i => String(i.name).toLowerCase()))

        const ingredients = (data.extendedIngredients || []).map(el => ({
          id: el.id,
          name: el.original || el.name,
          nameClean: el.nameClean || el.name,
          amount: el.amount,
          unit: el.unit,
          measures: el.measures,
          available: availableNames.has((el.name || '').toLowerCase())
        }))

        // parse steps with equipment and ingredients
        let steps = []
        if (Array.isArray(data.analyzedInstructions) && data.analyzedInstructions.length > 0) {
          const instr = data.analyzedInstructions[0]
          steps = (instr.steps || []).map(s => ({
            number: s.number,
            step: s.step,
            ingredients: Array.isArray(s.ingredients) ? s.ingredients.map(i=>({id:i.id,name:i.name,image:i.image})) : [],
            equipment: Array.isArray(s.equipment) ? s.equipment.map(e=>({id:e.id,name:e.name,image:e.image})) : []
          }))
        } else if (data.instructions) {
          // fallback: split by newline into plain steps
          steps = String(data.instructions).split('\n').map((s,idx)=> ({ number: idx+1, step: s.trim(), ingredients: [], equipment: [] })).filter(s=>s.step)
        }

        const mapped = {
          id: data.id,
          name: data.title,
          image: data.image,
          time: data.readyInMinutes ? `${data.readyInMinutes}m` : '',
          portions: data.servings ? `${data.servings} servings` : '',
          readyInMinutes: data.readyInMinutes || null,
          servings: data.servings || null,
          summary: data.summary || '',
          tags: data.dishTypes || [],
          ingredients,
          steps,
          nutrition: data.nutrition || null,
          sourceUrl: data.sourceUrl || data.spoonacularSourceUrl || ''
        }

        if (mounted) setRecipe(mapped)
      }catch(err){
        if (mounted) setError(err.message || String(err))
      }finally{ if (mounted) setLoading(false) }
    }

    load()
    return ()=>{ mounted = false }
  }, [id, recipe])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading recipe…</div>
  if (error) return <div className="min-h-screen flex items-center justify-center">Could not load recipe: {error}</div>
  if(!recipe) return <div className="min-h-screen flex items-center justify-center">Recipe not found</div>

  return (
    <>
      <div className="hero-banner desktop-only">
        <Topbar active="recipes" />
        <div className="hero-search-wrap"><div className="hero-search" /></div>
      </div>

      <div className="min-h-screen flex items-start justify-center bg-ep-background px-4 py-6 hero-overlap">
        <div className="w-full" style={{maxWidth:1100}}>
          <div style={{display:'grid',gap:16}}>
            <DetailCard style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{fontSize:36}}>{recipe.emoji || '🍽️'}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{fontWeight:800,fontSize:18}}>{recipe.name}</div>
                    {(recipe.time || recipe.portions) ? (
                      <span className="badge badge--neutral" style={{fontSize:13, padding:'4px 8px', borderRadius:12, marginLeft:6}}>
                        {recipe.time ? recipe.time : ''}{(recipe.time && recipe.portions) ? ' · ' : ''}{recipe.portions ? recipe.portions : ''}
                      </span>
                    ) : null}
                </div>
                <div style={{marginTop:8,display:'flex',gap:8,flexWrap:'wrap'}}>
                  {(recipe.tags || []).map(t => (
                <span key={t} className="badge badge--neutral">{t}</span>
                  ))}
                </div>
              </div>
              <div style={{marginLeft:'auto'}}>
                <button className="btn" onClick={()=>setPrepared(p=>!p)}>{prepared ? 'Unmark' : 'Mark as prepared'}</button>
              </div>
            </DetailCard>

            <DetailCard>
              <div className="recipe-summary-media" style={{gap:12}}>
                {recipe.image ? (
                  <img className="recipe-image" src={recipe.image} alt={recipe.name} />
                ) : null}
                <div style={{flex:1}}>
                  {recipe.summary ? (
                    <div dangerouslySetInnerHTML={{__html: recipe.summary}} style={{color:'var(--md-sys-color-on-surface-variant)'}} />
                  ) : (
                    <div style={{color:'var(--md-sys-color-on-surface-variant)'}}>No description available.</div>
                  )}
                  <div style={{marginTop:8,fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>
                    {recipe.readyInMinutes ? `${recipe.readyInMinutes} min · ` : ''}{recipe.servings ? `${recipe.servings} servings` : ''}
                  </div>
                </div>
              </div>
            </DetailCard>

            <div className="ingredients-nutrition-grid">
              <DetailCard>
                <div>
                  <div style={{fontWeight:700}}>Ingredients</div>
                  <div style={{marginTop:10,display:'grid',gap:8}}>
                    {(recipe.ingredients || []).map(it => (
                      <div key={(it.name || '') + String(it.id || '')} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div>
                          <div style={{fontWeight:700}}>{it.nameClean || it.name}</div>
                          <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>
                            {it.original ? (
                              <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>{it.original}</div>
                            ) : (
                              (() => {
                                const a = (typeof it.amount === 'number') ? (Number.isInteger(it.amount) ? String(it.amount) : it.amount.toFixed(2)) : (it.amount || '')
                                const u = it.unit || ''
                                const amt = a ? `${a}${u ? ' ' + u : ''}` : ''
                                return <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>{amt}</div>
                              })()
                            )}
                          </div>
                        </div>
                        <div>{it.available ? <span className="badge badge--fresh">✔︎</span> : <button className="btn">Add</button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </DetailCard>

              <DetailCard>
                <div>
                  <div style={{fontWeight:700}}>Nutrition</div>
                  <div style={{marginTop:10}}>
                    {recipe.nutrition && Array.isArray(recipe.nutrition.nutrients) ? (
                      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:8}}>
                        {['Calories','Protein','Fat','Carbohydrates'].map(name => {
                          const n = (recipe.nutrition.nutrients || []).find(x => x.name === name)
                          if (!n) return null
                          return (
                            <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div style={{fontSize:13}}>{n.name}</div>
                              <div style={{fontWeight:700}}>{n.amount}{n.unit}</div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>Nutrition per serving not available</div>
                    )}
                  </div>
                </div>
              </DetailCard>
            </div>

            <DetailCard>
              <div style={{fontWeight:700}}>Steps</div>
              <div style={{marginTop:10,display:'grid',gap:12}}>
                {(recipe.steps || []).length === 0 && <div>No steps available</div>}
                {(recipe.steps || []).map((s,idx)=> (
                  <div key={idx} style={{display:'grid',gridTemplateColumns:'40px 1fr',gap:12}}>
                    <div style={{fontWeight:700, color:'var(--md-sys-color-on-surface-variant)'}}>{s.number || idx+1}.</div>
                    <div>
                      <div style={{marginBottom:8}}>{s.step}</div>
                      {s.equipment && s.equipment.length > 0 && (
                        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                          {s.equipment.map(e => (
                            <div key={e.id} style={{display:'flex',alignItems:'center',gap:8,background:'rgba(0,0,0,0.02)',padding:'4px 8px',borderRadius:8}}>
                              {e.image ? <img src={e.image.startsWith('http') ? e.image : `https://spoonacular.com/cdn/equipment_100x100/${e.image}`} alt={e.name} style={{width:20,height:20,objectFit:'cover',borderRadius:4}} /> : null}
                              <div style={{fontSize:13}}>{e.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DetailCard>
          </div>
        </div>
      </div>
    </>
  )
}

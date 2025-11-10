import React, { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import Topbar from '../components/navigation/Topbar'
import DetailCard from '../components/ui/DetailCard'
import IngredientRow from '../components/ingredients/IngredientRow'
import { recipes } from '../data/recipes'
import { mockProducts } from '../data/mockProducts'
import { parseServings, formatNumber as fmtServ } from '../helpers/servings'
import { fmt, convertAmount, parseQuantity, convertTemp } from '../helpers/units'
import { normalizeVulgarFractions, parseLeadingQuantity } from '../helpers/quantity'
import { canonicalUnit } from '../helpers/unitTokens'
import { addMany } from '../helpers/cart'
import convertSummary from '../helpers/convertSummary'
import NutritionCard from '../components/nutrition/NutritionCard'

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
  const [unitSystem, setUnitSystem] = useState(() => {
    try{ const v = localStorage.getItem('ep_unitSystem'); return v || 'metric' }catch(e){ return 'metric' }
  })

  // determine base servings and desired servings state
  const baseServingsGuess = parseServings(recipe) || (typeof recipe?.servings === 'number' ? recipe.servings : null) || 1
  const [desiredServings, setDesiredServings] = useState(baseServingsGuess)

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

  const saveUnitSystem = (s) => {
    setUnitSystem(s)
    try{ localStorage.setItem('ep_unitSystem', s) }catch(e){}
  }

  // compute scale factor from base -> desired
  const scaleFactor = (() => {
    const base = baseServingsGuess || 1
    const d = Number(desiredServings) || base
    return base > 0 ? (d / base) : 1
  })()

  // prepare scaled nutrition object so the shared NutritionCard can display per-serving values
  const scaledNutrition = (() => {
    if (!recipe || !recipe.nutrition) return null
    const raw = recipe.nutrition
    // spoonacular-style: { nutrients: [ { name, amount, unit }, ... ] }
    if (Array.isArray(raw.nutrients)) {
      return { ...raw, nutrients: raw.nutrients.map(n => ({ ...n, amount: (typeof n.amount === 'number') ? (n.amount * scaleFactor) : n.amount })) }
    }
    // object form: { calories, protein, carbs, fat, sugar, sodium }
    const keys = ['calories','protein','carbs','fat','sugar','sodium']
    const obj = { ...raw }
    keys.forEach(k => { if (typeof obj[k] === 'number') obj[k] = obj[k] * scaleFactor })
    return obj
  })()

  // use shared helpers from ../helpers/units: fmt, convertAmount, parseQuantity, convertTemp

  

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
              {/* Mark button aligned right next to the title to keep header clean */}
              <div style={{marginLeft:'auto'}}>
                <button className="btn" onClick={()=>setPrepared(p=>!p)}>{prepared ? 'Unmark' : 'Mark as prepared'}</button>
              </div>
            </DetailCard>

            {/* Controls card: Units and Servings live here to avoid crowding the header */}
            <DetailCard>
              <div className="recipe-header-controls" style={{alignItems:'center'}}>
                <div className="recipe-controls-left">
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)',marginRight:6}}>Units</div>
                  <button className={`btn ${unitSystem==='metric' ? 'chip-selected' : ''}`} onClick={()=>saveUnitSystem('metric')}>Metric</button>
                  <button className={`btn ${unitSystem==='imperial' ? 'chip-selected' : ''}`} onClick={()=>saveUnitSystem('imperial')}>Imperial</button>
                </div>
                <div style={{flex:1}} />
                <div className="recipe-controls-right">
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)',marginRight:8}}>Servings</div>
                  <div className="servings-spinner">
                    <button className="btn" onClick={()=>setDesiredServings(s => Math.max(1, Number(s)-1))} aria-label="decrease servings">-</button>
                    <input aria-label="desired servings" value={desiredServings} onChange={e=>setDesiredServings(e.target.value)} />
                    <button className="btn" onClick={()=>setDesiredServings(s => Number(s)+1)} aria-label="increase servings">+</button>
                  </div>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)',marginLeft:10}}>base: {baseServingsGuess}</div>
                </div>
              </div>
            </DetailCard>

            <DetailCard>
              <div className="recipe-summary-media" style={{gap:12}}>
                {recipe.image ? (
                  <img className="recipe-image" src={recipe.image} alt={recipe.name} />
                ) : null}
                <div style={{flex:1}}>
                  {recipe.summary ? (
                    <div dangerouslySetInnerHTML={{__html: convertSummary(recipe.summary, unitSystem)}} style={{color:'var(--md-sys-color-on-surface-variant)'}} />
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
                      <div key={(it.name || '') + String(it.id || '')}>
                        <IngredientRow ingredient={it} scaleFactor={scaleFactor} unitSystem={unitSystem} />
                      </div>
                    ))}
                    {/* Add all missing ingredients button */}
                    { (recipe.ingredients || []).some(i => !i.available) ? (
                      <div style={{display:'flex',justifyContent:'center',marginTop:12}}>
                        <button className="btn primary" aria-label="Add all missing ingredients to cart" onClick={() => {
                          // gather missing ingredients
                          try{
                            const missings = (recipe.ingredients || []).filter(i=>!i.available)
                            const toAdd = missings.map(i => {
                              // try to extract a numeric scaled quantity if possible
                              let qty = null; let unit = null; let note = ''
                              if (i.original) {
                                // normalize hyphens/dashes and vulgar fraction glyphs so inputs like "1 -1/2 c" become "1 1/2 c"
                                const origStr = normalizeVulgarFractions(String(i.original)).replace(/[-\u2013\u2014]/g, ' ').trim()
                                const m = origStr.match(/^\s*([0-9]+(?:[\s\d\/\.]*[0-9])?)\s*(.*)$/)
                                if (m) {
                                  const parsed = parseQuantity(m[1])
                                  if (parsed != null) {
                                    qty = parsed * scaleFactor
                                    // try to capture first token as unit if present
                                    const restParts = (m[2] || '').split(/\s+/).filter(Boolean)
                                      if (restParts.length > 0) {
                                      const cand = restParts[0].toLowerCase().replace(/[^a-z]/g,'')
                                      unit = canonicalUnit(cand)
                                      note = restParts.slice(1).join(' ')
                                    }
                                  }
                                }
                              }
                              return {
                                name: i.nameClean || i.name || i.original || 'Unknown',
                                original: i.original || '',
                                qty: qty,
                                unit: unit,
                                note: note
                              }
                            })

                            try{
                              addMany(toAdd)
                              try{ window.alert(`${toAdd.length} missing ingredient(s) added to your cart`) }catch(e){}
                            }catch(e){ console.error('Could not save cart', e) }
                          }catch(e){ console.error(e); try{ window.alert('Could not add items to cart') }catch(_){} }
                        }}>🛒 Add all missing ingredients</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </DetailCard>

              <DetailCard>
                <NutritionCard nutrition={scaledNutrition || recipe.nutrition} unitSystem={unitSystem} onChange={saveUnitSystem} perLabel="per serving" showUnitToggle={false} />
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
                      <div style={{marginBottom:8}} dangerouslySetInnerHTML={{__html: convertSummary(s.step, unitSystem)}} />
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

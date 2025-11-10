import React, { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Topbar from '../components/navigation/Topbar'
import GroupCard from '../components/ui/GroupCard'
import { recipes } from '../data/recipes'
import HeroSearchFilters from '../components/ui/HeroSearchFilters'
import DeviceFilter from '../components/ui/DeviceFilter'
import { extractRecipeDevices, gatherDevicesFromList } from '../helpers/devices'
import RecipeRow from '../components/ui/RecipeRow'
import { suggestRecipes } from '../services/recipesService'
import { mockProducts } from '../data/mockProducts'

export default function Recipes(){
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('All')
  const [devicesList, setDevicesList] = useState([])
  const [unavailableDevices, setUnavailableDevices] = useState(() => {
    try{ const v = localStorage.getItem('ep_unavailableDevices'); return v ? JSON.parse(v) : [] }catch(e){ return [] }
  })
  const [suggested, setSuggested] = useState([])
  const [allRecipes, setAllRecipes] = useState([]) 
  const [loadingSuggested, setLoadingSuggested] = useState(false)
  const [suggestError, setSuggestError] = useState(null)

  const categories = ['All','Breakfast','Lunch','Dinner','Snack']

  const matches = (r) => {
    const tags = Array.isArray(r.tags) ? r.tags : (Array.isArray(r.dishTypes) ? r.dishTypes : [])
    if (q && !`${r.name} ${tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false
    if (category && category !== 'All' && !tags.includes(category)) return false
    return true
  }


  const location = useLocation()


  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoadingSuggested(true)
      setSuggestError(null)
      try{
        const raw = localStorage.getItem('ep_fridges')
        const arr = raw ? JSON.parse(raw) : []
        const fridge = arr && arr.length > 0 ? arr[0] : null
    
        let itemsSource = mockProducts
        if (fridge && Array.isArray(fridge.items) && fridge.items.length > 0) {
          try{
            const existingIds = new Set(fridge.items.map(i => i.id))
            const extras = mockProducts.filter(p => !existingIds.has(p.id) && (p.owner === 'me' || p.isCommunity))
            itemsSource = [...fridge.items, ...extras]
          }catch(e){
            itemsSource = fridge.items
          }
        }
        const cleanName = (n) => {
          if (!n) return ''
          let s = String(n).toLowerCase().replace(/\([^)]*\)/g, '')
          s = s.replace(/[\.,;:\!\?]/g, '')
          s = s.replace(/\s+/g, ' ').trim()
          return s
        }

        const ingredientNames = Array.from(new Set((itemsSource||[]).map(i=>i.name).filter(Boolean).map(n=>cleanName(n)).filter(Boolean)))

        if (ingredientNames.length === 0){
          if (mounted) setSuggested([])
          return
        }
        let itemsFromCache = null
        try{
          const cacheRaw = sessionStorage.getItem('ep_recipe_suggestions')
          if (cacheRaw){
            const cacheObj = JSON.parse(cacheRaw)
            const cachedIngredients = Array.isArray(cacheObj.ingredients) ? cacheObj.ingredients.map(x=>String(x).toLowerCase()).sort() : []
            const currentIngredients = ingredientNames.map(x=>String(x).toLowerCase()).sort()
            if (JSON.stringify(cachedIngredients) === JSON.stringify(currentIngredients) && Array.isArray(cacheObj.items)){
              itemsFromCache = cacheObj.items
            }
          }
        }catch(e){ /* ignore cache parse errors */ }

        let res = itemsFromCache
        if (!res){
          res = await suggestRecipes(ingredientNames, 30, 30)
          console.debug('suggestRecipes result', res)
          try{
            const payload = { ingredients: ingredientNames, items: res }
            sessionStorage.setItem('ep_recipe_suggestions', JSON.stringify(payload))
          }catch(e){ /* ignore storage errors */ }
        } else {
          console.debug('Using cached recipe suggestions from session')
        }

        if (!mounted) return

  // Normalize recipes and compute availability/ratio based on fridge ingredients
        const fridgeSet = new Set(ingredientNames.map(x=>String(x).toLowerCase()))
        const normalized = (res || []).map(r => {
          // Extract ingredient names from common Spoonacular shapes or custom shape
          const names = Array.isArray(r.ingredients) ? r.ingredients.map(i=>i.name)
                        : Array.isArray(r.extendedIngredients) ? r.extendedIngredients.map(i=>i.name)
                        : Array.isArray(r.usedIngredients) ? r.usedIngredients.map(i=>i.name)
                        : []
          const displayIngredients = names.map(n => {
            const cn = cleanName(n)
            return { name: n, available: fridgeSet.has(cn) }
          })
          const total = displayIngredients.length
          const available = displayIngredients.filter(i=>i.available).length
          const ratio = total === 0 ? 0 : available/total
          // extract required devices for this recipe (e.g., pot, stand mixer)
          const requiredDevices = extractRecipeDevices(r)
          return { ...r, displayIngredients, _availableCount: available, _totalCount: total, _ratio: ratio, requiredDevices }
        })

  const allDevices = gatherDevicesFromList(normalized)
  const unavailableSet = new Set((unavailableDevices || []).map(x=>String(x)))
        const afterFilter = normalized.filter(r => {
          if (!matches(r)) return false
          if (category && category !== 'All' && !((r.tags || []).includes(category))) return false
          if (Array.isArray(r.requiredDevices) && r.requiredDevices.length > 0){
            for (const d of r.requiredDevices){ if (unavailableSet.has(d)) return false }
          }
          return true
        })

        // Split into suggested (> 0.5) and candidates (<= 0.5)
        let suggestedList = afterFilter.filter(r => r._ratio > 0.5).sort((a,b) => b._availableCount - a._availableCount || b._ratio - a._ratio)
        const candidates = afterFilter.filter(r => r._ratio <= 0.5).sort((a,b) => b._availableCount - a._availableCount || b._ratio - a._ratio)
        let allList = []

        console.debug('recipes: normalized', normalized.length, 'afterFilter', afterFilter.length, 'suggestedFound', suggestedList.length, 'candidates', candidates.length)

        // If there are no >50% suggestions, fallback to best candidates:
        // put first 10 candidates into Suggested, and next 20 into All
        if (suggestedList.length === 0 && afterFilter.length > 0){
          console.debug('No >50% suggestions found — using top candidates as fallback')
          suggestedList = candidates.slice(0, 10)
          allList = candidates.slice(10, 10 + 20)
        } else {
          allList = candidates.slice(0, 20)
        }

  // If backend returned nothing and there is no suggestion, fallback to static recipes
        if ((!afterFilter || afterFilter.length === 0) && ingredientNames.length > 0){
          console.debug('No suggestions from backend or none matched filters, falling back to static recipes')
          const fallbackSuggested = recipes.map(r => {
            const total = Array.isArray(r.ingredients) ? r.ingredients.length : 0
            const available = Array.isArray(r.ingredients) ? r.ingredients.filter(i=>i.available).length : 0
            const ratio = total === 0 ? 0 : available/total
            return { ...r, _availableCount: available, _totalCount: total, _ratio: ratio }
          }).filter(r => r._ratio > 0.5 && matches(r) && (category === 'All' || (r.tags||[]).includes(category))).sort((a,b)=>b._availableCount - a._availableCount)
          setSuggested(fallbackSuggested)
          setAllRecipes([])
        } else {
          setSuggested(suggestedList)
          setAllRecipes(allList)
        }
  // expose device list into state so DeviceFilter can render (keeps UI reactive)
  try{ setDevicesList(allDevices) }catch(e){}
      }catch(err){
        console.error('suggest fetch error', err)
        if (mounted) setSuggestError(err?.message || String(err))
      }finally{ if (mounted) setLoadingSuggested(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [q, category, location.key, unavailableDevices])

  const onDevicesChange = (arr) => {
    setUnavailableDevices(arr || [])
  }

  const [openSuggested, setOpenSuggested] = useState(true)
  const [openAll, setOpenAll] = useState(false)

  return (
    <>
      <div className="hero-banner desktop-only">
        <Topbar active="recipes" />
        <div style={{padding:0}}>
          <div style={{marginBottom:12}}>
            <HeroSearchFilters
              query={q}
              onQueryChange={setQ}
              placeholder="Search recipes (name, tag)"
            />
          </div>

          {/* Device filter*/}
          {devicesList && devicesList.length > 0 ? (
            <div style={{marginTop:12, display:'flex', justifyContent:'center'}}>
              <div className="card" style={{maxWidth:1100, width:'100%', padding:12}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap'}}>
                  <div style={{flex:'0 0 auto'}}>
                    <DeviceFilter devices={devicesList} unavailable={unavailableDevices} onChange={onDevicesChange} />
                  </div>

                  <div style={{flex:'1 1 auto', display:'flex', justifyContent:'center'}}>
                    <div className="filters-grid" style={{justifyContent:'flex-start', display:'flex', gap:8, flexWrap:'wrap'}} aria-label="Filtro de categoría">
                      {categories.map(c=> (
                        <button key={c} className={`btn ${c===category ? 'chip-selected' : ''}`} onClick={()=>setCategory(c)} style={{borderRadius:12}}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="mobile-only">
        <div style={{padding:10}}>
          <div style={{marginBottom:8}}>
            <HeroSearchFilters
              query={q}
              onQueryChange={setQ}
              placeholder="Search recipes (name, tag)"
            />
          </div>

          {devicesList && devicesList.length > 0 ? (
            <div style={{display:'flex', justifyContent:'center'}}>
              <div className="card" style={{width:'95%', padding:10}}>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  <DeviceFilter devices={devicesList} unavailable={unavailableDevices} onChange={onDevicesChange} />
                  <div style={{display:'flex', gap:8, flexWrap:'wrap', paddingTop:6, justifyContent:'flex-start'}} aria-label="Filtro de categoría">
                    {categories.map(c=> (
                      <button key={c} className={`btn ${c===category ? 'chip-selected' : ''}`} onClick={()=>setCategory(c)} style={{borderRadius:12}}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <main className="min-h-screen flex items-start justify-center bg-ep-background px-4 py-6">
        <div className="w-full" style={{maxWidth:1100}}>
          <section className="cards-stage">
              <GroupCard icon={'🍽️'} title={'Suggested recipes'} count={suggested.length} open={openSuggested} onToggle={()=>setOpenSuggested(v=>!v)}>
                {loadingSuggested && (
                  Array.from({length:6}).map((_,i)=> (
                    <div key={`skeleton-${i}`} className="card skeleton">
                      <div className="skeleton-row" />
                    </div>
                  ))
                )}
                {suggestError && <div className="card">Could not load suggestions: {suggestError}</div>}
                {!loadingSuggested && !suggestError && suggested.length === 0 && (
                  <div className="card">No suggested recipes found for your fridge items.</div>
                )}
                  {suggested.map(r=> (
                    <RecipeRow key={r.id} recipe={r} />
                  ))}
              </GroupCard>

              <GroupCard icon={'📚'} title={'All recipes'} count={allRecipes.length} open={openAll} onToggle={()=>setOpenAll(v=>!v)}>
                {allRecipes.length === 0 && (
                  <div className="card">No additional recipes found.</div>
                )}
                {allRecipes.map(r=> (
                  <RecipeRow key={r.id} recipe={r} />
                ))}
              </GroupCard>
          </section>
        </div>
      </main>
    </>
  )
}

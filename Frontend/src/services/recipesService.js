// Lightweight service to call the backend recipe-suggest proxy
export async function suggestRecipes(ingredients = [], number = undefined, prefetch = undefined){
  const url = 'http://localhost:5000/recipes/suggest'
  try{
    // allow optional `number` (how many candidates to return). Backend will cap to a safe maximum.
    const payload = { ingredients }
    if (typeof number !== 'undefined') payload.number = number
    // optional: prefetch top N detailed recipes (server will default/ignore if not supported)
    if (typeof prefetch !== 'undefined') payload.prefetch = prefetch

    const resp = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
    if (!resp.ok) throw new Error(`Server returned ${resp.status}`)
    const data = await resp.json()

    return Array.isArray(data) ? data : []
  }catch(err){
    console.error('suggestRecipes error', err)
    throw err
  }
}

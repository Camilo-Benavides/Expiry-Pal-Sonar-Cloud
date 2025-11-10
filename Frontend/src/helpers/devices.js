// helper utilities to extract and normalize kitchen device/equipment names from recipe objects
export const normalizeDeviceName = (s) => {
  if (!s) return ''
  // normalize common synonyms and trim
  let t = String(s).toLowerCase().trim()
  // remove punctuation
  t = t.replace(/[(),.]/g, '')
  // map a few common variants to friendly tokens
  const map = {
    'stand mixer': 'stand mixer',
    'mixer': 'stand mixer',
    'pot': 'pot',
    'saucepan': 'pot',
    'frying pan': 'frying pan',
    'skillet': 'frying pan',
    'oven': 'oven',
    'baking dish': 'oven',
    'baking sheet': 'oven',
    'spatula': 'spatula',
    'whisk': 'whisk',
    'blender': 'blender',
    'food processor': 'food processor',
    'measuring cup': 'measuring cup',
    'measuring spoons': 'measuring spoons',
    'pan': 'frying pan'
  }
  if (map[t]) return map[t]
  return t
}

export const extractRecipeDevices = (r) => {
  if (!r) return []
  const devices = new Set()
  try{
    const instr = Array.isArray(r.analyzedInstructions) && r.analyzedInstructions.length > 0 ? r.analyzedInstructions[0] : null
    if (instr && Array.isArray(instr.steps)){
      instr.steps.forEach(s => {
        if (Array.isArray(s.equipment)){
          s.equipment.forEach(e => {
            if (e && e.name) devices.add(normalizeDeviceName(e.name))
          })
        }
      })
    }

    if (Array.isArray(r.steps)){
      r.steps.forEach(s => {
        if (Array.isArray(s.equipment)) s.equipment.forEach(e => { if (e && e.name) devices.add(normalizeDeviceName(e.name)) })
      })
    }

    if (Array.isArray(r.equipment)) r.equipment.forEach(e=>{ if (e) devices.add(normalizeDeviceName(e)) })
    if (Array.isArray(r.tools)) r.tools.forEach(e=>{ if (e) devices.add(normalizeDeviceName(e)) })
  }catch(_){ void _ }

  return Array.from(devices).filter(Boolean)
}

export const gatherDevicesFromList = (recipes) => {
  const s = new Set()
  try{
    const arr = Array.isArray(recipes) ? recipes : []
    for (const r of arr){
      let list = []
  try{ list = extractRecipeDevices(r) }catch(_){ list = [] }
      if (!Array.isArray(list)) continue
      for (const d of list) if (d) s.add(d)
    }
  }catch(_){ void _ }
  return Array.from(s).filter(Boolean).sort()
}

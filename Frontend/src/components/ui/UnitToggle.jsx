import React, { useState, useEffect } from 'react'

export default function UnitToggle({ onChange } = {}){
  const [unit, setUnit] = useState(() => {
    try{ const v = localStorage.getItem('ep_unitSystem'); return v || 'metric' }catch{ return 'metric' }
  })

  useEffect(()=>{
    try{ localStorage.setItem('ep_unitSystem', unit) }catch(_){ void _ }
    if (typeof onChange === 'function') onChange(unit)
  }, [unit])

  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Units</div>
      <button className={`btn ${unit==='metric' ? 'chip-selected' : ''}`} onClick={()=>setUnit('metric')}>Metric</button>
      <button className={`btn ${unit==='imperial' ? 'chip-selected' : ''}`} onClick={()=>setUnit('imperial')}>Imperial</button>
    </div>
  )
}

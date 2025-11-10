import React, { useState, useEffect, useRef } from 'react'

// DeviceFilter: compact dropdown with checklist to avoid many chips in the UI.
// Persists unavailable devices to localStorage key 'ep_unavailableDevices'.
export default function DeviceFilter({ devices = [], unavailable = [], onChange }){
  const [open, setOpen] = useState(false)
  // helper to compute initial available set (all devices minus those marked unavailable)
  const makeInitialAvailable = () => {
    try{
      const u = Array.isArray(unavailable) ? unavailable.map(x=>String(x)) : []
      return new Set((devices || []).map(d => String(d)).filter(d => !u.includes(d)))
    }catch(_){ return new Set((devices || []).map(d=>String(d))) }
  }
  const [available, setAvailable] = useState(makeInitialAvailable)
  const ref = useRef(null)

  useEffect(()=>{
    setAvailable(makeInitialAvailable())
  }, [unavailable, devices])

  // close on outside click
  useEffect(()=>{
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return ()=> document.removeEventListener('mousedown', onDoc)
  }, [])

  const toggleOne = (d) => {
    const next = new Set(available)
    if (next.has(d)) next.delete(d)
    else next.add(d)
    setAvailable(next)
    // compute unavailable list and persist
    const unavailableArr = (devices || []).map(x=>String(x)).filter(x => !next.has(x))
  try{ localStorage.setItem('ep_unavailableDevices', JSON.stringify(unavailableArr)) }catch(_){ void _ }
    if (onChange) onChange(unavailableArr)
  }

    const reset = () => {
      const all = new Set((devices || []).map(d=>String(d)))
      setAvailable(all)
  try{ localStorage.removeItem('ep_unavailableDevices') }catch(_){ void _ }
    if (onChange) onChange([])
  }

    const unavailableCount = (devices || []).map(d=>String(d)).filter(d => !available.has(d)).length
    const label = unavailableCount === 0 ? `Devices (${devices.length})` : `Devices (${unavailableCount} off)`

  return (
    <div ref={ref} style={{position:'relative', display:'inline-block', width:'100%'}}>
      <button className="btn" onClick={()=>setOpen(v=>!v)} style={{width:220, justifyContent:'space-between'}} aria-expanded={open} aria-haspopup="listbox">{label} <span style={{opacity:.7}}>{open ? '▴' : '▾'}</span></button>
      {open && (
        <div style={{position:'absolute', left:0, top:'calc(100% + 8px)', zIndex:1200, background:'var(--md-sys-color-surface)', border:'1px solid var(--md-sys-color-outline-variant)', borderRadius:10, padding:12, boxShadow:'var(--shadow-2)', minWidth:260}}>
          <div style={{maxHeight:220, overflow:'auto', display:'grid', gap:6}}>
            {devices.length === 0 && <div style={{color:'var(--md-sys-color-on-surface-variant)'}}>No devices detected</div>}
            {devices.map(d => (
              <label key={d} style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" checked={available.has(d)} onChange={()=>toggleOne(d)} />
                <span style={{textTransform:'capitalize'}}>{d}</span>
              </label>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>
            <button className="btn" onClick={reset}>Reset</button>
            <button className="btn" onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import '../../styles/accessibility.css'

const PREF_KEY = 'ep_accessibility_prefs'

export default function AccessibilityButton(){
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState({ highContrast:'none', grayscale:false, dyslexic:false, colorBlind:'none', textScale:100 })
  const panelRef = useRef(null)
  const prevFocusRef = useRef(null)
  const [liveMessage, setLiveMessage] = useState('')
  const liveRef = useRef(null)

  useEffect(()=>{
    try{
      const saved = window.localStorage.getItem(PREF_KEY)
      if(saved) setPrefs(JSON.parse(saved))
    }catch(e){ void e }
  },[])

  useEffect(()=>{
    const root = document.documentElement
  // high contrast: support 'none' | 'dark' | 'light'
  root.classList.remove('a11y--high-contrast-dark','a11y--high-contrast-light')
  if(prefs.highContrast === 'dark') root.classList.add('a11y--high-contrast-dark')
  if(prefs.highContrast === 'light') root.classList.add('a11y--high-contrast-light')

    prefs.grayscale ? root.classList.add('a11y--grayscale') : root.classList.remove('a11y--grayscale')
    prefs.dyslexic ? root.classList.add('a11y--dyslexic-font') : root.classList.remove('a11y--dyslexic-font')

    // color-blind modes
    root.classList.remove('a11y--cb-protanopia','a11y--cb-deuteranopia','a11y--cb-tritanopia')
    if(prefs.colorBlind && prefs.colorBlind !== 'none'){
      const cls = `a11y--cb-${prefs.colorBlind}`
      root.classList.add(cls)
    }

    // text scaling
    if(prefs.textScale && typeof prefs.textScale === 'number'){
      root.style.fontSize = `${prefs.textScale}%`
    } else {
      root.style.fontSize = ''
    }

    // announce change via aria-live
    if(liveRef.current){
      const msgs = []
      if(prefs.highContrast && prefs.highContrast !== 'none') msgs.push(`High contrast ${prefs.highContrast}`)
      if(prefs.textScale && prefs.textScale !== 100) msgs.push(`Text scale ${prefs.textScale} percent`)
      if(prefs.grayscale) msgs.push('Grayscale on')
      if(prefs.dyslexic) msgs.push('Dyslexic font on')
      if(prefs.colorBlind && prefs.colorBlind !== 'none') msgs.push(`${prefs.colorBlind} color mode`)
      const msg = msgs.length ? msgs.join('. ') : 'Accessibility preferences cleared'
      setLiveMessage(msg)
    }
  try{ window.localStorage.setItem(PREF_KEY, JSON.stringify(prefs)) }catch(e){ void e }
  },[prefs])

  useEffect(()=>{
    function onKey(e){ 
      if(e.key === 'Escape') setOpen(false)
    }
    if(open) document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[open])

  useEffect(()=>{
    if(open && panelRef.current){
      // save previous focused element and move focus into panel
      prevFocusRef.current = document.activeElement
      const focusable = panelRef.current.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')
      const first = focusable && focusable[0]
      first ? first.focus() : panelRef.current.focus()
      } else if(!open && prevFocusRef.current){
      // restore focus when panel closes
      try{ prevFocusRef.current.focus() }catch(e){ void e }
    }
  },[open])

  // handle Tab trapping inside panel
  const onPanelKeyDown = (e) => {
    if(e.key !== 'Tab') return
    const el = panelRef.current
    if(!el) return
    const focusable = Array.from(el.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(n => !n.disabled && n.offsetParent !== null)
    if(focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if(e.shiftKey){
      if(document.activeElement === first){ e.preventDefault(); last.focus() }
    } else {
      if(document.activeElement === last){ e.preventDefault(); first.focus() }
    }
  }

  const _toggle = (k) => setPrefs(p => ({...p, [k]: !p[k]}))

  const reset = () => setPrefs({ highContrast:'none', grayscale:false, dyslexic:false, colorBlind:'none', textScale:100 })

  return (
    <>
      <button
        className="accessibility-fab"
        aria-expanded={open}
        aria-controls="accessibility-panel"
        aria-label="Accessibility options"
        onClick={()=>setOpen(v=>!v)}
      >
        ⚙️
      </button>

      {open && (
        <div id="accessibility-panel" ref={panelRef} className="accessibility-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-panel-title" onKeyDown={onPanelKeyDown} tabIndex={-1}>
          <h3 id="a11y-panel-title">Accessibility</h3>

          

          <div className="accessibility-row">
            <label style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
              <span style={{fontWeight:700, marginBottom:6}}>High contrast</span>
              <select aria-label="High contrast mode" value={prefs.highContrast} onChange={(e)=>setPrefs(p=>({...p,highContrast:e.target.value}))} style={{width:'160px',padding:8,borderRadius:8,border:'1px solid var(--md-sys-color-outline-variant)'}}>
                <option value="none">None</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
          </div>

          <div className="accessibility-row">
            <label style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
              <span style={{fontWeight:700, marginBottom:6}}>Text scale</span>
              <div style={{display:'flex',gap:8, alignItems:'center'}}>
                <input aria-label="Text scale" type="range" min="100" max="150" step="5" value={prefs.textScale} onChange={(e)=>setPrefs(p=>({...p,textScale: Number(e.target.value)}))} />
                <div style={{minWidth:48,textAlign:'right'}}>{prefs.textScale}%</div>
              </div>
            </label>
          </div>

          <div className="accessibility-row">
            <label><input type="checkbox" checked={prefs.grayscale} onChange={()=>setPrefs(p=>({...p,grayscale:!p.grayscale}))} /> <span>Grayscale</span></label>
          </div>

          <div className="accessibility-row">
            <label><input type="checkbox" checked={prefs.dyslexic} onChange={()=>setPrefs(p=>({...p,dyslexic:!p.dyslexic}))} /> <span>Dyslexic font</span></label>
          </div>

          <div className="accessibility-row" style={{flexDirection:'column',alignItems:'flex-start'}}>
            <label style={{fontWeight:700, marginBottom:6}}>Color-blind mode</label>
            <select aria-label="Color blind mode" value={prefs.colorBlind} onChange={(e)=>setPrefs(p=>({...p,colorBlind:e.target.value}))} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid var(--md-sys-color-outline-variant)'}}>
              <option value="none">None</option>
              <option value="protanopia">Protanopia (red-weak)</option>
              <option value="deuteranopia">Deuteranopia (green-weak)</option>
              <option value="tritanopia">Tritanopia (blue-weak)</option>
            </select>
          </div>

          <div className="accessibility-actions">
            <button className="btn" onClick={()=>{ reset(); setOpen(false) }}>Reset</button>
            <button className="btn primary" onClick={()=>setOpen(false)}>Done</button>
          </div>
          {/* aria-live region for screen readers (visually hidden) */}
          <div ref={liveRef} className="sr-only" aria-live="polite">{liveMessage}</div>
        </div>
      )}
    </>
  )
}

import React, { useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'
import Badge from '../components/ui/Badge'
import DetailHeader from '../components/ui/DetailHeader'
import DetailCard from '../components/ui/DetailCard'
import Topbar from '../components/navigation/Topbar'
import CameraCapture from '../components/ui/CameraCapture'
import UnitToggle from '../components/ui/UnitToggle'
import NutritionCard from '../components/nutrition/NutritionCard'
import { convertAmount, fmt, convertMgToOz } from '../helpers/units'

export default function ProductDetails(){
  const { id } = useParams()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const fridgeId = params.get('fridge')
  const [unitSystem, setUnitSystem] = useState(() => {
    try{ const v = localStorage.getItem('ep_unitSystem'); return v || 'metric' }catch{ return 'metric' }
  })
  const [showCamera, setShowCamera] = useState(false)
  const [localImage, setLocalImage] = useState(null)
  let item = mockProducts.find(p=>p.id===id)
  if (fridgeId) {
    try{
      const raw = localStorage.getItem('ep_fridges')
      const arr = raw ? JSON.parse(raw) : []
      const f = arr.find(x=>x.id===fridgeId)
      if (f && Array.isArray(f.items)){
        const localItem = f.items.find(x=>x.id===id)
        if (localItem) item = localItem
      }
    }catch(err){ void err }
  }
  if(!item) return (
    <div className="min-h-screen flex items-center justify-center">Product not found</div>
  )

  const today = new Date()
  const computeDays = (iso) => {
    if (!iso) return null
    const exp = new Date(iso + 'T00:00:00')
    return Math.ceil((exp - new Date(today.getFullYear(), today.getMonth(), today.getDate()))/(1000*60*60*24))
  }
  const days = computeDays(item.expires)
  const expiryText = days === null ? 'No expiration' : days < 0 ? `Expired ${Math.abs(days)}d ago` : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`
  const badgeBgVar = days === null ? 'var(--badge-neutral-bg)'
    : days < 0 ? 'var(--badge-danger-bg)'
    : days <= 3 ? 'var(--badge-soon-bg)'
    : 'var(--badge-fresh-bg)'
  const badgeColorVar = days === null ? 'var(--badge-neutral-color)'
    : days < 0 ? 'var(--badge-danger-color)'
    : days <= 3 ? 'var(--badge-soon-color)'
    : 'var(--badge-fresh-color)'

  const nutrition = item.nutrition || { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, sugar: 4.7, sodium: 44 }
  const displayImage = localImage || item.image

  return (
    <>
      {/* Desktop hero/banner to match fridge layout */}
      <div className="hero-banner desktop-only">
        <Topbar active="home" />
        <div className="hero-search-wrap">
          <div className="hero-search">{/* intentionally empty - keeps sizing consistent with Fridge page */}</div>
        </div>
      </div>

  <div className="min-h-screen flex items-start justify-center bg-ep-background px-4 py-6 hero-overlap">
        <section className="w-full" style={{maxWidth:1100}}>
          <div style={{display:'grid',gap:18}}>

            {/* Header card */}
            <DetailCard style={{boxShadow:'0 6px 18px rgba(11,22,28,0.06)'}}>
              <DetailHeader
                image={displayImage}
                title={item.name}
                subtitle={`${item.quantity} · ${item.category}`}
                badgeText={expiryText}
                badgeBg={badgeBgVar}
                badgeColor={badgeColorVar}
                meta={
                  <>
                    <div style={{padding:'6px 10px',borderRadius:16,background:'var(--badge-neutral-bg)',color:'var(--badge-neutral-color)',border:'1px solid var(--md-sys-color-outline-variant)'}}>Barcode: 5901234123457</div>
                    <div style={{padding:'6px 10px',borderRadius:16,background:'var(--badge-neutral-bg)',color:'var(--badge-neutral-color)',border:'1px solid var(--md-sys-color-outline-variant)'}}>Location: Fridge · Top shelf</div>
                  </>
                }
                actions={
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <button className="btn" onClick={()=>{/* edit stub - open edit UI */}} style={{background:'#f59e0b',color:'#fff',border:'none'}}>✎ Edit</button>
                    <button
                      className="btn"
                      onClick={()=>setShowCamera(true)}
                      aria-label="Open camera"
                      style={{display:'inline-flex',alignItems:'center',gap:8,background:'#2563eb',color:'#fff',border:'none',padding:'8px 14px',borderRadius:10}}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#ffffff"/>
                        <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" stroke="#ffffff" strokeWidth="0.5" fill="none"/>
                      </svg>
                      <span style={{fontWeight:700}}>Add / Take photo</span>
                    </button>
                  </div>
                }
              />
            </DetailCard>

            {showCamera && (
              <DetailCard>
                <CameraCapture onCapture={(dataUrl) => { setLocalImage(dataUrl); setShowCamera(false) }} onClose={() => setShowCamera(false)} />
              </DetailCard>
            )}

            <DetailCard>
              <NutritionCard nutrition={nutrition} unitSystem={unitSystem} onChange={setUnitSystem} perLabel="per 100 g" />
            </DetailCard>

            {/* Status card */}
            <DetailCard>
              <div style={{fontWeight:700,marginBottom:10}}>Status</div>
              <div style={{display:'grid',gap:8}}>
                <div><strong>Expiration</strong> <span style={{marginLeft:8,fontWeight:700}}>{expiryText}</span></div>
                <div><strong>Last seen</strong> <span style={{marginLeft:8}}>6 hours ago</span></div>
                <div><strong>Added on</strong> <span style={{marginLeft:8}}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '2025-10-05'}</span></div>
              </div>
            </DetailCard>

            {/* Notes card */}
            <DetailCard>
              <div style={{fontWeight:700,marginBottom:10}}>Notes</div>
              <div style={{color:'var(--md-sys-color-on-surface-variant)'}}>{(function convertNotes(s){
                if (!s) return ''
                try{
                  let out = String(s)
                  const convertTemp = (val, to) => {
                    const n = Number(String(val).replace(',', '.'))
                    if (!Number.isFinite(n)) return null
                    if (to === 'imperial') return Math.round((n * 9/5) + 32)
                    return Math.round((n - 32) * 5/9)
                  }
                  if (unitSystem === 'imperial'){
                    out = out.replace(/([0-9]+(?:[.,][0-9]+)?)\s*°?\s*(?:c|celsius)\b/gi, (m,p1)=>{
                      const f = convertTemp(p1, 'imperial')
                      return f == null ? m : `${f}°F`
                    })
                  } else {
                    out = out.replace(/([0-9]+(?:[.,][0-9]+)?)\s*°?\s*(?:f|fahrenheit)\b/gi, (m,p1)=>{
                      const c = convertTemp(p1, 'metric')
                      return c == null ? m : `${c}°C`
                    })
                  }
                  return out
                  }catch{ return s }
              })(item.notes)}</div>
            </DetailCard>

          </div>
        </section>
      </div>
    </>
  )
}

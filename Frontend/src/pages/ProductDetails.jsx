import React from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'
import Badge from '../components/ui/Badge'
import DetailHeader from '../components/ui/DetailHeader'
import DetailCard from '../components/ui/DetailCard'
import Topbar from '../components/navigation/Topbar'

export default function ProductDetails(){
  const { id } = useParams()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const fridgeId = params.get('fridge')
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
                image={item.image}
                title={item.name}
                subtitle={`${item.quantity} · ${item.category}`}
                badgeText={expiryText}
                badgeBg={badgeBgVar}
                badgeColor={badgeColorVar}
                meta={<>
                  <div style={{padding:'6px 10px',borderRadius:16,background:'var(--badge-neutral-bg)',color:'var(--badge-neutral-color)',border:'1px solid var(--md-sys-color-outline-variant)'}}>Barcode: 5901234123457</div>
                  <div style={{padding:'6px 10px',borderRadius:16,background:'var(--badge-neutral-bg)',color:'var(--badge-neutral-color)',border:'1px solid var(--md-sys-color-outline-variant)'}}>Location: Fridge · Top shelf</div>
                </>}
                actions={<button className="btn">Edit</button>}
              />
            </DetailCard>

            {/* Nutrition card */}
            <DetailCard>
              <div style={{fontWeight:700,marginBottom:10}}>Nutrition <span style={{fontWeight:600,color:'var(--md-sys-color-on-surface-variant)',fontSize:13,marginLeft:8}}>per 100 g</span></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Calories</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.calories} kcal</div>
                </div>
                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Protein</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.protein} g</div>
                </div>
                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Carbs</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.carbs} g</div>
                </div>

                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Fat</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.fat} g</div>
                </div>
                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Sugar</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.sugar} g</div>
                </div>
                <div style={{padding:12,borderRadius:10,background:'var(--badge-neutral-bg)'}}>
                  <div style={{fontSize:12,color:'var(--md-sys-color-on-surface-variant)'}}>Sodium</div>
                  <div style={{fontWeight:800,fontSize:18}}>{nutrition.sodium} mg</div>
                </div>
              </div>
              <div style={{marginTop:10,color:'var(--md-sys-color-on-surface-variant)'}}>Source: Open Food Facts · <a href="#">Update</a></div>
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
              <div style={{color:'var(--md-sys-color-on-surface-variant)'}}>{item.notes}</div>
            </DetailCard>

          </div>
        </section>
      </div>
    </>
  )
}

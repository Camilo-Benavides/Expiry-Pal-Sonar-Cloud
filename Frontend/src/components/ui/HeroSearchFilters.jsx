import React from 'react'

export default function HeroSearchFilters({
  query = '',
  onQueryChange = ()=>{},
  categories = null,
  category = null,
  onCategoryChange = ()=>{},
  ownerFilter = null,
  onOwnerChange = ()=>{},
  statusFilter = null,
  onStatusChange = ()=>{},
  showOwner = false,
  showStatus = false,
  placeholder = ''
}){
  return (
    <div className="hero-search-wrap">
      <div className="hero-search">
        <div className="textfield" style={{display:'flex',alignItems:'center',gap:8}}>
          <span aria-hidden>🔎</span>
          <input value={query} onChange={e=>onQueryChange(e.target.value)} placeholder={placeholder} style={{border:'none',outline:'none',flex:1,background:'transparent'}} />
        </div>

        {/* category filters (for recipes) */}
        {Array.isArray(categories) && (
          <div className="filters-grid" style={{marginTop:12, justifyContent:'center', zIndex:70}} aria-label="Filtro de categoría">
            {categories.map(c=> (
              <button key={c} className={`btn ${c===category ? 'chip-selected' : ''}`} onClick={()=>onCategoryChange(c)} style={{borderRadius:12}}>{c}</button>
            ))}
          </div>
        )}

        {/* owner/status filters (for fridge) */}
        {(showOwner || showStatus) && (
          <div style={{marginTop:12}}>
            {showOwner && (
              <div style={{marginTop:6}}>
                <div style={{marginBottom:8, fontWeight:700}}>Filter by owner</div>
                <div style={{display:'flex',gap:8,marginBottom:12}}>
                  {[['all','All'], ['mine','Mine'], ['community','Community'], ['others','Others'], ['unclaimed','Unclaimed']].map(([val,label]) => (
                    <button key={val} onClick={() => onOwnerChange(val)} className={`btn ${ownerFilter===val ? 'chip-selected' : ''}`}>{label}</button>
                  ))}
                </div>
              </div>
            )}

            {showStatus && (
              <>
                <div style={{marginTop:6, marginBottom:8, fontWeight:700}}>Filter by status</div>
                <div className="filters-grid" style={{marginTop:6}}>
                  {['All','Fresh','Soon','Expired','No expiration'].map(s => (
                    <button key={s} onClick={() => onStatusChange(s)} className={`btn ${statusFilter===s ? 'chip-selected' : ''}`} style={{fontWeight:700}}>{s}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

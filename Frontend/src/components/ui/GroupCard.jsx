import React from 'react'

export default function GroupCard({ icon, title, count, open, onToggle, children }){
  return (
    <div className="group-card card" style={{borderRadius:14,boxShadow:'0 8px 22px rgba(11,22,28,0.08)',overflow:'hidden',border:'1px solid rgba(15, 23, 20, 0.06)', position:'relative', zIndex:60}}>
      <button onClick={onToggle} aria-expanded={!!open} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:'transparent',border:'none',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontWeight:700}}>{icon} {title} <span style={{fontWeight:500,color:'var(--md-sys-color-on-surface-variant)',marginLeft:8}}>{count} items</span></div>
        <div style={{transform: open ? 'rotate(90deg)' : 'rotate(0deg)',transition:'transform .15s'}}>›</div>
      </button>
      {open && (
        <div className="group-items-grid" style={{padding:12}}>
          {children}
        </div>
      )}
    </div>
  )
}

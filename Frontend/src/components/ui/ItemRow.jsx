import React from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'

export default function ItemRow({ item, fridgeId, badge, onClaim, asLink = true }) {
  const content = (
    <div className="card item-row" style={{display:'flex',alignItems:'center',gap:12,padding:10,border:'1px solid var(--md-sys-color-outline-variant)',borderRadius:10,width:'100%'}}>
      <img src={item.image} alt={item.name} style={{width:56,height:56,borderRadius:8,objectFit:'cover'}}/>
      <div style={{flex:1}}>
        <div style={{fontWeight:700}}>{item.name}</div>
        <div style={{fontSize:13,color:'var(--md-sys-color-on-surface-variant)'}}>{item.quantity} · {item.category}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
        {badge && (
          <Badge bgVar={badge.bgVar || badge.bg} colorVar={badge.colorVar || badge.color} style={{fontSize:12,padding:'6px 8px',borderRadius:12}}>{badge.text}</Badge>
        )}
        {onClaim && (
          <button className="btn danger" onClick={(e)=>{e.preventDefault(); onClaim(item.id)}}>Claim as mine</button>
        )}
      </div>
    </div>
  )

  if (asLink) {
    return (
      <Link to={`/product/${item.id}?fridge=${fridgeId || ''}`} style={{textDecoration:'none',color:'inherit',display:'block',width:'100%'}}>
        {content}
      </Link>
    )
  }

  return content
}

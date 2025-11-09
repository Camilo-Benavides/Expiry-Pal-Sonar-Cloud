import React from 'react'
import Badge from './Badge'

export default function DetailHeader({
  image, 
  title,
  subtitle,
  meta,
  badgeText,
  badgeBg,
  badgeColor,
  children,
  actions
}){
  return (
    <div className="detail-header" style={{display:'flex',gap:12,alignItems:'center',WebkitBackdropFilter:'none',backdropFilter:'none',mixBlendMode:'normal',opacity:1,isolation:'isolate',position:'relative',zIndex:75}}>
    <div style={{width:72,height:72,display:'grid',placeItems:'center',borderRadius:12,overflow:'hidden',background:'var(--md-sys-color-surface-variant)'}}>
        {image && typeof image === 'string' && image.length > 3 && (image.startsWith('http') ? <img src={image} alt={title} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{fontSize:30}}>{image}</div>)}
      </div>

      <div style={{flex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <h1 style={{margin:0,fontSize:20,fontWeight:800}}>{title}</h1>
          {badgeText && <Badge bgVar={badgeBg} colorVar={badgeColor} style={{padding:'6px 10px',borderRadius:16,fontSize:13}}>{badgeText}</Badge>}
        </div>
        {subtitle && <div style={{marginTop:8,color:'var(--md-sys-color-on-surface-variant)'}}>{subtitle}</div>}
        {meta && <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>{meta}</div>}
        {children}
      </div>

      {actions && <div style={{marginLeft:'auto'}}>{actions}</div>}
    </div>
  )
}

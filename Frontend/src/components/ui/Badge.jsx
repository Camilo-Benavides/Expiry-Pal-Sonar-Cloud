import React from 'react'

export default function Badge({ children, bgVar, colorVar, className = '', style = {} }){
  const bg = bgVar || 'var(--badge-neutral-bg)'
  const color = colorVar || 'var(--badge-neutral-color)'
  return (
    <div className={`badge ${className}`} style={{ background: bg, color, ...style }}>{children}</div>
  )
}

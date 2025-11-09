import React from 'react'

export default function DetailCard({ children, className = '', style = {} }){
  const baseStyle = {
    padding: 16,
    borderRadius: 12,
    background: 'var(--md-sys-color-surface, #FFFFFF)',
    backgroundColor: 'var(--md-sys-color-surface, #FFFFFF)',
    boxShadow: '0 3px 8px rgba(11,22,28,0.04)',
    WebkitBackdropFilter: 'none',
    backdropFilter: 'none',
    mixBlendMode: 'normal',
    opacity: 1,
    isolation: 'isolate',
    position: 'relative',
    zIndex: 70,
    ...style
  }

  return (
    <div className={`card detail-card ${className}`} style={baseStyle}>
      {children}
    </div>
  )
}

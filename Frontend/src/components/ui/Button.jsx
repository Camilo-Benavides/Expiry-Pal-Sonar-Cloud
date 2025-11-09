/*
  Reusable button using Tailwind utilities and project tokens.
*/
import React from 'react'

export default function Button({ children, variant = 'primary', full = false, onClick, type = 'button' }) {
  const base = 'btn'
  const variants = {
    primary: 'primary',
    ghost: '',
    oauth: 'oauth'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || 'primary'} ${full ? 'full' : ''}`}
      style={{
        borderRadius: 'var(--radius-control)',
        padding: '0 var(--control-pad-x)',
        height: 'var(--control-height)',
        boxShadow: 'var(--shadow-1)'
      }}
    >
      {children}
    </button>
  )
}

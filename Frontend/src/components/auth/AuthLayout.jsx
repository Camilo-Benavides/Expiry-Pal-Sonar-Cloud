/*
  Simple centered auth card layout.
*/
import React from 'react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ep-background px-6">
      <section
        className="w-full max-w-md"
        style={{
          background: 'var(--md-sys-color-surface)',
          border: '1px solid var(--md-sys-color-outline-variant)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-2)',
          padding: '24px 16px'
        }}
      >
        {title && <h1 style={{ fontSize: 'var(--text-title)', margin: 0, fontWeight: 700 }}>{title}</h1>}
        {subtitle && <p className="p mb-4">{subtitle}</p>}
        <div className="space-y-3">{children}</div>
      </section>
    </main>
  )
}

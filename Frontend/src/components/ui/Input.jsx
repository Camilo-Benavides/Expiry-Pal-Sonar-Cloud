/*
  Small input wrapper used on auth forms.
*/
import React from 'react'

function IconFor({ id, type }) {
  // very small inline SVG icons
  if (id === 'email' || type === 'email') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 5.5C3 4.67157 3.67157 4 4.5 4H19.5C20.3284 4 21 4.67157 21 5.5V18.5C21 19.3284 20.3284 20 19.5 20H4.5C3.67157 20 3 19.3284 3 18.5V5.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 6.5L12 13L3 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (id === 'password' || type === 'password') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
  if (id === 'name' || id === 'fullname' || id === 'fullName') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 20c1.333-3 4.667-5 8-5s6.667 2 8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
  return null
}

export default function Input({ id, label, type = 'text', placeholder = '', value, onChange, autoComplete, icon, error }) {
  const hasIcon = Boolean(icon) || ['email','password','name','fullname','fullName'].includes(id) || ['email','password'].includes(type)

  return (
    <label className="block">
      <span className="block text-sm font-semibold text-ep-on-surface/70 mb-1">{label}</span>

      {/* textfield wrapper: keep layout but remove border so label stays borderless.
          Border is applied directly to the input element so only the field is outlined. */}
      <div
        className="textfield bg-ep-surface rounded-control shadow-ep-1"
        style={{
          padding: 0,
          minHeight: 'var(--control-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative'
        }}
      >
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full bg-transparent outline-none text-sm"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{
            padding: 'var(--textfield-pad-y) var(--textfield-pad-x)',
            paddingRight: 'calc(var(--textfield-pad-x) + 36px)',
            minHeight: 'var(--control-height)',
            border: error ? '1px solid #dc2626' : '1px solid var(--md-sys-color-outline-variant)',
            borderRadius: 'var(--radius-control)',
            boxSizing: 'border-box'
          }}
        />

        <span
          aria-hidden="true"
          className="textfield-icon"
          style={{
            display: hasIcon ? 'inline-flex' : 'none',
            position: 'absolute',
            right: 'var(--textfield-pad-x)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--md-sys-color-on-surface-variant)',
            pointerEvents: 'none'
          }}
        >
          {icon || <IconFor id={id} type={type} />}
        </span>
      </div>
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
    </label>
  )
}

/*
  Button for OAuth providers with icon slot.
*/
import React from 'react'

export default function OAuthButton({ children, icon, onClick }) {
  return (
    <button className="oauth-btn full" type="button" onClick={onClick}>
      <span className="oauth-icon" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </button>
  )
}

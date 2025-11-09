import React from 'react'
import OAuthButton from './OAuthButton'

export default function SocialAuth({ onGoogle, onFacebook, googleText = 'Sign in with Google', facebookText = 'Continue with Facebook' }){
  return (
    <>
      <div className="sep">or</div>

      <OAuthButton icon={<svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#EA4335" d="M533.5 278.4c0-18.5-1.7-36.3-4.9-53.6H272v101.5h146.9c-6.3 34-25 62.9-53.2 82.2v68h86.1c50.3-46.4 81.7-114.7 81.7-198.1z"/><path fill="#34A853" d="M272 544.3c72.9 0 134.1-24.1 178.8-65.8l-86.1-68c-23.9 16.1-54.7 25.7-92.7 25.7-71 0-131.2-47.9-152.7-112.1H31.9v70.3C76.3 488.5 169.1 544.3 272 544.3z"/><path fill="#4285F4" d="M119.3 324.1c-10.3-30.9-10.3-64.7 0-95.6V158.2H31.9c-41.9 83.8-41.9 183.9 0 267.7l87.4-101.8z"/><path fill="#FBBC05" d="M272 107.7c39.8-.6 77.7 13.5 106.8 40.1l79.8-79.8C405.9 24 344.7 0 272 0 169.1 0 76.3 55.8 31.9 158.2l87.4 70.3C140.8 155.3 201 107.7 272 107.7z"/></svg>} onClick={onGoogle}>{googleText}</OAuthButton>

      <OAuthButton icon={<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#1877F2"/><path fill="#ffffff" d="M13.6 8.4H15V6h-1.6C11.9 6 11 6.9 11 8.6V10H9v2h2v6h2.3v-6h1.9l.3-2h-2.2V8.9c0-.3.1-.5.6-.5z"/></svg>} onClick={onFacebook}>{facebookText}</OAuthButton>
    </>
  )
}

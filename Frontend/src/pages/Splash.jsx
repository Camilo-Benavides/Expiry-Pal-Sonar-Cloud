/*
  Splash screen component. Navigates to login after a short delay.
*/
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 1400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-ep-background p-6">
      <div className="text-center animate-fadeInUp">
        <div className="mx-auto w-[clamp(140px,25vw,280px)] shadow-ep-1">
          <Logo />
        </div>
        <div className="mt-6 text-4xl font-extrabold text-ep-on-surface">ExpiryPal</div>
        <div className="mt-2 text-sm text-ep-on-surface/85">Keep food fresh, save more, waste less.</div>
      </div>
    </div>
  )
}

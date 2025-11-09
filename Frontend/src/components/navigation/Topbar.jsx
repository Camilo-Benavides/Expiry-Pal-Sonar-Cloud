import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import AccessibilityButton from '../accessibility/AccessibilityButton'
import Logo from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ active='home' }){
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  return (
    <div
      className="hero-topbar"
      role="navigation"
      aria-label="Primary navigation"
      style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',minHeight:72}}
    >
      <Link to="/fridge" className="brand-fab" aria-label="ExpiryPal home">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:34,height:34,display:'block'}} aria-hidden>
            <Logo className="site-logo" ariaHidden={true} />
          </div>
          <div style={{fontWeight:800,color:'var(--md-sys-color-on-primary-container)'}}>ExpiryPal</div>
        </div>
      </Link>

      <div className="hero-topbar-inner" style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center'}}>
        <nav aria-label="Primary menu" style={{display:'flex',gap:8,alignItems:'center'}}>
          <Link to="/fridge"><Button variant={active==='home' ? 'ghost' : 'ghost'}>{'Home'}</Button></Link>
          <Link to="/recipes"><Button variant={active==='recipes' ? 'ghost' : 'ghost'}>{'Recipes'}</Button></Link>
          <Link to="#store"><Button variant={active==='store' ? 'ghost' : 'ghost'}>{'Shop'}</Button></Link>
          <div style={{position:'relative'}} ref={dropdownRef}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpen((v) => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v) }}
              style={{display:'inline-block'}}
            >
              <Button variant={'ghost'}>Account ▾</Button>
            </div>
            {open && (
              <div style={{position:'absolute',right:0,top:'calc(100% + 8px)',background:'var(--md-sys-color-surface)',border:'1px solid var(--md-sys-color-outline-variant)',borderRadius:10,boxShadow:'var(--shadow-2)',padding:10,minWidth:160}}> 
                <Link to="/settings" style={{display:'block',padding:'8px 10px',textDecoration:'none',color:'inherit'}}>Settings</Link>
                <button onClick={handleLogout} style={{display:'block',width:'100%',textAlign:'left',padding:'8px 10px',background:'transparent',border:'none',cursor:'pointer'}}>Logout</button>
                {!currentUser && (
                  <>
                    <Link to="/login" style={{display:'block',padding:'8px 10px',textDecoration:'none',color:'inherit'}}>Login</Link>
                    <Link to="/register" style={{display:'block',padding:'8px 10px',textDecoration:'none',color:'inherit'}}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

      </div>
      <div className="access-fab" style={{display:'flex',alignItems:'center',gap:8}}>
        <AccessibilityButton inline />
      </div>
    </div>
  )
}

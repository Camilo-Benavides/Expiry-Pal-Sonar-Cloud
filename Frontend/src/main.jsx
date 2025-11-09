import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import './styles/accessibility.css'
import './index.css'
import App from './App.jsx'
import BottomNav from './components/navigation/BottomNav'
import { AuthProvider } from './context/AuthContext'

try{
  const PREF_KEY = 'ep_accessibility_prefs'
  const raw = window.localStorage.getItem(PREF_KEY)
  if(raw){
    const prefs = JSON.parse(raw)
    const root = document.documentElement
    root.classList.remove('a11y--high-contrast-dark','a11y--high-contrast-light','a11y--grayscale','a11y--dyslexic-font','a11y--cb-protanopia','a11y--cb-deuteranopia','a11y--cb-tritanopia')

    if(prefs.highContrast === 'dark') root.classList.add('a11y--high-contrast-dark')
    if(prefs.highContrast === 'light') root.classList.add('a11y--high-contrast-light')

    prefs.grayscale ? root.classList.add('a11y--grayscale') : root.classList.remove('a11y--grayscale')
    prefs.dyslexic ? root.classList.add('a11y--dyslexic-font') : root.classList.remove('a11y--dyslexic-font')

    if(prefs.colorBlind && prefs.colorBlind !== 'none'){
      root.classList.add(`a11y--cb-${prefs.colorBlind}`)
    }

    if(prefs.textScale && typeof prefs.textScale === 'number'){
      root.style.fontSize = `${prefs.textScale}%`
    }
  }
}catch(e){ /* ignore parse errors */ }

try{
  const PREF_KEY = 'ep_accessibility_prefs'
  window.addEventListener('storage', (ev) => {
    if(!ev.key || ev.key !== PREF_KEY) return
    try{
      const prefs = ev.newValue ? JSON.parse(ev.newValue) : null
      const root = document.documentElement
      root.classList.remove('a11y--high-contrast-dark','a11y--high-contrast-light','a11y--grayscale','a11y--dyslexic-font','a11y--cb-protanopia','a11y--cb-deuteranopia','a11y--cb-tritanopia')
      if(prefs){
        if(prefs.highContrast === 'dark') root.classList.add('a11y--high-contrast-dark')
        if(prefs.highContrast === 'light') root.classList.add('a11y--high-contrast-light')
        prefs.grayscale ? root.classList.add('a11y--grayscale') : root.classList.remove('a11y--grayscale')
        prefs.dyslexic ? root.classList.add('a11y--dyslexic-font') : root.classList.remove('a11y--dyslexic-font')
        if(prefs.colorBlind && prefs.colorBlind !== 'none') root.classList.add(`a11y--cb-${prefs.colorBlind}`)
        if(prefs.textScale && typeof prefs.textScale === 'number') root.style.fontSize = `${prefs.textScale}%`
      } else {
        root.style.fontSize = ''
      }
    }catch(e){ /* ignore */ }
  })
}catch(e){ /* ignore */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <BottomNav />
    </AuthProvider>
  </StrictMode>,
)

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import FridgeCard from '../components/ui/FridgeCard'

export default function MyFridges() {
  const [fridges, setFridges] = useState([])
  

  useEffect(() => {
    try{
      const raw = localStorage.getItem('ep_fridges')
      setFridges(raw ? JSON.parse(raw) : [])
    }catch(err){ void err; setFridges([]) }
  }, [])

  const saveFridges = (arr) => {
    try{
      localStorage.setItem('ep_fridges', JSON.stringify(arr))
    }catch(err){ console.error('save fridges', err) }
    setFridges(arr)
  }

  const handleDelete = (id) => {
    const ok = window.confirm('Delete this fridge? This cannot be undone.')
    if (!ok) return
    const arr = fridges.filter(f => f.id !== id)
    saveFridges(arr)
  }

  const saveEdit = (id, name) => {
    const trimmed = (name || '').trim()
    if (!trimmed) return alert('Please enter a name')
    const arr = fridges.map(f => f.id === id ? { ...f, name: trimmed } : f)
    saveFridges(arr)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ep-background px-6">
      <section className="w-full max-w-2xl card">
        <div style={{display:'flex',gap:16,alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div>
            <h1 className="h1">My fridges</h1>
            <p className="p">Your fridges — create or join to start tracking items.</p>
          </div>
        </div>

        <div style={{display:'grid',gap:12}}>
          {fridges.length === 0 && (
            <div className="empty-banner">
              <div className="empty-banner-icon">🥶</div>
              <div>
                <div className="empty-banner-title">No fridges yet</div>
                <div className="empty-banner-desc">Add a fridge and link it with the code on the fridge.</div>
              </div>
            </div>
          )}

          {/* list existing fridges with edit/delete actions */}
          {fridges.map(f => (
            <FridgeCard key={f.id} fridge={f} onSave={saveEdit} onDelete={handleDelete} />
          ))}

          <div>
            <Link to="/add-fridge" className="add-fridge-card">
              <div className="add-fridge-left">
                <div className="add-fridge-icon">+</div>
                <div>
                  <div className="add-fridge-title">Add new fridge...</div>
                  <div className="add-fridge-sub">Create a fridge or join via code</div>
                </div>
              </div>
              <div className="add-fridge-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path d="M7 4.5 L16.5 12 L7 19.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

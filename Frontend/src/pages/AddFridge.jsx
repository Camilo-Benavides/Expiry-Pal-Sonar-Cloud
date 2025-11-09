import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function AddFridge() {
  const [createName, setCreateName] = useState('')
  const [created, setCreated] = useState(null)

  const [joinCode, setJoinCode] = useState('')
  

  const makeCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreate = (e) => {
    e && e.preventDefault()
    if (!createName.trim()) return alert('Please enter a name for the fridge')
    const code = makeCode()
    const id = `f_${Date.now().toString(36)}`
    const fridge = { id, name: createName.trim(), code, shareCode: true, createdAt: Date.now(), items: mockProducts }
    // Persist to localStorage
    try{
      const raw = localStorage.getItem('ep_fridges')
      const arr = raw ? JSON.parse(raw) : []
      arr.unshift(fridge)
      localStorage.setItem('ep_fridges', JSON.stringify(arr))
    }catch(err){ console.error('persist fridge',err) }
    setCreateName('')
    setCreated(fridge)
  }

  const handleCopy = async () => {
    if (!created) return
    try {
      await navigator.clipboard.writeText(created.code)
      alert('Code copied to clipboard')
    } catch (err) {
      alert(`Copy failed: ${err?.message || err}`)
    }
  }

  const handleJoin = (e) => {
    e && e.preventDefault()
    if (!joinCode.trim()) return alert('Please enter an invite code')
    alert(`Joining fridge with code: ${joinCode.trim()}`)
    setJoinCode('')
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-ep-background px-6 py-10">
      <section className="w-full max-w-md" style={{display:'grid',gap:18}}>

        {/* Back link */}
        <div>
          <Link to="/my-fridges" className="back-button" role="button" aria-label="Back to my fridges">
            <span className="back-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="18" height="18" aria-hidden="true" focusable="false">
                <path d="M15 4.5 L6.5 12 L15 19.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="back-text">Back</span>
          </Link>
        </div>

        {/* Create new fridge card */}
        <div className="card">
          <h1 className="h1">Create a new fridge</h1>
          <p className="p">Name it — the creator becomes <strong>Owner</strong>.</p>

          <form onSubmit={handleCreate} style={{marginTop:12, display:'grid', gap:10}}>
            <Input id="fridge-name" label="Fridge name" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="e.g., Home, Lab A" />

            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
              <div style={{width:'48%'}}>
                <Button type="button" onClick={handleCreate} variant="primary" full>Create</Button>
              </div>
            </div>

            {created && (
              <div style={{marginTop:12, border:'1px dashed var(--md-sys-color-outline-variant)', borderRadius:12, padding:12, background:'transparent'}}>
                <div style={{display:'flex',gap:12}}>
                  <div style={{width:64,height:64,borderRadius:12,background:'var(--md-sys-color-primary-container)',display:'grid',placeItems:'center'}}>🧊</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700}}>{`"${created.name}" created`}</div>
                    <div style={{marginTop:8}}>
                      <div style={{display:'inline-block', padding:'4px 8px', background:'var(--badge-neutral-bg)', borderRadius:8, fontSize:12, color:'var(--badge-neutral-color)'}}>Role: Owner (Master)</div>
                    </div>
                    <div style={{marginTop:8, fontSize:13, color:'var(--md-sys-color-on-surface-variant)'}}>Invite with code</div>
                    <div style={{marginTop:6, display:'flex',gap:8, alignItems:'center'}}>
                      <div style={{padding:'6px 10px', borderRadius:8, background:'var(--badge-neutral-bg)', border:'1px solid var(--md-sys-color-outline-variant)', fontWeight:700, color:'var(--badge-neutral-color)'}}>{created.code}</div>
                      <div style={{display:'flex',gap:8, marginLeft:'auto'}}>
                        <Button type="button" onClick={handleCopy}>Copy code</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Join a fridge card */}
        <div className="card">
          <h2 className="h1" style={{marginBottom:6}}>Join a fridge</h2>
          <p className="p">Or join with a code</p>

          <form onSubmit={handleJoin} style={{marginTop:12, display:'grid', gap:10}}>
            <Input id="invite-code" label="Invite code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Enter code (e.g., ABC123)" />

            <div style={{display:'flex',gap:8, justifyContent:'flex-end'}}>
              <div style={{width:'48%'}}>
                <Button type="button" onClick={handleJoin} variant="primary" full>Join with code</Button>
              </div>
            </div>


          </form>
        </div>

      </section>
    </div>
  )
}

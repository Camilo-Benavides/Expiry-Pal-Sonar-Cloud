import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* FridgeCard
   Renders a fridge list item with optional inline edit and delete actions.
*/
export default function FridgeCard({ fridge, onSave, onDelete, compact = false }){
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(fridge?.name || '')

  const startEdit = () => { setEditing(true); setName(fridge?.name || '') }
  const cancelEdit = () => { setEditing(false); setName(fridge?.name || '') }
  const saveEdit = () => {
    const trimmed = (name || '').trim()
    if (!trimmed) return alert('Please enter a name')
    onSave && onSave(fridge.id, trimmed)
    setEditing(false)
  }

  return (
    <div className="add-fridge-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
      <Link to={`/fridge/${fridge.id}`} style={{display:'flex',alignItems:'center',textDecoration:'none',color:'inherit',flex:1}} aria-label={`Open fridge ${fridge.name}`}>
        <div className="add-fridge-left">
          <div className="add-fridge-icon">🥶</div>
          <div>
            <div className="add-fridge-title">{fridge.name}</div>
            <div className="add-fridge-sub">Code: {fridge.code} · {fridge.shareCode ? 'Shareable' : 'Private'}</div>
          </div>
        </div>
      </Link>

      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {editing ? (
          <>
            <input aria-label="Edit fridge name" value={name} onChange={(e)=>setName(e.target.value)} style={{padding:8,borderRadius:8,border:'1px solid var(--md-sys-color-outline-variant)',minWidth:160}} />
            <button className="btn primary" onClick={saveEdit}>Save</button>
            <button className="btn" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={startEdit} aria-label={`Edit ${fridge.name}`}>Edit</button>
            <button className="btn" onClick={()=>onDelete && onDelete(fridge.id)} aria-label={`Delete ${fridge.name}`} style={{background:'transparent',border:'1px solid var(--md-sys-color-outline-variant)'}}>Delete</button>
          </>
        )}
      </div>
    </div>
  )
}

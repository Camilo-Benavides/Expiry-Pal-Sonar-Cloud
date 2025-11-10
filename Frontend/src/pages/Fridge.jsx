import React, { useMemo, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'
import Input from '../components/ui/Input'
import GroupCard from '../components/ui/GroupCard'
import ItemRow from '../components/ui/ItemRow'
import Topbar from '../components/navigation/Topbar'
import HeroSearchFilters from '../components/ui/HeroSearchFilters'

export default function Fridge() {
  const [query, setQuery] = useState('')
  const [category, _setCategory] = useState('All')
  // ownerFilter is a list of selected owner filters; empty = All
  const [ownerFilter, setOwnerFilter] = useState([]) // e.g. ['mine','community']
  // statusFilter is an array of selected statuses; empty = All
  const [statusFilter, setStatusFilter] = useState([]) // e.g. ['Fresh','Soon','Expired']

  const _categories = useMemo(() => {
    const cats = new Set(mockProducts.map(p => p.category))
    return ['All', ...Array.from(cats)]
  }, [])

  // determine current fridge by id param or fallback to first persisted fridge
  const { id: fridgeId } = useParams()
  const [fridge, setFridge] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('ep_fridges')
      const arr = raw ? JSON.parse(raw) : []
      const found = fridgeId ? arr.find(f=>f.id===fridgeId) : arr[0]
      setFridge(found || null)
  }catch(err){ void err; setFridge(null) }
  }, [fridgeId])

  // If there's a persisted fridge with items, augment it with some mock products
  // (my items and community items) so the UI shows more examples while using mocks.
  let itemsSource = mockProducts
  if (fridge && Array.isArray(fridge.items) && fridge.items.length > 0) {
    try{
      const existingIds = new Set(fridge.items.map(i => i.id))
      // pick mock products that are either owned by 'me' or shared by community and not already present
      const extras = mockProducts.filter(p => !existingIds.has(p.id) && (p.owner === 'me' || p.isCommunity))
      // append extras after the fridge items so user items remain first
      itemsSource = [...fridge.items, ...extras]
    }catch(err){
      // fallback to fridge items if something goes wrong
      itemsSource = fridge.items
    }
  }

  const matchesQuery = (p) => {
    if (!query) return true
    return (`${p.name} ${p.category} ${p.notes}`.toLowerCase().includes(query.toLowerCase()))
  }

  const byCategory = (p) => category === 'All' ? true : p.category === category

  const filterOwner = (p) => {
    // empty selection === All
    if (!Array.isArray(ownerFilter) || ownerFilter.length === 0) return true
    for (const s of ownerFilter) {
      if ((s === 'mine' || s === 'my') && p.owner === 'me') return true
      if ((s === 'community' || s === 'communitary') && p.isCommunity) return true
      if (s === 'others' && p.owner && p.owner !== 'me' && !p.isCommunity && p.owner !== 'unclaimed') return true
      if (s === 'unclaimed' && (!p.owner || p.owner === 'unclaimed')) return true
      if (s === 'all') return true
    }
    return false
  }

  const filterStatus = (p) => {
    // empty selection === All
    if (!Array.isArray(statusFilter) || statusFilter.length === 0) return true
    // if any selected status matches the item's status, include it
    for (const s of statusFilter) {
      if (s === 'Fresh' && p._status === 'fresh') return true
      if (s === 'Soon' && (p._status === 'soon' || p._status === 'today')) return true
      if (s === 'Expired' && p._status === 'expired') return true
      if (s === 'No expiration' && p._status === 'no-expiration') return true
      if (s === 'All') return true
    }
    return false
  }

  const enrich = (p) => {
    const today = new Date()
    let days = null
    let status = 'no-expiration'
    if (p.expires) {
      const exp = new Date(p.expires + 'T00:00:00')
      const diff = Math.ceil((exp - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000*60*60*24))
      days = diff
      if (diff < 0) status = 'expired'
      else if (diff === 0) status = 'today'
      else if (diff <= 4) status = 'soon' 
      else status = 'fresh'
    }
    return {...p, _days: days, _status: status}
  }

  const toggleStatusFilter = (s) => {
    // clicking 'All' clears all other selections
    if (s === 'All') { setStatusFilter([]); return }
    setStatusFilter(prev => {
      const arr = Array.isArray(prev) ? [...prev] : []
      const idx = arr.indexOf(s)
      if (idx !== -1) {
        arr.splice(idx, 1)
      } else {
        arr.push(s)
      }
      return arr
    })
  }

  const toggleOwnerFilter = (v) => {
    // clicking 'all' clears selections
    if (v === 'all') { setOwnerFilter([]); return }
    setOwnerFilter(prev => {
      const arr = Array.isArray(prev) ? [...prev] : []
      const idx = arr.indexOf(v)
      if (idx !== -1) arr.splice(idx, 1)
      else arr.push(v)
      return arr
    })
  }

  const items = useMemo(() => {
    return itemsSource.map(enrich).filter(p => filterOwner(p) && byCategory(p) && filterStatus(p) && matchesQuery(p))
  }, [itemsSource, query, category, ownerFilter, statusFilter])

  const communityItems = items.filter(p => p.isCommunity)
  const myItems = items.filter(p => p.owner === 'me')
  const unclaimedItems = items.filter(p => !p.owner || p.owner === 'unclaimed')
  const othersItems = items.filter(p => p.owner && p.owner !== 'me' && !p.isCommunity && p.owner !== 'unclaimed')

  const [openGroups, setOpenGroups] = useState({ community: true, my: true, others: false, unclaimed: false })
  const toggleGroup = (name) => setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }))

  const saveFridgeItems = (newItems) => {
    if (!fridge) return
    try{
      const raw = localStorage.getItem('ep_fridges')
      const arr = raw ? JSON.parse(raw) : []
      const idx = arr.findIndex(f => f.id === fridge.id)
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], items: newItems }
        localStorage.setItem('ep_fridges', JSON.stringify(arr))
        setFridge(arr[idx])
      }
    }catch(err){ console.error('save fridge items',err) }
  }

  const claimItem = (itemId) => {
    if (!fridge) return alert('Cannot claim item: fridge not found')
    const newItems = (fridge.items || []).map(it => it.id === itemId ? { ...it, owner: 'me' } : it)
    saveFridgeItems(newItems)
  }

  const formatBadge = (p) => {
    if (p._status === 'no-expiration') return { text: 'No expiration', tone: 'neutral', bgVar: 'var(--badge-neutral-bg)', colorVar: 'var(--badge-neutral-color)' }
    if (p._status === 'expired') {
      const d = p._days != null ? Math.abs(p._days) : null
      return { text: d == null ? 'Expired' : `Expired ${d}d ago`, tone: 'danger', bgVar: 'var(--badge-danger-bg)', colorVar: 'var(--badge-danger-color)' }
    }
    if (p._status === 'today') return { text: 'Today', tone: 'soon', bgVar: 'var(--badge-soon-bg)', colorVar: 'var(--badge-soon-color)' }
    if (p._status === 'soon') return { text: p._days === 1 ? '1 day' : `${p._days} days`, tone: 'soon', bgVar: 'var(--badge-soon-bg)', colorVar: 'var(--badge-soon-color)' }
    return { text: `In ${p._days} days`, tone: 'fresh', bgVar: 'var(--badge-fresh-bg)', colorVar: 'var(--badge-fresh-color)' }
  }

  return (
    <>
      {/* Desktop hero/banner with topbar + centered search (hidden on mobile) */}
      <div className="hero-banner desktop-only">
        <Topbar active="home" />
        <div style={{padding:0}}>
          {/* Reusable hero search + filters component */}
          <HeroSearchFilters
            query={query}
            onQueryChange={setQuery}
            showOwner={true}
            onOwnerChange={toggleOwnerFilter}
            ownerFilter={ownerFilter}
            showStatus={true}
            onStatusChange={toggleStatusFilter}
            statusFilter={statusFilter}
            placeholder="Search items, categories..."
          />
        </div>
      </div>

      <div className="min-h-screen flex items-start justify-center bg-ep-background px-6 py-6">
        <section className="w-full max-w-6xl mx-auto">

          {/* Mobile compact search (shown only on small screens) */}
          <div className="mobile-only" style={{marginBottom:12}}>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{flex:1}}>
                <Input id="fridge-search-mobile" label="Search" placeholder="Search items, categories..." value={query} onChange={(e)=>setQuery(e.target.value)} />
              </div>
            </div>

            <div>
              <div style={{fontWeight:700,marginBottom:8}}>Filter by owner</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[
                  ['all','All'], ['mine','Mine'], ['community','Community'], ['others','Others'], ['unclaimed','Unclaimed']
                ].map(([val,label]) => {
                  const selected = Array.isArray(ownerFilter) ? (ownerFilter.length === 0 && val === 'all') || ownerFilter.includes(val) : ownerFilter === val
                  return (
                    <button key={val} onClick={() => toggleOwnerFilter(val)} className={`btn ${selected ? 'chip-selected' : ''}`}>{label}</button>
                  )
                })}
              </div>
            </div>

            <div>
              <div style={{fontWeight:700,marginTop:8,marginBottom:8}}>Filter by status</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['All','Fresh','Soon','Expired','No expiration'].map(s => (
                  <button key={s} onClick={() => toggleStatusFilter(s)} className={`btn ${((Array.isArray(statusFilter) && statusFilter.length===0 && s==='All') || (Array.isArray(statusFilter) && statusFilter.includes(s))) ? 'chip-selected' : ''}`} style={{fontWeight:700}}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* desktop hero handled above — hidden on mobile */}

        <div className="cards-stage">
          {/* groups — render each as a collapsible block */}
          <div style={{display:'grid',gap:16}}>
          {communityItems.length > 0 && (
            <GroupCard icon={'🏠'} title={'Community items'} count={communityItems.length} open={openGroups.community} onToggle={()=>toggleGroup('community')}>
              {communityItems.map(item => (
                <ItemRow key={item.id} item={item} fridgeId={fridge ? fridge.id : ''} badge={formatBadge(item)} />
              ))}
            </GroupCard>
          )}

          {myItems.length > 0 && (
            <GroupCard icon={'👤'} title={'My items'} count={myItems.length} open={openGroups.my} onToggle={()=>toggleGroup('my')}>
              {myItems.map(item => (
                <ItemRow key={item.id} item={item} fridgeId={fridge ? fridge.id : ''} badge={formatBadge(item)} />
              ))}
            </GroupCard>
          )}

          {othersItems.length > 0 && (
            <GroupCard icon={'🔒'} title={`Others' items`} count={othersItems.length} open={openGroups.others} onToggle={()=>toggleGroup('others')}>
              {othersItems.map(item => (
                <ItemRow key={item.id} item={item} fridgeId={fridge ? fridge.id : ''} badge={formatBadge(item)} asLink={false} />
              ))}
            </GroupCard>
          )}

          {unclaimedItems.length > 0 && (
            <GroupCard icon={'❓'} title={'Unclaimed items'} count={unclaimedItems.length} open={openGroups.unclaimed} onToggle={()=>toggleGroup('unclaimed')}>
              {unclaimedItems.map(item => (
                <ItemRow key={item.id} item={item} fridgeId={fridge ? fridge.id : ''} badge={formatBadge(item)} onClaim={claimItem} asLink={false} />
              ))}
            </GroupCard>
          )}

          {items.length === 0 && (
            <div className="card">No items found.</div>
          )}
        
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

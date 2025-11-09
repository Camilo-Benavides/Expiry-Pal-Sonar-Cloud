import React from 'react'
export default function BottomNav(){
  return (
    <nav className="bottom-nav" aria-label="Primary bottom navigation">
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,alignItems:'center'}}>
        <a href="/fridge" style={{display:'grid',placeItems:'center',padding:10,textDecoration:'none'}}>🧊<div style={{fontSize:11}}>Fridge</div></a>
        <a href="/recipes" style={{display:'grid',placeItems:'center',padding:10,textDecoration:'none'}}>🍲<div style={{fontSize:11}}>Recipes</div></a>
        <a href="/store" style={{display:'grid',placeItems:'center',padding:10,textDecoration:'none'}}>🛒<div style={{fontSize:11}}>Shop</div></a>
        <a href="/account" style={{display:'grid',placeItems:'center',padding:10,textDecoration:'none'}}>👤<div style={{fontSize:11}}>Account</div></a>
      </div>
    </nav>
  )
}

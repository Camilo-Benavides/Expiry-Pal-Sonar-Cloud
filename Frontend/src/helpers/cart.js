export function getCart() {
  try {
    const raw = localStorage.getItem('ep_cart')
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem('ep_cart', JSON.stringify(cart))
  } catch (e) {}
}

export function addOrMergeItem(item) {
  const cart = getCart()
  const idx = cart.findIndex(c => String(c.name || '').toLowerCase() === String(item.name || '').toLowerCase())
  if (idx === -1) {
    cart.push(item)
  } else {
    const existing = cart[idx]
    if (existing.qty != null && item.qty != null && existing.unit === item.unit) {
      existing.qty = Number(existing.qty) + Number(item.qty)
    } else {
      existing.note = ((existing.note || '') + '; ' + (item.original || '')).trim()
    }
  }
  saveCart(cart)
  return cart
}

export function addMany(items) {
  const cart = getCart()
  for (const item of items) {
    const idx = cart.findIndex(c => String(c.name || '').toLowerCase() === String(item.name || '').toLowerCase())
    if (idx === -1) cart.push(item)
    else {
      const existing = cart[idx]
      if (existing.qty != null && item.qty != null && existing.unit === item.unit) existing.qty = Number(existing.qty) + Number(item.qty)
      else existing.note = ((existing.note || '') + '; ' + (item.original || '')).trim()
    }
  }
  saveCart(cart)
  return cart
}

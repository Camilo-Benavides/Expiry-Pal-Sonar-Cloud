import React from 'react'

export default function FormError({ message }){
  if (!message) return null
  return (
    <div className="text-sm text-red-600" role="alert">{message}</div>
  )
}

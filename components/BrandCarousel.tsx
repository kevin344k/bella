"use client"

import React from 'react'

const brands = [
  { id: 'yanbal', name: 'Yanbal', logo: '/brands/yanbal.svg' },
  { id: 'cyzone', name: 'Cyzone', logo: '/brands/cyzone.svg' },
  { id: 'avon', name: 'Avon', logo: '/brands/avon.svg' }
]

export default function BrandCarousel(){
  return (
    <div className="flex gap-6 items-center overflow-x-auto py-4">
      {brands.map(b => (
        <div key={b.id} className="token-glass p-6 rounded-xl-24 min-w-[180px] flex items-center justify-center hover:scale-105 transition-transform token-shadow">
          <img src={b.logo} alt={b.name} className="h-12 object-contain" />
        </div>
      ))}
    </div>
  )
}

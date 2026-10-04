"use client"

import React, { useState } from 'react'

type Item = { id: string; title: string; image: string }

const sample: Item[] = [
  { id: 'm1', title: 'Shelf A', image: '/furn-1.svg' },
  { id: 'm2', title: 'Table B', image: '/furn-2.svg' },
  { id: 'm3', title: 'Console C', image: '/furn-3.svg' },
  { id: 'm4', title: 'Repisa D', image: '/furn-4.svg' },
  { id: 'm5', title: 'Chair E', image: '/furn-5.svg' }
]

export default function MasonryGallery() {
  const [open, setOpen] = useState<Item | null>(null)

  return (
    <div>
      <div className="masonry-columns px-4">
        {sample.map((it) => (
          <div key={it.id} className="masonry-item glass-card rounded-xl-24 overflow-hidden mb-4 cursor-pointer" onClick={() => setOpen(it)}>
            <img src={it.image} alt={it.title} className="w-full h-auto object-cover" />
            <div className="p-4">
              <div className="font-medium">{it.title}</div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(null)}>
          <div className="max-w-4xl w-full bg-white rounded-xl-24 overflow-hidden mx-4">
            <img src={open.image} alt={open.title} className="w-full h-[70vh] object-cover" />
            <div className="p-6">
              <h4 className="text-xl font-semibold">{open.title}</h4>
              <p className="mt-2 text-sm">Detailed description placeholder. Smooth zoom and product metadata can be added here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

type Item = {
  id: string
  title: string
  image: string
}

const sampleItems: Item[] = [
  { id: '1', title: 'Modern Shelf', image: '/furn-1.svg' },
  { id: '2', title: 'Elegant Table', image: '/furn-2.svg' },
  { id: '3', title: 'Rose Console', image: '/furn-3.svg' },
  { id: '4', title: 'Luxury Repisa', image: '/furn-4.svg' }
]

export default function Showroom() {
  const [open, setOpen] = useState<Item | null>(null)

  return (
    <section className="py-12">
      <h3 className="text-2xl font-semibold mb-6">Furniture Showroom</h3>
      <Swiper modules={[Autoplay, Navigation]} spaceBetween={24} slidesPerView={'auto'} centeredSlides loop autoplay={{ delay: 3500 }} navigation>
        {sampleItems.map((it) => (
          <SwiperSlide key={it.id} style={{ width: 320 }}>
            <div className="rounded-xl-24 overflow-hidden glass-card cursor-pointer" onClick={() => setOpen(it)}>
              <img src={it.image} alt={it.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <div className="font-medium">{it.title}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8">
        <h4 className="text-lg mb-4">Gallery</h4>
        {/* Masonry gallery fallback if many items */}
        <div className="glass-card p-4 rounded-xl-24">
          <div className="p-2">
            {/* MasonryGallery is a separate component; lazy load not implemented here to keep example simple */}
            <div className="masonry-columns">
              {sampleItems.concat(sampleItems).map((it, idx) => (
                <div key={it.id + '-' + idx} className="masonry-item rounded-xl-24 overflow-hidden mb-4 cursor-pointer" onClick={() => setOpen(it)}>
                  <img src={it.image} alt={it.title} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(null)}>
          <div className="max-w-4xl w-full bg-white rounded-xl-24 overflow-hidden mx-4">
            <img src={open.image} alt={open.title} className="w-full h-[70vh] object-cover" />
            <div className="p-6">
              <h4 className="text-xl font-semibold">{open.title}</h4>
              <p className="mt-2 text-sm text-gray-600">Premium details and description placeholder.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

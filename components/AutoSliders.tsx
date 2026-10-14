"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

export default function AutoSliders(){
  const promos = [
    { id: 'p1', title: 'Autumn Glow', subtitle: 'New campaign — limited edition', image: '/promo-1.svg' },
    { id: 'p2', title: 'Rose Gold Nights', subtitle: 'Exclusive sets', image: '/promo-2.svg' }
  ]

  return (
    <div className="space-y-12">
      <section>
        <h4 className="text-lg mb-4">Promotions</h4>
        <Swiper modules={[Autoplay, Navigation]} loop autoplay={{ delay: 5000 }} slidesPerView={1} spaceBetween={10}>
          {promos.map(p => (
            <SwiperSlide key={p.id}>
              <div className="rounded-xl-36 overflow-hidden relative h-64 glass-card flex items-end p-6" style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover' }}>
                <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm">{p.subtitle}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  )
}

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

  const featured = [
    { id: 'f1', name: 'Perfume Temptation', brand: 'Yanbal', image: '/prod-1.svg' },
    { id: 'f2', name: 'Blush Satin', brand: 'Cyzone', image: '/prod-2.svg' }
  ]

  const testimonials = [
    { id: 't1', text: 'Love the quality and the boutique touch.', author: 'Ana R.' },
    { id: 't2', text: 'I feel glamorous every time I use it.', author: 'María G.' }
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

      <section>
        <h4 className="text-lg mb-4">Featured Products</h4>
        <Swiper modules={[Autoplay, Navigation]} spaceBetween={16} slidesPerView={'auto'} loop autoplay={{ delay: 3500 }}>
          {featured.map(f => (
            <SwiperSlide key={f.id} style={{ width: 260 }}>
              <div className="glass-card rounded-xl-24 overflow-hidden">
                <img src={f.image} alt={f.name} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-sm text-gray-600">{f.brand}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section>
        <h4 className="text-lg mb-4">Testimonials</h4>
        <Swiper slidesPerView={1} loop autoplay={{ delay: 6000 }}>
          {testimonials.map(t => (
            <SwiperSlide key={t.id}>
              <div className="p-6 glass-card rounded-xl-24">
                <div className="italic">“{t.text}”</div>
                <div className="mt-3 font-semibold">{t.author}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  )
}

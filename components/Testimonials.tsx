"use client"

import React, { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  { text: 'Pedí mi perfume por la web y llegó perfecto. La atención por WhatsApp fue rapidísima y muy amable.', name: 'Ana Rodríguez', city: 'Quito' },
  { text: 'Me encanta poder ver los catálogos completos y escoger con calma. Siempre encuentro ofertas que valen la pena.', name: 'María Gabriela', city: 'Guayaquil' },
  { text: 'Compré un mueble para mi cuarto y quedó hermoso. Excelente calidad y entrega a tiempo.', name: 'Daniela Paredes', city: 'Cuenca' },
  { text: 'Mi tienda favorita para regalos. Todo viene bien presentado y los precios son justos.', name: 'Carolina Mejía', city: 'Ambato' },
]

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  return (
    <section
      id="testimonios"
      className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-rose-50/60 py-16 sm:py-24 px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span aria-hidden className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-[16rem] leading-none text-rose-200/50 select-none">“</span>
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-rose-600 font-semibold">Lo que dicen de nosotras</p>

        <div className="mt-8 grid">
          {TESTIMONIALS.map((t, idx) => (
            <figure
              key={t.name}
              aria-hidden={idx !== i}
              className={`col-start-1 row-start-1 transition-all duration-700 ${idx === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
            >
              <div className="flex justify-center gap-1 text-amber-400" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <blockquote className="mt-6 font-serif text-2xl sm:text-3xl leading-snug text-stone-800">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-rose-400 to-amber-200 font-serif text-lg font-bold text-white">{t.name[0]}</span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-stone-900">{t.name}</span>
                  <span className="block text-xs text-stone-500">{t.city}, Ecuador</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {TESTIMONIALS.map((t, idx) => (
            <button key={t.name} onClick={() => setI(idx)} aria-label={`Ver testimonio ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${idx === i ? 'w-8 bg-rose-600' : 'w-2 bg-rose-200 hover:bg-rose-300'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

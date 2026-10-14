"use client"

import React, { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { useProducts } from './useProducts'

export default function OfertasCarousel() {
  const { products } = useProducts()
  const ref = useRef<HTMLDivElement>(null)
  const ofertas = products.filter((p) => p.onSale)
  if (!ofertas.length) return null

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-rose-600 font-semibold">Por tiempo limitado</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900">Ofertas</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} aria-label="Anterior" className="p-2 rounded-full border border-stone-300 hover:border-stone-900 transition"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => scroll(1)} aria-label="Siguiente" className="p-2 rounded-full border border-stone-300 hover:border-stone-900 transition"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ofertas.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[62%] sm:w-[38%] md:w-[30%] lg:w-[23%]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/ofertas" className="inline-flex items-center gap-2 rounded-full bg-rose-700 text-white px-7 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-rose-800 transition">
          Ver todas las ofertas
        </Link>
      </div>
    </section>
  )
}

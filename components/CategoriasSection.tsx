"use client"

import React, { useState } from 'react'
import { CATEGORIES, CategorySlug } from '../lib/categories'
import ProductCard from './ProductCard'
import { SkeletonGrid } from './ProductSkeleton'
import { useProducts } from './useProducts'

export default function CategoriasSection() {
  const { products, loading } = useProducts()
  const [active, setActive] = useState<CategorySlug | 'todo'>('todo')
  const count = (slug: string) => products.filter((p) => p.category === slug).length
  const shown = active === 'todo' ? products : products.filter((p) => p.category === active)

  if (!loading && !products.length) return null

  return (
    <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 scroll-mt-24">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-rose-600 font-semibold">Explora</p>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900">Categorías</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        {[{ slug: 'todo' as const, label: 'Todo' }, ...CATEGORIES].map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-2xl border px-4 py-3 sm:py-5 text-left transition ${active === c.slug ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'bg-white border-rose-100 hover:border-rose-300'}`}
          >
            <span className="block font-serif text-xl">{c.label}</span>
            <span className={`text-xs ${active === c.slug ? 'text-stone-300' : 'text-stone-500'}`}>{c.slug === 'todo' ? products.length : count(c.slug)} productos</span>
          </button>
        ))}
      </div>
      {loading ? (
        <SkeletonGrid />
      ) : shown.length === 0 ? (
        <p className="text-stone-500 text-sm py-10 text-center">Pronto tendremos productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {shown.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </section>
  )
}

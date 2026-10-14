"use client"

import React from 'react'
import Link from 'next/link'
import ProductCard from '../../components/ProductCard'
import { SkeletonGrid } from '../../components/ProductSkeleton'
import { useProducts } from '../../components/useProducts'

export default function OfertasPage() {
  const { products, loading } = useProducts()
  const ofertas = products.filter((p) => p.onSale)
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[70vh]">
      <Link href="/" className="text-sm text-stone-500 hover:text-rose-700">← Volver al inicio</Link>
      <h1 className="mt-3 mb-8 text-4xl font-serif font-semibold text-stone-900">Todas las ofertas</h1>
      {!loading && ofertas.length === 0 && <p className="text-stone-500">No hay ofertas por ahora.</p>}
      {loading ? <SkeletonGrid /> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {ofertas.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>}
    </main>
  )
}

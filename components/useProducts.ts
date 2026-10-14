"use client"

import { useEffect, useState } from 'react'
import type { Product } from '../lib/backend'

export const imgSrc = (p: string) => (p ? (p.startsWith('/uploads/') ? `/api/img?p=${encodeURIComponent(p)}` : p) : '')
export const money = (n: number) => `$${n.toFixed(2)}`

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  return { products, loading }
}

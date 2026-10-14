"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ShoppingCart, X, Check, ZoomIn } from 'lucide-react'
import type { Product } from '../lib/backend'
import { categoryLabel } from '../lib/categories'
import { useCartStore } from '../store/useCartStore'
import { imgSrc, money } from './useProducts'

function AddButton({ p, className = '', onAdded }: { p: Product; className?: string; onAdded?: () => void }) {
  const add = useCartStore((s) => s.add)
  const [done, setDone] = useState(false)
  const soldOut = p.stock <= 0

  const click = (e: React.MouseEvent) => {
    e.stopPropagation()
    add({ id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock })
    setDone(true)
    setTimeout(() => setDone(false), 1400)
    onAdded?.()
  }

  return (
    <button
      disabled={soldOut}
      onClick={click}
      aria-label={`Agregar ${p.name} al carrito`}
      className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition active:scale-95 disabled:opacity-40 ${done ? 'bg-emerald-600' : 'bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-800 hover:to-rose-700 shadow-md shadow-rose-900/20'} ${className}`}
    >
      {done ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      <span>{soldOut ? 'Agotado' : done ? 'Agregado' : 'Añadir'}</span>
    </button>
  )
}

function Price({ p, big = false }: { p: Product; big?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${big ? 'text-3xl' : 'text-base sm:text-lg'} font-semibold text-stone-900`}>{money(p.price)}</span>
      {p.onSale && p.oldPrice && <span className={`${big ? 'text-lg' : 'text-xs sm:text-sm'} text-stone-400 line-through`}>{money(p.oldPrice)}</span>}
    </div>
  )
}

function Modal({ p, discount, onClose }: { p: Product; discount: number; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', key)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = prev }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={p.name}>
      <div onClick={onClose} className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl grid sm:grid-cols-2">
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 shadow hover:bg-white"><X className="w-5 h-5" /></button>
        <div className="relative bg-stone-50 sm:min-h-[460px]">
          {p.image && <img src={imgSrc(p.image)} alt={p.name} className="w-full h-full max-h-[55vh] sm:max-h-none object-contain sm:object-cover" />}
          {p.onSale && <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{discount ? `-${discount}%` : 'OFERTA'}</span>}
        </div>
        <div className="p-6 sm:p-8 flex flex-col">
          <span className="text-xs uppercase tracking-widest text-rose-600 font-semibold">{categoryLabel(p.category)}{p.brand ? ` · ${p.brand}` : ''}</span>
          <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-stone-900 leading-tight">{p.name}</h3>
          <div className="mt-4"><Price p={p} big /></div>
          {p.description && <p className="mt-4 text-stone-600 leading-7 text-sm sm:text-base">{p.description}</p>}
          <p className={`mt-4 text-sm ${p.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {p.stock > 0 ? (p.stock <= 5 ? `¡Quedan solo ${p.stock} unidades!` : 'Disponible') : 'Agotado'}
          </p>
          <AddButton p={p} className="mt-6 py-3.5 text-base w-full" onAdded={() => setTimeout(onClose, 500)} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function ProductCard({ p }: { p: Product }) {
  const [open, setOpen] = useState(false)
  const discount = p.onSale && p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
  const soldOut = p.stock <= 0

  return (
    <>
      <article className="group h-full bg-white rounded-2xl overflow-hidden border border-rose-100/70 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col">
        <button type="button" onClick={() => setOpen(true)} aria-label={`Ver ${p.name} en grande`} className="relative aspect-square bg-stone-50 overflow-hidden block w-full cursor-zoom-in">
          {p.image && <img src={imgSrc(p.image)} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
          {p.onSale && <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-rose-600 text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">{discount ? `-${discount}%` : 'OFERTA'}</span>}
          <span className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 text-stone-700 opacity-0 group-hover:opacity-100 transition hidden sm:block"><ZoomIn className="w-4 h-4" /></span>
          {soldOut && <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-medium">Agotado</span>}
        </button>
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-500 truncate">{p.brand || categoryLabel(p.category)}</span>
          <h3 onClick={() => setOpen(true)} className="font-medium text-sm sm:text-base leading-snug mt-1 text-stone-900 line-clamp-2 cursor-pointer">{p.name}</h3>
          <div className="mt-auto pt-2"><Price p={p} /></div>
          <AddButton p={p} className="mt-3 py-2.5 w-full" />
        </div>
      </article>
      {open && <Modal p={p} discount={discount} onClose={() => setOpen(false)} />}
    </>
  )
}

"use client"

import React, { useEffect, useState } from 'react'
import { Minus, Plus, Trash2, X, MessageCircle, CreditCard } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { imgSrc, money } from './useProducts'

const WA = '593999312678'

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<'cart' | 'form'>('cart')
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [cust, setCust] = useState({ name: '', phone: '', email: '', address: '' })
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const total = items.reduce((a, i) => a + i.price * i.qty, 0)
  const checkout = () => {
    const lines = items.map((i) => `• ${i.qty} x ${i.name} — ${money(i.price * i.qty)}`).join('\n')
    const text = `Hola Ponte Bella, quiero hacer este pedido:\n${lines}\n\nTotal: ${money(total)}`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaying(true); setError('')
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), customer: cust }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Error al iniciar el pago')
      window.location.href = d.url
    } catch (err: any) {
      setError(err.message); setPaying(false)
    }
  }

  const inp = 'w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-900'

  return (
    <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-stone-900/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-serif text-2xl">{step === 'form' ? 'Tus datos' : 'Tu carrito'}</h2>
          <button onClick={() => setOpen(false)} aria-label="Cerrar" className="p-2 rounded-full hover:bg-stone-100"><X className="w-5 h-5" /></button>
        </div>
        {step === 'form' && items.length > 0 ? (
          <form onSubmit={pay} className="flex-1 overflow-y-auto p-5 space-y-3">
            <input required className={inp} placeholder="Nombre completo" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} />
            <input required className={inp} placeholder="Teléfono (ej. 0999312678)" inputMode="tel" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
            <input required type="email" className={inp} placeholder="Correo electrónico" value={cust.email} onChange={(e) => setCust({ ...cust, email: e.target.value })} />
            <textarea required rows={2} className={inp} placeholder="Dirección de entrega" value={cust.address} onChange={(e) => setCust({ ...cust, address: e.target.value })} />
            <div className="flex justify-between font-semibold pt-2"><span>Total a pagar</span><span>{money(total)}</span></div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button disabled={paying} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white py-3 font-medium hover:bg-rose-700 transition disabled:opacity-50">
              <CreditCard className="w-5 h-5" /> {paying ? 'Redirigiendo a Payphone...' : 'Ir a pagar'}
            </button>
            <button type="button" onClick={() => setStep('cart')} className="w-full text-sm text-stone-500 underline">Volver al carrito</button>
          </form>
        ) : (
        <>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && <p className="text-stone-500 text-sm text-center mt-10">Tu carrito está vacío.</p>}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3">
              {i.image ? <img src={imgSrc(i.image)} alt="" className="w-20 h-20 rounded-xl object-cover" /> : <div className="w-20 h-20 rounded-xl bg-stone-100" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug">{i.name}</p>
                <p className="text-sm text-stone-600">{money(i.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(i.id, i.qty - 1)} className="p-1 border rounded-full" aria-label="Menos"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="text-sm w-6 text-center">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} className="p-1 border rounded-full" aria-label="Más"><Plus className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(i.id)} className="ml-auto text-rose-600" aria-label="Quitar"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t space-y-3">
            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{money(total)}</span></div>
            <button onClick={() => setStep('form')} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white py-3 font-medium hover:bg-rose-700 transition">
              <CreditCard className="w-5 h-5" /> Pagar con tarjeta (Payphone)
            </button>
            <button onClick={checkout} className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 text-emerald-700 py-3 font-medium hover:bg-emerald-50 transition">
              <MessageCircle className="w-5 h-5" /> Pedir por WhatsApp
            </button>
            <button onClick={clear} className="w-full text-sm text-stone-500 underline">Vaciar carrito</button>
          </div>
        )}
        </>
        )}
      </aside>
    </div>
  )
}

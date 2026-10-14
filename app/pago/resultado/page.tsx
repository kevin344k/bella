"use client"

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '../../../store/useCartStore'

function Result() {
  const params = useSearchParams()
  const clear = useCartStore((s) => s.clear)
  const [state, setState] = useState<{ status: string; orderId?: string; total?: number } | null>(null)

  useEffect(() => {
    const id = params.get('id')
    const clientTxId = params.get('clientTransactionId')
    if (!id || !clientTxId) return setState({ status: 'error' })
    fetch('/api/checkout/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, clientTxId }) })
      .then((r) => r.json())
      .then((d) => { if (d.status === 'approved') clear(); setState(d) })
      .catch(() => setState({ status: 'error' }))
  }, [params, clear])

  const view = {
    approved: { t: '¡Pago aprobado!', d: 'Gracias por tu compra. Te contactaremos por WhatsApp para coordinar la entrega.', c: 'text-emerald-600' },
    canceled: { t: 'Pago cancelado', d: 'No se realizó ningún cobro. Tu carrito sigue guardado.', c: 'text-amber-600' },
    rejected: { t: 'Pago rechazado', d: 'No se pudo completar el cobro. Puedes intentarlo de nuevo.', c: 'text-rose-600' },
    error: { t: 'No pudimos verificar el pago', d: 'Si te cobraron, escríbenos por WhatsApp con tu número de pedido.', c: 'text-rose-600' },
  } as const
  const v = state ? view[state.status as keyof typeof view] || view.error : null

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 text-center">
      {!v ? <p className="text-stone-500">Verificando tu pago...</p> : (
        <div className="max-w-md space-y-3">
          <h1 className={`text-3xl font-serif font-semibold ${v.c}`}>{v.t}</h1>
          <p className="text-stone-600">{v.d}</p>
          {state?.orderId && <p className="text-sm text-stone-500">Pedido #{state.orderId} · Total ${state.total?.toFixed(2)}</p>}
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/" className="rounded-full bg-stone-900 text-white px-6 py-2.5 text-sm">Volver a la tienda</Link>
            <a href="https://wa.me/593999312678" target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 px-6 py-2.5 text-sm">WhatsApp</a>
          </div>
        </div>
      )}
    </main>
  )
}

export default function Page() {
  return <Suspense fallback={null}><Result /></Suspense>
}

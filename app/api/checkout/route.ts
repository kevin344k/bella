import { NextResponse } from 'next/server'
import { backend, payphone, splitTax } from '../../../lib/backend'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!process.env.PAYPHONE_TOKEN || !process.env.PAYPHONE_STORE_ID) {
    return NextResponse.json({ error: 'Pagos con tarjeta aún no configurados' }, { status: 503 })
  }
  let input: any
  try { input = await req.json() } catch { return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 }) }
  const c = input.customer || {}
  if (!c.name || !/^[0-9+\s-]{7,20}$/.test(c.phone || '') || !/^\S+@\S+\.\S+$/.test(c.email || '') || !c.address) {
    return NextResponse.json({ error: 'Completa nombre, teléfono, correo y dirección' }, { status: 400 })
  }

  let order: any
  try {
    const r = await backend('/orders', { method: 'POST', body: JSON.stringify({ items: input.items, customer: c }) })
    order = await r.json()
    if (!r.ok) return NextResponse.json({ error: order.error || 'No se pudo crear el pedido' }, { status: r.status })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor de la tienda' }, { status: 502 })
  }

  const origin = (process.env.SITE_URL || new URL(req.url).origin).replace(/\/$/, '')
  const { amountWithTax, tax } = splitTax(order.totalCents)
  const pp = await payphone('Prepare', {
    amount: order.totalCents,
    amountWithTax,
    tax,
    amountWithoutTax: 0,
    service: 0,
    tip: 0,
    currency: 'USD',
    storeId: process.env.PAYPHONE_STORE_ID,
    clientTransactionId: order.id,
    reference: `Pedido Ponte Bella ${order.id}`,
    responseUrl: `${origin}/pago/resultado`,
    cancellationUrl: `${origin}/`,
    timeZone: -5,
    email: c.email,
    phoneNumber: c.phone.startsWith('+') ? c.phone : undefined,
  }).catch(() => null)

  const data = pp ? await pp.json().catch(() => null) : null
  const url = data?.payWithCard || data?.payWithPayPhone
  if (!pp?.ok || !url) return NextResponse.json({ error: 'Payphone no pudo iniciar el pago' }, { status: 502 })
  return NextResponse.json({ url })
}

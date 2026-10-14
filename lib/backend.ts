export type Product = {
  id: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  oldPrice: number | null
  onSale: boolean
  stock: number
  image: string
  createdAt: number
}

export const WHATSAPP = '593999312678'

const BASE = () => (process.env.LOCAL_API_URL || '').replace(/\/$/, '')

export function isAdmin(req: Request) {
  const p = process.env.ADMIN_PASSWORD
  return !!p && req.headers.get('x-admin-password') === p
}

export function backend(path: string, init: RequestInit = {}) {
  return fetch(BASE() + path, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'X-Tunnel-Skip-AntiPhishing-Page': 'true',
      'x-api-secret': process.env.LOCAL_API_SECRET || '',
      ...(init.headers || {}),
    },
  })
}

const PAYPHONE = 'https://pay.payphonetodoesposible.com/api/button'
const IVA = Number(process.env.PAYPHONE_IVA || 15)

export function payphone(path: string, payload: unknown) {
  return fetch(`${PAYPHONE}/${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYPHONE_TOKEN || ''}` },
    body: JSON.stringify(payload),
  })
}

// Los precios incluyen IVA: se separa la base y el impuesto en centavos.
export function splitTax(totalCents: number) {
  const base = Math.round(totalCents / (1 + IVA / 100))
  return { amountWithTax: base, tax: totalCents - base }
}

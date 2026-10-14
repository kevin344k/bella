import { NextResponse } from 'next/server'
import { backend, isAdmin, Product } from '../../../lib/backend'

export const dynamic = 'force-dynamic'

// Último listado válido: si la PC está apagada se sigue mostrando el catálogo.
let cache: Product[] = []

export async function GET() {
  try {
    const r = await backend('/products')
    if (!r.ok) throw new Error()
    cache = await r.json()
    return NextResponse.json({ products: cache, offline: false })
  } catch {
    return NextResponse.json({ products: cache, offline: true })
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  try {
    const r = await backend('/products', { method: 'POST', body: await req.text() })
    return new NextResponse(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor local' }, { status: 502 })
  }
}

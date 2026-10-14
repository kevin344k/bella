import { NextResponse } from 'next/server'
import { backend, isAdmin } from '../../../lib/backend'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  try {
    const r = await backend('/orders')
    return new NextResponse(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor local' }, { status: 502 })
  }
}

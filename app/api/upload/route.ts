import { NextResponse } from 'next/server'
import { backend, isAdmin } from '../../../lib/backend'

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  try {
    const r = await backend('/upload', { method: 'POST', body: await req.text() })
    return new NextResponse(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor local' }, { status: 502 })
  }
}

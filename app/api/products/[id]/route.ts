import { NextResponse } from 'next/server'
import { backend, isAdmin } from '../../../../lib/backend'

async function forward(req: Request, id: string, method: 'PUT' | 'DELETE') {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  try {
    const r = await backend(`/products/${encodeURIComponent(id)}`, {
      method,
      body: method === 'PUT' ? await req.text() : undefined,
    })
    return new NextResponse(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } })
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor local' }, { status: 502 })
  }
}

export const PUT = (req: Request, { params }: { params: { id: string } }) => forward(req, params.id, 'PUT')
export const DELETE = (req: Request, { params }: { params: { id: string } }) => forward(req, params.id, 'DELETE')

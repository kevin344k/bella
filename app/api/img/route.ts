import { backend } from '../../../lib/backend'

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams.get('p') || ''
  if (!/^\/uploads\/[\w-]+\.(jpg|png|webp)$/.test(p)) return new Response('bad', { status: 400 })
  try {
    const r = await backend(p)
    if (!r.ok) return new Response('not found', { status: 404 })
    return new Response(r.body, { headers: { 'Content-Type': r.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } })
  } catch {
    return new Response('offline', { status: 502 })
  }
}

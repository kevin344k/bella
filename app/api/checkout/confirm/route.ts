import { NextResponse } from 'next/server'
import { backend, payphone } from '../../../../lib/backend'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { id, clientTxId } = await req.json().catch(() => ({}))
  if (!id || !/^[a-f0-9]{12}$/.test(String(clientTxId))) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  try {
    const [pp, o] = await Promise.all([
      payphone('V2/Confirm', { id: Number(id), clientTxId }),
      backend(`/orders/${clientTxId}`),
    ])
    const data = await pp.json().catch(() => null)
    if (!pp.ok || !data || !o.ok) return NextResponse.json({ status: 'error' }, { status: 502 })
    const order = await o.json()

    const approved = data.transactionStatus === 'Approved' && data.clientTransactionId === clientTxId && Number(data.amount) === order.totalCents
    if (!approved) return NextResponse.json({ status: data.transactionStatus === 'Canceled' ? 'canceled' : 'rejected' })

    await backend(`/orders/${clientTxId}/paid`, { method: 'POST', body: JSON.stringify({ payphoneId: id }) })
    return NextResponse.json({ status: 'approved', orderId: clientTxId, total: order.totalCents / 100 })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 502 })
  }
}

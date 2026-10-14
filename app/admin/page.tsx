"use client"

import React, { useCallback, useEffect, useState } from 'react'
import type { Product } from '../../lib/backend'
import { imgSrc } from '../../components/useProducts'
import { CATEGORIES } from '../../lib/categories'

const empty = { name: '', brand: '', category: 'mujer', description: '', price: '', oldPrice: '', onSale: false, stock: '1', image: '' }

export default function AdminPage() {
  const [pass, setPass] = useState('')
  const [logged, setLogged] = useState(false)
  const [items, setItems] = useState<Product[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [offline, setOffline] = useState(false)
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [orders, setOrders] = useState<any[]>([])
  const [ordersMsg, setOrdersMsg] = useState('')

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': pass }

  const load = useCallback(async () => {
    const d = await fetch('/api/products').then((r) => r.json())
    setItems(d.products || []); setOffline(!!d.offline)
  }, [])

  useEffect(() => {
    const s = sessionStorage.getItem('pb-admin')
    if (s) { setPass(s); setLogged(true) }
    load()
  }, [load])

  const login = async () => {
    // Valida la clave con una subida inválida: 401 = incorrecta, 400 = correcta
    const r = await fetch('/api/upload', { method: 'POST', headers, body: '{}' })
    if (r.status === 401) return setMsg('Clave incorrecta')
    sessionStorage.setItem('pb-admin', pass); setLogged(true); setMsg('')
  }

  const loadOrders = useCallback(async () => {
    const r = await fetch('/api/orders', { headers: { 'x-admin-password': pass } })
    const d = await r.json().catch(() => null)
    if (!r.ok) { setOrders([]); return setOrdersMsg(d?.error || 'Error al cargar pedidos') }
    setOrders(d); setOrdersMsg('')
  }, [pass])

  useEffect(() => { if (logged && tab === 'orders') loadOrders() }, [logged, tab, loadOrders])

  const upload = async (file?: File) => {
    if (!file) return
    setUploading(true)
    setForm((f: any) => ({ ...f, image: '' }))
    try {
      const dataUrl = await new Promise<string>((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = rej; fr.readAsDataURL(file) })
      setMsg('Subiendo imagen...')
      const r = await fetch('/api/upload', { method: 'POST', headers, body: JSON.stringify({ dataUrl }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Error al subir la imagen')
      setForm((f: any) => ({ ...f, image: d.path })); setMsg('Imagen lista ✓')
    } catch (err: any) {
      setMsg(err.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploading) return setMsg('Espera a que termine de subir la imagen')
    if (!form.image) return setMsg('Agrega una imagen del producto')
    const r = await fetch(editing ? `/api/products/${editing}` : '/api/products', { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(form) })
    const d = await r.json()
    if (!r.ok) return setMsg(d.error || 'Error')
    setForm(empty); setEditing(null); setMsg('Guardado ✓'); load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers }); load()
  }

  const edit = (p: Product) => {
    setEditing(p.id)
    setForm({ ...p, oldPrice: p.oldPrice ?? '', price: String(p.price), stock: String(p.stock) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black'

  if (!logged) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-serif">Panel Ponte Bella</h1>
          <input type="password" className={inp} placeholder="Clave de administrador" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} />
          <button onClick={login} className="w-full bg-black text-white rounded-lg py-2">Entrar</button>
          {msg && <p className="text-sm text-rose-600">{msg}</p>}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif">Productos</h1>
        <button className="text-sm underline" onClick={() => { sessionStorage.removeItem('pb-admin'); setLogged(false); setPass('') }}>Salir</button>
      </div>
      <div className="flex gap-2 mb-6">
        {([['products', 'Productos'], ['orders', 'Pedidos']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full text-sm border transition ${tab === k ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}>{l}</button>
        ))}
      </div>
      {tab === 'orders' ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{orders.filter((o) => o.status === 'paid').length} pagados · {orders.filter((o) => o.status !== 'paid').length} pendientes</p>
            <button onClick={loadOrders} className="text-sm underline">Actualizar</button>
          </div>
          {ordersMsg && <p className="text-sm text-rose-600">{ordersMsg}</p>}
          {!ordersMsg && orders.length === 0 && <p className="text-gray-500 text-sm">Aún no hay pedidos.</p>}
          {orders.map((o) => (
            <div key={o.id} className="p-4 border rounded-xl bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">Pedido #{o.id} <span className="text-sm text-gray-500 font-normal">· {new Date(o.createdAt).toLocaleString('es-EC')}</span></p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{o.status === 'paid' ? 'Pagado' : 'Pendiente'}</span>
              </div>
              <ul className="mt-2 text-sm text-gray-700">
                {o.items.map((i: any) => <li key={i.id}>{i.qty} × {i.name} — ${(i.price * i.qty).toFixed(2)}</li>)}
              </ul>
              <p className="mt-2 font-semibold">Total ${(o.totalCents / 100).toFixed(2)}</p>
              <div className="mt-2 text-sm text-gray-600">
                {o.customer.name} · {o.customer.phone} · {o.customer.email}<br />{o.customer.address}
              </div>
              {o.customer.phone && (
                <a className="inline-block mt-2 text-sm text-emerald-700 underline" target="_blank" rel="noreferrer"
                  href={`https://wa.me/${o.customer.phone.replace(/\D/g, '').replace(/^0/, '593')}?text=${encodeURIComponent(`Hola ${o.customer.name}, sobre tu pedido #${o.id} en Ponte Bella`)}`}>
                  Escribir por WhatsApp
                </a>
              )}
            </div>
          ))}
        </section>
      ) : (<>
      {offline && <p className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm">No hay conexión con el servidor de tu PC (¿está encendido y con el túnel activo?).</p>}

      <form onSubmit={save} className="grid md:grid-cols-2 gap-3 p-5 border rounded-2xl mb-10 bg-white">
        <input required className={inp} placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inp} placeholder="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input required type="number" step="0.01" min="0" className={inp} placeholder="Precio actual" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" step="0.01" min="0" className={inp} placeholder="Precio anterior" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
        <select required className={inp} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <input type="number" min="0" className={inp} placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <textarea className={inp + ' md:col-span-2'} rows={2} placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.onSale} onChange={(e) => setForm({ ...form, onSale: e.target.checked })} /> En oferta</label>
        <div className="flex items-center gap-3">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => upload(e.target.files?.[0])} className="text-sm" />
          {form.image && <img src={imgSrc(form.image)} alt="" className="w-12 h-12 object-cover rounded" />}
        </div>
        <div className="md:col-span-2 flex gap-3 items-center">
          <button disabled={uploading} className="bg-black text-white rounded-full px-6 py-2 text-sm disabled:opacity-50">{uploading ? 'Subiendo imagen...' : editing ? 'Actualizar' : 'Agregar producto'}</button>
          {editing && <button type="button" className="text-sm underline" onClick={() => { setEditing(null); setForm(empty) }}>Cancelar</button>}
          <span className="text-sm text-gray-600">{msg}</span>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-gray-500 text-sm">Aún no hay productos.</p>}
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3 border rounded-xl bg-white">
            {p.image ? <img src={imgSrc(p.image)} alt="" className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-gray-100 rounded-lg" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-sm text-gray-600">
                ${p.price.toFixed(2)} {p.oldPrice ? <span className="line-through text-gray-400">${p.oldPrice.toFixed(2)}</span> : null}
                <span className="text-stone-500"> · {CATEGORIES.find((c) => c.slug === p.category)?.label || p.category}</span>
                {p.onSale && <span className="ml-2 text-rose-600 font-medium">Oferta</span>} · Stock {p.stock}
              </p>
            </div>
            <button onClick={() => edit(p)} className="text-sm underline">Editar</button>
            <button onClick={() => remove(p.id)} className="text-sm text-rose-600 underline">Eliminar</button>
          </div>
        ))}
      </div>
      </>)}
    </main>
  )
}

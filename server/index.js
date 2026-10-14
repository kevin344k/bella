// Servidor local de Ponte Bella: productos en JSON + imágenes. Sin dependencias.
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const envFile = path.join(__dirname, '.env')
if (fs.existsSync(envFile)) {
  for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}
const PORT = process.env.PORT || 4000
const SECRET = process.env.API_SECRET
if (!SECRET) { console.error('Falta API_SECRET en server/.env'); process.exit(1) }

const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS = path.join(__dirname, 'uploads')
const DB = path.join(DATA_DIR, 'products.json')
const ORDERS = path.join(DATA_DIR, 'orders.json')
fs.mkdirSync(DATA_DIR, { recursive: true })
fs.mkdirSync(UPLOADS, { recursive: true })
if (!fs.existsSync(DB)) fs.writeFileSync(DB, '[]')
if (!fs.existsSync(ORDERS)) fs.writeFileSync(ORDERS, '[]')

const read = () => JSON.parse(fs.readFileSync(DB, 'utf8'))
const write = (d) => {
  fs.writeFileSync(DB + '.tmp', JSON.stringify(d, null, 2))
  fs.renameSync(DB + '.tmp', DB)
}
const readOrders = () => JSON.parse(fs.readFileSync(ORDERS, 'utf8'))
const writeOrders = (d) => {
  fs.writeFileSync(ORDERS + '.tmp', JSON.stringify(d, null, 2))
  fs.renameSync(ORDERS + '.tmp', ORDERS)
}
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

function send(res, code, body, headers = {}) {
  res.writeHead(code, { 'Content-Type': 'application/json', ...headers })
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body))
}
function body(req, limit = 12e6) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = []
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('too big')); req.destroy() } else chunks.push(c) })
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')) } catch (e) { reject(e) } })
  })
}
function clean(p, prev = {}) {
  const num = (v) => (v === '' || v == null ? null : Number(v))
  const price = Number(p.price)
  if (!p.name || !Number.isFinite(price) || price < 0) throw new Error('Nombre y precio válidos son obligatorios')
  const oldPrice = num(p.oldPrice)
  return {
    ...prev,
    name: String(p.name).slice(0, 120),
    description: String(p.description || '').slice(0, 1000),
    category: ['mujer', 'hombre', 'ninos', 'hogar'].includes(p.category) ? p.category : (() => { throw new Error('Categoría inválida') })(),
    brand: String(p.brand || '').slice(0, 40),
    price,
    oldPrice: oldPrice && oldPrice > 0 ? oldPrice : null,
    onSale: !!p.onSale,
    stock: Math.max(0, parseInt(p.stock ?? 0, 10) || 0),
    image: String(p.image || ''),
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const p = url.pathname
  try {
    if (req.method === 'GET' && p.startsWith('/uploads/')) {
      const f = path.join(UPLOADS, path.basename(p))
      if (!fs.existsSync(f)) return send(res, 404, { error: 'not found' })
      return send(res, 200, fs.readFileSync(f), { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000' })
    }
    if (req.method === 'GET' && p === '/products') return send(res, 200, read())

    const a = Buffer.from(String(req.headers['x-api-secret'] || ''))
    const b = Buffer.from(SECRET)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return send(res, 401, { error: 'no autorizado' })

    if (req.method === 'POST' && p === '/products') {
      const list = read()
      const item = clean(await body(req), { id: crypto.randomUUID(), createdAt: Date.now() })
      list.unshift(item); write(list)
      return send(res, 201, item)
    }
    if (req.method === 'POST' && p === '/upload') {
      const { dataUrl } = await body(req)
      const m = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(dataUrl || '')
      if (!m) return send(res, 400, { error: 'imagen inválida' })
      const name = `${crypto.randomUUID()}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`
      fs.writeFileSync(path.join(UPLOADS, name), Buffer.from(m[2], 'base64'))
      return send(res, 201, { path: `/uploads/${name}` })
    }
    // Los precios siempre se calculan aquí con la base de datos, nunca con lo que envía el navegador.
    if (req.method === 'POST' && p === '/orders') {
      const { items, customer } = await body(req)
      if (!Array.isArray(items) || !items.length || items.length > 50) throw new Error('Carrito vacío')
      const products = read()
      const lines = items.map((it) => {
        const prod = products.find((x) => x.id === it.id)
        const qty = parseInt(it.qty, 10)
        if (!prod || !(qty > 0)) throw new Error('Producto inválido')
        if (prod.stock < qty) throw new Error(`Sin stock suficiente de ${prod.name}`)
        return { id: prod.id, name: prod.name, price: prod.price, qty }
      })
      const total = lines.reduce((a, l) => a + Math.round(l.price * 100) * l.qty, 0)
      const c = customer || {}
      const order = {
        id: crypto.randomBytes(6).toString('hex'),
        items: lines,
        totalCents: total,
        customer: { name: String(c.name || '').slice(0, 80), phone: String(c.phone || '').slice(0, 20), email: String(c.email || '').slice(0, 80), address: String(c.address || '').slice(0, 200) },
        status: 'pending',
        createdAt: Date.now(),
      }
      const all = readOrders(); all.unshift(order); writeOrders(all)
      return send(res, 201, order)
    }
    if (req.method === 'GET' && p === '/orders') return send(res, 200, readOrders())
    const om = /^\/orders\/([a-f0-9]+)(\/paid)?$/.exec(p)
    if (om) {
      const all = readOrders(); const o = all.find((x) => x.id === om[1])
      if (!o) return send(res, 404, { error: 'no existe' })
      if (req.method === 'GET' && !om[2]) return send(res, 200, o)
      if (req.method === 'POST' && om[2]) {
        if (o.status !== 'paid') {
          const { payphoneId } = await body(req)
          const products = read()
          for (const l of o.items) {
            const prod = products.find((x) => x.id === l.id)
            if (prod) prod.stock = Math.max(0, prod.stock - l.qty)
          }
          write(products)
          o.status = 'paid'; o.paidAt = Date.now(); o.payphoneId = payphoneId || null
          writeOrders(all)
        }
        return send(res, 200, o)
      }
    }
    const m = /^\/products\/([\w-]+)$/.exec(p)
    if (m) {
      const list = read(); const i = list.findIndex((x) => x.id === m[1])
      if (i < 0) return send(res, 404, { error: 'no existe' })
      if (req.method === 'PUT') { list[i] = clean(await body(req), list[i]); write(list); return send(res, 200, list[i]) }
      if (req.method === 'DELETE') { list.splice(i, 1); write(list); return send(res, 200, { ok: true }) }
    }
    send(res, 404, { error: 'not found' })
  } catch (e) {
    send(res, 400, { error: e.message })
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Servidor Ponte Bella en http://127.0.0.1:${PORT}`))

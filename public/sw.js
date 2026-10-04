// Simple service worker for caching core assets and runtime caching for images/PDFs
const CACHE_NAME = 'ponte-bella-v1'
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key)
      return Promise.resolve()
    })))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  // network-first for HTML pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((r) => {
        const copy = r.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        return r
      }).catch(() => caches.match(event.request).then((res) => res || caches.match('/')))
    )
    return
  }

  // stale-while-revalidate for images, PDFs, static assets
  if (url.pathname.endsWith('.jpg') || url.pathname.endsWith('.png') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.pdf')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const network = fetch(event.request).then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, res.clone()))
          return res
        }).catch(() => cached)
        return cached || network
      })
    )
    return
  }

  // default to network
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
})

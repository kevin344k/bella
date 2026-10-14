"use client"

import React, { useEffect, useState } from 'react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Client-side dynamic loader for react-pdf to avoid server bundling of pdfjs/canvas
type Props = { file: string; title: string }

export default function ClientPDF({ file, title }: Props) {
  const [Loaded, setLoaded] = useState<any>(null)
  const [pdfjs, setPdfjs] = useState<any>(null)

  // UI state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [matches, setMatches] = useState<number[]>([])
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const storageKey = `pb:pdf:bookmarks:${file}`

  useEffect(() => {
    // dynamic import only in client runtime
    let mounted = true
    import('react-pdf')
      .then((rp) => {
        if (!mounted) return
        const { Document, Page, pdfjs: pd } = rp as any
        setLoaded({ Document, Page })
        setPdfjs(pd)
        pd.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pd.version}/build/pdf.worker.min.js`
      })
      .catch((err) => {
        console.error('Failed to load react-pdf or pdfjs:', err)
          setError('No se pudo iniciar el lector de PDF. Recarga la página e inténtalo de nuevo.')
        })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved: unknown = JSON.parse(raw)
        if (Array.isArray(saved) && saved.every((page) => Number.isInteger(page) && page > 0)) {
          setBookmarks(saved)
        }
      }
    } catch (err) {
      console.error('Failed to load PDF bookmarks:', err)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookmarks))
    } catch (err) {
      console.error('Failed to save PDF bookmarks:', err)
    }
  }, [bookmarks, storageKey])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPage(1)
    setError(null)
  }

  function onDocumentLoadError(err: Error) {
    console.error('Failed to load PDF:', err)
    setError('No se pudo cargar este catálogo. Comprueba tu conexión e inténtalo de nuevo.')
  }

  async function performSearch() {
    setMatches([])
    setSearchError(null)
    if (!search.trim() || !file || !pdfjs) return
    try {
      const loadingTask = pdfjs.getDocument(file)
      const pdf = await loadingTask.promise
      const found: number[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i)
        const txt = await p.getTextContent()
        const full = txt.items.map((it: any) => it.str).join(' ')
        if (full.toLowerCase().includes(search.trim().toLowerCase())) found.push(i)
      }
      setMatches(found)
      if (found.length) setPage(found[0])
      else setSearchError('No encontramos ese texto en el catálogo.')
    } catch (err) {
      console.error('PDF search error:', err)
      setSearchError('No se pudo buscar en el catálogo. Inténtalo de nuevo.')
    }
  }

  function toggleBookmark(pn: number) {
    setBookmarks((prev) => (prev.includes(pn) ? prev.filter((x) => x !== pn) : [...prev, pn]))
  }

  if (!Loaded) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center text-stone-600 shadow-sm" role="status">
        {error ?? 'Preparando el catálogo…'}
      </div>
    )
  }

  const { Document, Page } = Loaded

  return (
    <div className="pdf-viewer rounded-3xl border border-rose-100 bg-white/80 p-4 shadow-[0_20px_60px_rgba(93,45,59,0.08)] backdrop-blur-md sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Catálogo digital</p>
          <h3 className="mt-1 text-lg font-semibold text-stone-900">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn-outline rounded-full px-4 py-2 text-sm" href={file} target="_blank" rel="noreferrer">Abrir aparte</a>
          <a className="btn-primary rounded-full px-4 py-2 text-sm" href={file} download>Descargar PDF</a>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-rose-50/70 p-3">
        <button type="button" className="btn-outline rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
        <span className="min-w-24 text-center text-sm font-medium text-stone-700" aria-live="polite">
          Página {page}{numPages ? ` de ${numPages}` : ''}
        </span>
        <button type="button" className="btn-outline rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40" disabled={!numPages || page >= numPages} onClick={() => setPage((p) => Math.min((numPages ?? p), p + 1))}>Siguiente</button>
        <label className="flex items-center gap-2 text-sm text-stone-600 sm:ml-auto">
          Zoom
          <input aria-label="Zoom del catálogo" type="range" min={0.6} max={1.6} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          <span className="w-10">{Math.round(scale * 100)}%</span>
        </label>
      </div>

      <div className="pdf-canvas min-h-96 overflow-auto rounded-2xl bg-stone-100/80 p-2 sm:p-5">
        {/* @ts-ignore */}
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="py-12 text-center text-stone-500" role="status">Cargando catálogo…</div>}
          error={<div className="py-12 text-center text-rose-800" role="alert">No se pudo mostrar el catálogo.</div>}
        >
          {/* @ts-ignore */}
          <Page pageNumber={page} scale={scale} />
        </Document>
      </div>

      {error && <p className="mt-3 text-sm text-rose-800" role="alert">{error}</p>}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <form className="flex min-w-0 flex-1 gap-2" onSubmit={(event) => { event.preventDefault(); void performSearch() }}>
          <input
            className="min-w-0 flex-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            aria-label="Buscar en el catálogo"
            placeholder="Buscar un producto o palabra"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-outline rounded-full px-4 py-2 text-sm">Buscar</button>
        </form>
        <button type="button" className="btn-outline rounded-full px-4 py-2 text-sm" onClick={() => toggleBookmark(page)} disabled={!numPages}>
          {bookmarks.includes(page) ? 'Quitar de guardados' : 'Guardar página'}
        </button>
      </div>

      {searchError && <p className="mt-2 text-sm text-stone-600" role="status">{searchError}</p>}
      {bookmarks.length > 0 && (
        <div className="mt-4 rounded-2xl bg-rose-50/70 p-4">
          <div className="mb-2 text-sm font-semibold text-stone-800">Páginas guardadas</div>
          <div className="flex gap-2 flex-wrap">
            {bookmarks.filter((bookmark) => bookmark <= (numPages ?? bookmark)).map((bookmark) => (
              <button key={bookmark} type="button" className="btn-outline rounded-full px-3 py-1.5 text-sm" onClick={() => setPage(bookmark)}>{bookmark}</button>
            ))}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-4 rounded-2xl bg-stone-50 p-4" role="status">
          <div className="mb-2 text-sm font-semibold text-stone-800">Resultados · {matches.length} páginas</div>
          <div className="flex gap-2 flex-wrap">
            {matches.map((match) => (
              <button key={match} type="button" className="btn-primary rounded-full px-3 py-1.5 text-sm" onClick={() => setPage(match)}>{match}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

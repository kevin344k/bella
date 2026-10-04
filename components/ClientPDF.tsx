"use client"

import React, { useEffect, useState } from 'react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Client-side dynamic loader for react-pdf to avoid server bundling of pdfjs/canvas
type Props = { file: string }

export default function ClientPDF({ file }: Props) {
  const [Loaded, setLoaded] = useState<any>(null)
  const [pdfjs, setPdfjs] = useState<any>(null)

  // UI state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [matches, setMatches] = useState<number[]>([])
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const storageKey = 'pb:pdf:bookmarks'

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
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setBookmarks(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookmarks))
    } catch (e) {
      // ignore
    }
  }, [bookmarks])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPage(1)
  }

  async function performSearch() {
    setMatches([])
    if (!search || !file || !pdfjs) return
    try {
      const loadingTask = pdfjs.getDocument(file)
      const pdf = await loadingTask.promise
      const found: number[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const p = await pdf.getPage(i)
        const txt = await p.getTextContent()
        const full = txt.items.map((it: any) => it.str).join(' ')
        if (full.toLowerCase().includes(search.toLowerCase())) found.push(i)
      }
      setMatches(found)
      if (found.length) setPage(found[0])
    } catch (err) {
      console.warn('PDF search error', err)
    }
  }

  function toggleBookmark(pn: number) {
    setBookmarks((prev) => (prev.includes(pn) ? prev.filter((x) => x !== pn) : [...prev, pn]))
  }

  if (!Loaded) {
    return <div className="py-8 text-center">Loading PDF viewer...</div>
  }

  const { Document, Page } = Loaded

  return (
    <div className="pdf-viewer bg-white/60 backdrop-blur-md p-4 rounded-xl-24 shadow-lg">
      <div className="flex gap-3 items-center mb-3">
        <button className="btn-outline px-3 py-1" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <div className="text-sm">Page {page}{numPages ? ` / ${numPages}` : ''}</div>
        <button className="btn-outline px-3 py-1" onClick={() => setPage((p) => Math.min((numPages ?? p), p + 1))}>Next</button>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Zoom</label>
          <input type="range" min={0.6} max={2} step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
        </div>
      </div>

      <div className="pdf-canvas overflow-auto">
        {/* @ts-ignore */}
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="py-8 text-center">Loading PDF...</div>}>
          {/* @ts-ignore */}
          <Page pageNumber={page} scale={scale} />
        </Document>
      </div>

      <div className="mt-3 flex gap-2 items-center">
        <button className="btn-primary px-3 py-1" onClick={() => window.open(file, '_blank')}>Open Full</button>
        <input className="flex-1 px-3 py-2 rounded border" placeholder="Search text across pages" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-outline px-3 py-1" onClick={performSearch}>Search</button>
        <div className="ml-2 text-sm">Matches: {matches.length}</div>
        <div className="ml-4 text-sm">Bookmarks: {bookmarks.length}</div>
        <button className="btn-outline px-3 py-1 ml-2" onClick={() => toggleBookmark(page)}>{bookmarks.includes(page) ? 'Unbookmark' : 'Bookmark'}</button>
      </div>

      {bookmarks.length > 0 && (
        <div className="mt-3 bg-white/40 rounded p-3">
          <div className="font-semibold mb-2">Bookmarked Pages</div>
          <div className="flex gap-2 flex-wrap">
            {bookmarks.map((b) => (
              <button key={b} className="btn-outline px-3 py-1" onClick={() => setPage(b)}>{b}</button>
            ))}
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-3 bg-white/40 rounded p-3">
          <div className="font-semibold mb-2">Search Results (pages)</div>
          <div className="flex gap-2 flex-wrap">
            {matches.map((m) => (
              <button key={m} className="btn-primary px-3 py-1" onClick={() => setPage(m)}>{m}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

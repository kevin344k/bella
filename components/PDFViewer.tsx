"use client"

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'

// Dynamically import the client-only PDF component to avoid server-side pdfjs import
const ClientPDF = dynamic(() => import('./ClientPDF'), { ssr: false })

export type Catalog = {
  name: string
  file: string
  brand?: string
  campaign?: string
  pages?: string
  description?: string
  badge?: string
  gradient?: string
  brandColor?: string
}

type Props = { catalogs: Catalog[] }

export default function PDFViewer({ catalogs }: Props) {
  const [selectedFile, setSelectedFile] = useState(catalogs[0]?.file ?? '')
  const readerRef = useRef<HTMLDivElement | null>(null)
  const selectedCatalog = catalogs.find((catalog) => catalog.file === selectedFile)

  function handleSelectCatalog(file: string) {
    setSelectedFile(file)
    if (readerRef.current) {
      readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Cards de Catálogos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="tablist" aria-label="Catálogos disponibles">
        {catalogs.map((catalog) => {
          const isSelected = selectedFile === catalog.file
          const brandName = catalog.brand ?? catalog.name.split('·')[0].trim()
          const campaignText = catalog.campaign ?? 'Campaña 12 · 2026'
          const pagesCount = catalog.pages ?? 'Digital'

          return (
            <div
              key={catalog.file}
              id={`catalog-card-${catalog.file}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls="catalog-reader"
              onClick={() => handleSelectCatalog(catalog.file)}
              className={`group cursor-pointer relative flex flex-col justify-between rounded-3xl border transition-all duration-300 p-6 ${
                isSelected
                  ? 'border-rose-500 bg-white shadow-2xl ring-2 ring-rose-300 -translate-y-1'
                  : 'border-stone-200 bg-white/80 hover:bg-white hover:border-rose-300 hover:shadow-lg'
              }`}
            >
              {/* Status indicator on top */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isSelected
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-rose-50 group-hover:text-rose-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-rose-600 animate-pulse' : 'bg-stone-400'
                    }`}
                  />
                  {isSelected ? 'Leyendo ahora' : 'Clic para abrir'}
                </span>

                <span className="text-xs font-medium text-stone-500 bg-stone-50 border border-stone-200/80 rounded-full px-2.5 py-0.5">
                  {pagesCount}
                </span>
              </div>

              {/* Stylized Book Cover Preview */}
              <div
                className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden p-5 flex flex-col justify-between text-white shadow-inner mb-5 transition-transform duration-300 group-hover:scale-[1.02] ${
                  catalog.gradient ??
                  (brandName.toLowerCase().includes('esika')
                    ? 'bg-gradient-to-br from-red-700 via-rose-800 to-stone-900'
                    : brandName.toLowerCase().includes('bel')
                    ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950'
                    : 'bg-gradient-to-br from-fuchsia-700 via-pink-600 to-purple-900')
                }`}
              >
                {/* Decorative sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-90 px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                    {campaignText}
                  </span>
                  <span className="text-xs opacity-75">PDF HD</span>
                </div>

                <div className="relative z-10">
                  <h4 className="font-serif text-2xl font-bold tracking-wider">{brandName}</h4>
                  <p className="text-xs text-white/80 mt-0.5">Catálogo Oficial Ecuador</p>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 group-hover:text-rose-700 transition-colors">
                    {catalog.name}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {catalog.description ??
                      'Explora las novedades, ofertas exclusivas, fragancias y maquillaje de la última campaña.'}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isSelected ? 'text-rose-700' : 'text-stone-700 group-hover:text-rose-600'
                    }`}
                  >
                    <span>{isSelected ? 'Abierto en el visor ↓' : 'Cargar en lector →'}</span>
                  </span>

                  <a
                    href={catalog.file}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                    title="Descargar archivo PDF"
                    aria-label={`Descargar catálogo ${catalog.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Visor interactivo de PDF */}
      {selectedCatalog && (
        <div
          ref={readerRef}
          id="catalog-reader"
          role="tabpanel"
          aria-labelledby={`catalog-card-${selectedCatalog.file}`}
          className="scroll-mt-6"
        >
          <ClientPDF key={selectedCatalog.file} file={selectedCatalog.file} title={selectedCatalog.name} />
        </div>
      )}
    </div>
  )
}

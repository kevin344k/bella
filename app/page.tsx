import HeroReveal from '../components/HeroReveal'
import BrandCarousel from '../components/BrandCarousel'
import PDFViewer from '../components/PDFViewer'
import OfertasCarousel from '../components/OfertasCarousel'
import CategoriasSection from '../components/CategoriasSection'
import Testimonials from '../components/Testimonials'
import AutoSliders from '../components/AutoSliders'
import WhatsAppButton from '../components/WhatsAppButton'
import WhatsAppDemoSetter from '../components/WhatsAppDemoSetter'

const catalogs = [
  {
    name: 'Ésika · Ecuador C12 2026',
    file: '/pdf/esika.ecuador.c12.2026.pdf',
    brand: 'Ésika',
    campaign: 'Campaña 12 · 2026',
    pages: '160 páginas',
    description: 'Cosmética avanzada, fragancias exclusivas, labiales Colorfix y cuidado facial de alta eficacia.',
    gradient: 'bg-gradient-to-br from-rose-800 via-red-900 to-stone-900'
  },
  {
    name: 'L’Bel · Ecuador C12 2026',
    file: '/pdf/lbel.ecuador.c12.2026.pdf',
    brand: 'L’Bel',
    campaign: 'Campaña 12 · 2026',
    pages: '112 páginas',
    description: 'Alta perfumería francesa, tratamientos antiedad dermatológicos y maquillaje de lujo.',
    gradient: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950'
  },
  {
    name: 'Cyzone · Ecuador C12',
    file: '/pdf/EC%20-%20%20C12%20CATALOGO%20CYZONE.pdf',
    brand: 'Cyzone',
    campaign: 'Campaña 12 · 2026',
    pages: '57 páginas',
    description: 'Tendencias juveniles, delineadores, labiales Studio Look y fragancias frescas y vibrantes.',
    gradient: 'bg-gradient-to-br from-fuchsia-700 via-pink-600 to-purple-900'
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroReveal
        imgNatural="/sin_maquillaje.png"
        imgMakeup="/con_maquillaje.png"
      />

      {/* Marcas principales */}
      <section id="marcas" className="max-w-7xl mx-auto scroll-mt-8 py-14 px-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-rose-600 font-semibold">Las mejores</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900">Marcas</h2>
        </div>
        <div><BrandCarousel /></div>
      </section>

      <OfertasCarousel />

      <CategoriasSection />

      {/* Sección Catálogos con cards para seleccionar */}
      <section id="catalogos" className="max-w-7xl mx-auto scroll-mt-8 py-16 px-6">
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Encuentra tus favoritos
          </span>
          <h2 className="mt-3 text-3xl font-serif font-semibold text-stone-900 sm:text-4xl lg:text-5xl">
            Catálogos Digitales
          </h2>
          <p className="mt-3 leading-7 text-stone-600 text-base sm:text-lg">
            Selecciona una card de catálogo para cargarlo inmediatamente en el visor, hojear página por página, buscar productos y guardar páginas.
          </p>
        </div>
        <PDFViewer catalogs={catalogs} />
      </section>

      {/*  testimonios complementarios */}
    

      <Testimonials />

    

     
    </main>
  )
}

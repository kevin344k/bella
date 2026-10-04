import HeroReveal from '../components/HeroReveal'
import BrandCarousel from '../components/BrandCarousel'
import PDFViewer from '../components/PDFViewer'
import Showroom from '../components/Showroom'
import MasonryGallery from '../components/MasonryGallery'
import AutoSliders from '../components/AutoSliders'
import WhatsAppButton from '../components/WhatsAppButton'
import WhatsAppDemoSetter from '../components/WhatsAppDemoSetter'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroReveal
        imgNatural="/sin_maquillaje.png"
        imgMakeup="/con_maquillaje.png"
      />

      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-semibold mb-6">Brands</h2>
        <div><BrandCarousel /></div>
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <AutoSliders />
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <PDFViewer file="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" />
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <Showroom />
      </section>

      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-2xl mb-6">Gallery</h2>
        <MasonryGallery />
      </section>

      <section className="max-w-7xl mx-auto py-6 px-6">
        <WhatsAppDemoSetter />
      </section>

      <WhatsAppButton />

    </main>
  )
}

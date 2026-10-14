import './globals.css'
import type { PropsWithChildren } from 'react'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import CartDrawer from '../components/CartDrawer'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Ponte Bella — Boutique de Belleza, Fragancias & Hogar',
  description: 'Ponte Bella — Tu boutique de belleza, catálogos digitales C12 Ésika, L’Bel, Cyzone, ofertas exclusivas y colección hogar.'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-bg text-text antialiased selection:bg-rose-200 selection:text-rose-900">
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}

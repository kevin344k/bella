import './globals.css'
import type { PropsWithChildren } from 'react'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'

export const metadata = {
  title: 'Ponte Bella',
  description: 'Ponte Bella — Luxury beauty boutique'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}

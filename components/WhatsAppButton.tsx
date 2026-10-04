"use client"

import React from 'react'
import { useContextStore } from '../store/useContextStore'

const PHONE = '<YOUR_PHONE_WITH_COUNTRY_CODE>' // e.g. 521234567890

function buildMessage(brand?: string, product?: string, catalog?: string) {
  const lines = [
    'Hello.',
    '',
    'I am interested in this product.',
    '',
  ]
  if (brand) lines.push(`Brand: ${brand}`)
  if (catalog) lines.push(`Catalog: ${catalog}`)
  if (product) lines.push(`Product: ${product}`)
  lines.push('', 'Is it available?')
  return encodeURIComponent(lines.join('\n'))
}

export default function WhatsAppButton() {
  const { brand, product, catalog } = useContextStore()
  const msg = buildMessage(brand, product, catalog)
  const href = `https://wa.me/${PHONE}?text=${msg}`

  return (
    <a
      className="fixed right-6 bottom-6 z-50 bg-primary p-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M20.52 3.48A11.96 11.96 0 0012 0C5.373 0 0 5.373 0 12a11.95 11.95 0 001.64 6.04L0 24l5.96-1.6A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.248-6.15-3.48-8.52z" fill="#fff" opacity="0.04"/>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.098-.472-.148-.672.149-.198.297-.768.966-.942 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.787-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.133-.132.297-.347.446-.52.151-.173.2-.298.3-.497.1-.198.05-.372-.025-.52-.074-.148-.672-1.612-.92-2.21-.242-.58-.487-.5-.672-.51l-.574-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.148.198 2.095 3.2 5.077 4.487 1.415.611 2.518.977 3.382 1.25 1.421.457 2.714.393 3.737.239.114-.054.348-.18.397-.347.05-.168.05-.31.035-.347-.015-.036-.297-.111-.644-.26z" fill="#fff"/>
      </svg>
    </a>
  )
}

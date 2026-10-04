"use client"

import React from 'react'
import { useContextStore } from '../store/useContextStore'

export default function WhatsAppDemoSetter(){
  const setContext = useContextStore((s) => s.setContext)
  return (
    <div className="p-4 flex gap-2">
      <button className="btn-outline" onClick={() => setContext({ brand: 'Yanbal', product: 'Perfume Temptation', catalog: 'Campaign 15' })}>Demo: Yanbal</button>
      <button className="btn-outline" onClick={() => setContext({ brand: 'Cyzone', product: 'Blush Satin', catalog: 'Campaign 8' })}>Demo: Cyzone</button>
    </div>
  )
}

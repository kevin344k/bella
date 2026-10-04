"use client"

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type Props = {
  imgNatural: string
  imgMakeup: string
  alt?: string
}

export default function HeroReveal({ imgNatural, imgMakeup, alt = 'Modelo Ponte Bella' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef({ x: 50, y: 50, r: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let clientRect: DOMRect | null = null

    function writeVars() {
      const { x, y, r } = posRef.current
      container.style.setProperty('--mx', `${x}%`)
      container.style.setProperty('--my', `${y}%`)
      container.style.setProperty('--mr', `${r}px`)
      rafRef.current = requestAnimationFrame(writeVars)
    }

    rafRef.current = requestAnimationFrame(writeVars)

    function onMove(e: PointerEvent | TouchEvent) {
      if (!clientRect) clientRect = container!.getBoundingClientRect()
      let clientX = 0
      let clientY = 0
      if ((e as TouchEvent).touches) {
        const t = (e as TouchEvent).touches[0]
        clientX = t.clientX
        clientY = t.clientY
      } else {
        const p = e as PointerEvent
        clientX = p.clientX
        clientY = p.clientY
      }
      const px = ((clientX - clientRect.left) / clientRect.width) * 100
      const py = ((clientY - clientRect.top) / clientRect.height) * 100
      posRef.current.x = Math.max(0, Math.min(100, px))
      posRef.current.y = Math.max(0, Math.min(100, py))
      posRef.current.r = window.innerWidth < 768 ? 120 : 180
      container.classList.add('pointer-active')
    }

    function onLeave() {
      container.classList.remove('pointer-active')
      posRef.current.r = 0
    }

    container.addEventListener('pointermove', onMove as any)
    container.addEventListener('pointerdown', onMove as any)
    container.addEventListener('pointerleave', onLeave as any)
    container.addEventListener('touchstart', onMove as any, { passive: true })
    container.addEventListener('touchmove', onMove as any, { passive: true })
    container.addEventListener('touchend', onLeave as any)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      container.removeEventListener('pointermove', onMove as any)
      container.removeEventListener('pointerdown', onMove as any)
      container.removeEventListener('pointerleave', onLeave as any)
      container.removeEventListener('touchstart', onMove as any)
      container.removeEventListener('touchmove', onMove as any)
      container.removeEventListener('touchend', onLeave as any)
    }
  }, [])

  const [debugVisible, setDebugVisible] = React.useState(false)
  const [makeupOpacity, setMakeupOpacity] = React.useState(1)
  const [showMakeupFull, setShowMakeupFull] = React.useState(false)
  const [offsetX, setOffsetX] = React.useState(0)
  const [offsetY, setOffsetY] = React.useState(0)
  const [makeupScale, setMakeupScale] = React.useState(1)

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-start px-6 md:px-24 z-10">
        <div className="max-w-xl">
          <motion.h1
            className="text-6xl font-serif tracking-widest text-text leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            PONTE BELLA
          </motion.h1>
          <motion.p className="mt-4 text-lg text-muted-foreground/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            Discover the most beautiful version of yourself.
          </motion.p>
          <div className="mt-8 flex gap-4">
            <button className="btn-primary px-6 py-3 rounded-xl-24">View Catalogs</button>
            <button className="btn-outline px-6 py-3 rounded-xl-24">Explore Products</button>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="hero-image absolute right-0 top-0 w-full md:w-1/2 h-full overflow-hidden">
        <img src={imgNatural} alt={alt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <img
          src={imgMakeup}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover makeup-layer"
          draggable={false}
          style={{
            opacity: makeupOpacity,
            WebkitMaskImage: showMakeupFull ? 'none' : undefined,
            maskImage: showMakeupFull ? 'none' : undefined,
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${makeupScale})`
          }}
        />
        <div className="cursor-halo pointer-events-none" aria-hidden />
      </div>

      {/* Debug / align helper */}
      <div className="fixed right-6 top-6 z-50">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-md text-sm">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Align Helper</label>
            <button className="ml-2 text-xs text-gray-600" onClick={() => setDebugVisible((s) => !s)}>{debugVisible ? 'Hide' : 'Show'}</button>
          </div>
          {debugVisible && (
            <div className="mt-2 w-72">
              <div className="mb-2">Makeup Opacity</div>
              <input type="range" min={0} max={1} step={0.01} value={makeupOpacity} onChange={(e) => setMakeupOpacity(Number(e.target.value))} className="w-full" />

              <div className="mt-3 mb-2">Offset X (px)</div>
              <input type="range" min={-80} max={80} step={1} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full" />
              <input type="number" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full mt-1 p-1 rounded border text-sm" />

              <div className="mt-3 mb-2">Offset Y (px)</div>
              <input type="range" min={-80} max={80} step={1} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full" />
              <input type="number" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full mt-1 p-1 rounded border text-sm" />

              <div className="mt-3 mb-2">Scale</div>
              <input type="range" min={0.95} max={1.05} step={0.001} value={makeupScale} onChange={(e) => setMakeupScale(Number(e.target.value))} className="w-full" />
              <input type="number" value={makeupScale} onChange={(e) => setMakeupScale(Number(e.target.value))} className="w-full mt-1 p-1 rounded border text-sm" />

              <div className="mt-2 flex items-center gap-2">
                <input id="showFull" type="checkbox" checked={showMakeupFull} onChange={(e) => setShowMakeupFull(e.target.checked)} />
                <label htmlFor="showFull">Show full makeup (disable mask)</label>
              </div>
              <div className="mt-2 text-xs text-gray-600">Use the sliders and numeric inputs to fine-tune alignment. Toggle full makeup to overlay the makeup image without the mask.</div>
            </div>
          )}
        </div>
      </div>

      {/* floating particles (pure CSS) */}
      <div className="pointer-events-none">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>
    </section>
  )
}

"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type Props = {
  imgNatural: string
  imgMakeup: string
  alt?: string
}

export default function HeroReveal({ imgNatural, imgMakeup, alt = 'Modelo Ponte Bella' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handlePointer(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect()
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))

      container!.style.setProperty('--mx', `${x}%`)
      container!.style.setProperty('--my', `${y}%`)

      // El efecto reveal con cursor se aplica exclusivamente en la mitad que no lleva maquillaje (x <= 50%)
      if (x <= 50) {
        container!.classList.add('pointer-active-left')
      } else {
        container!.classList.remove('pointer-active-left')
      }
    }

    function onPointerMove(e: MouseEvent | PointerEvent) {
      handlePointer(e.clientX, e.clientY)
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    function resetReveal() {
      container!.classList.remove('pointer-active-left')
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerdown', onPointerMove)
    container.addEventListener('mousemove', onPointerMove)
    container.addEventListener('pointerleave', resetReveal)
    container.addEventListener('mouseleave', resetReveal)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchstart', onTouchMove, { passive: true })
    container.addEventListener('touchend', resetReveal)

    return () => {
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerdown', onPointerMove)
      container.removeEventListener('mousemove', onPointerMove)
      container.removeEventListener('pointerleave', resetReveal)
      container.removeEventListener('mouseleave', resetReveal)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchstart', onTouchMove)
      container.removeEventListener('touchend', resetReveal)
    }
  }, [])

  return (
    <section id="inicio" className="pb-hero relative w-full overflow-hidden bg-[#fff7f5] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Columna de presentación */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 shadow-sm backdrop-blur">
              Tu belleza, a tu manera
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.06] tracking-wide text-stone-900 sm:text-6xl lg:text-7xl">
              Descubre tu
              <span className="block italic text-rose-700">mejor versión.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
              Explora maquillaje, cuidado y fragancias de tus marcas favoritas. Pasa el cursor por el rostro para ver la transformación.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#catalogos"
                className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                Ver catálogos
              </a>
              <a
                href="#marcas"
                className="btn-outline inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white"
              >
                Nuestras marcas
              </a>
            </div>
          </motion.div>
        </div>

        {/* Columna interactiva: división a la mitad + reveal interactivo en el lado sin maquillaje */}
        <div className="w-full flex justify-center">
          <div
            ref={containerRef}
            className="hero-image relative w-full max-w-[460px] md:max-w-[500px] aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(244,180,195,0.35)] border border-rose-100 select-none bg-stone-100"
            role="region"
            aria-label="Demostración interactiva de belleza dividida a la mitad"
          >
            {/* 1. Capa base: rostro al natural completo */}
            <img
              src={imgNatural}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* 2. Capa fija con maquillaje: mitad derecha (50% a 100%) */}
            <img
              src={imgMakeup}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
              draggable={false}
            />

            {/* 3. Capa interactiva: revela maquillaje en la mitad sin maquillaje (0% a 50%) con el cursor */}
            <img
              src={imgMakeup}
              alt={alt}
              className="makeup-reveal-interactive absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
              draggable={false}
            />

            {/* Línea divisoria central sutil y elegante a la mitad */}
            <div
              className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.9)] pointer-events-none z-10"
              aria-hidden="true"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/95 shadow-md border border-rose-200/70 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            </div>

            {/* Halo de luz suave centrado en el cursor sobre el lado sin maquillaje */}
            <div className="cursor-halo pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

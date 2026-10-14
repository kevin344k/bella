"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  BookOpen, 
  Tag, 
  Home as HomeIcon, 
  Layers, 
  MessageCircle, 
  Menu, 
  X, 
  Clock,
  ChevronRight,
  ShoppingBag
} from "lucide-react"
import { useCartStore } from "../store/useCartStore"

const NAV_LINKS = [
  { name: "Inicio", href: "#inicio", icon: Sparkles },
  { name: "Marcas", href: "#marcas", icon: Layers },
  { 
    name: "Ofertas", 
    href: "#ofertas", 
    icon: Tag,
    badge: "SALE",
    badgeColor: "bg-rose-600 text-white animate-pulse"
  },
  { name: "Categorías", href: "#categorias", icon: HomeIcon },
  { 
    name: "Catálogos", 
    href: "#catalogos", 
    icon: BookOpen,
    badge: "C12 2026",
    badgeColor: "bg-rose-100 text-rose-800"
  },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.qty, 0))
  const setCartOpen = useCartStore((s) => s.setOpen)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const cartButton = (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label="Abrir carrito"
      className="relative p-2.5 rounded-full border border-rose-200/80 bg-white text-stone-800 hover:text-rose-700 hover:border-rose-300 transition-colors"
    >
      <ShoppingBag className="w-4 h-4" />
      {mounted && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">{cartCount}</span>
      )}
    </button>
  )

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      const sections = ["inicio", "marcas", "ofertas", "categorias", "catalogos"]
      const scrollPosition = window.scrollY + 130

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith("#")) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.href = "/" + href
      }
    }
  }

  return (
    <>
      {/* Top micro announcement bar */}
      <aside aria-label="Aviso de novedades" className="relative z-50 bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-stone-300 font-medium">Atención activa</span>
            <span className="hidden sm:inline text-stone-500">•</span>
            <span className="text-stone-300 hidden sm:inline">
              Campaña 12 · Catálogos Ésika, L&apos;Bel, Cyzone y Colección Hogar
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-300">
            <a
              href="https://wa.me/593999312678?text=Hola%20Ponte%20Bella%2C%20quisiera%20asesor%C3%ADa%20sobre%20los%20productos%20y%20cat%C3%A1logos"
              target="_blank"
              rel="noreferrer"
              className="hover:text-rose-300 transition-colors inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Pedidos por WhatsApp</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-stone-400">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>Envíos a domicilio</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/92 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-rose-100/90 py-3"
            : "bg-white/80 backdrop-blur-sm border-b border-rose-100/50 py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick("#inicio")
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            {/* Elegant Monogram Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-rose-300 to-amber-200 p-[1px] shadow-sm group-hover:shadow-md transition-shadow">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center transition-colors group-hover:bg-rose-50/50">
                <span className="font-serif text-lg font-bold bg-gradient-to-r from-rose-700 to-stone-900 bg-clip-text text-transparent">
                  PB
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-stone-900 uppercase leading-none group-hover:text-rose-800 transition-colors">
                Ponte Bella
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-rose-600 font-semibold mt-1">
                Boutique & Home
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "text-rose-900 bg-rose-100/70 border border-rose-300/70 shadow-xs"
                      : "text-stone-700 hover:text-stone-950 hover:bg-rose-50/60"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${link.badgeColor}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {cartButton}
            <a
              href="#catalogos"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick("#catalogos")
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200/80 hover:bg-rose-100 hover:border-rose-300 transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-700" />
              <span>Ver Catálogos</span>
            </a>

            <a
              href="https://wa.me/593999312678?text=Hola%20Ponte%20Bella%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20de%20sus%20productos"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-800 hover:to-rose-800 shadow-md shadow-rose-900/15 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Asesoría WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <span className="sm:hidden">{cartButton}</span>
            <a
              href="#catalogos"
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick("#catalogos")
              }}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-full text-rose-700 bg-rose-50 border border-rose-200"
              aria-label="Ir a catálogos"
            >
              <BookOpen className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl border border-stone-200/80 bg-white text-stone-800 hover:text-rose-700 hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all shadow-xs"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto bg-stone-950/40 backdrop-blur-sm"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`ml-auto w-full max-w-sm h-full bg-white flex flex-col shadow-2xl border-l border-rose-100 overflow-y-auto transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header inside drawer */}
          <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-[#fffbfb]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-400 to-amber-200 p-[1px]">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <span className="font-serif text-base font-bold text-rose-700">PB</span>
                </div>
              </div>
              <div>
                <span className="font-serif font-bold text-stone-900 tracking-wider text-base block">
                  PONTE BELLA
                </span>
                <span className="text-[10px] text-rose-600 font-semibold tracking-widest uppercase">
                  Boutique & Hogar
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar navegación"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="p-6 flex-1 flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest px-3 mb-1">
              Secciones
            </span>

            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = activeSection === link.href.replace("#", "")
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-rose-50 text-rose-900 border border-rose-200/80 font-semibold shadow-xs"
                      : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive
                          ? "bg-rose-200/70 text-rose-800"
                          : "bg-stone-100 text-stone-600 group-hover:bg-rose-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${link.badgeColor}`}
                      >
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </a>
              )
            })}

            {/* Info Card inside drawer */}
            <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Campaña 12 Activa
              </span>
              <p className="text-xs leading-5 text-stone-600">
                Hojéalos en tiempo real o escríbenos para solicitar pedidos especiales con envío seguro.
              </p>
            </div>
          </nav>

          {/* Footer actions inside drawer */}
          <div className="p-6 border-t border-rose-100 bg-[#fffdfd] flex flex-col gap-3">
            <a
              href="https://wa.me/593999312678?text=Hola%20Ponte%20Bella%2C%20quisiera%20asesor%C3%ADa%20sobre%20sus%20productos%20y%20muebles"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-700 to-rose-600 text-white font-semibold text-sm shadow-md shadow-rose-900/15 hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp</span>
            </a>

            <div className="text-center text-[11px] text-stone-400 mt-1">
              Ponte Bella © 2026 · Experiencia de Belleza & Hogar
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

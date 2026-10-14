import Link from "next/link";
import { MessageCircle, Truck, ShieldCheck, CreditCard } from "lucide-react";

const WA = "593999312678";

const NAV = [
  { name: "Inicio", href: "/#inicio" },
  { name: "Ofertas", href: "/#ofertas" },
  { name: "Categorías", href: "/#categorias" },
  { name: "Catálogos", href: "/#catalogos" },
  { name: "Todas las ofertas", href: "/ofertas" },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              Icon: Truck,
              t: "Envíos a domicilio",
              d: "Coordinamos la entrega por WhatsApp",
            },
            {
              Icon: CreditCard,
              t: "Pago seguro",
              d: "Tarjeta con Payphone o por WhatsApp",
            },
            {
              Icon: ShieldCheck,
              t: "Marcas originales",
              d: "Ésika, L’Bel, Cyzone y Yanbal",
            },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-rose-400">
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t}</p>
                <p className="text-xs text-stone-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-400 via-rose-300 to-amber-200 font-serif font-bold text-stone-900">
              PB
            </span>
            <span className="font-serif text-2xl font-bold tracking-[0.18em] uppercase text-white">
              Ponte Bella
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
            Tu boutique de belleza, fragancias y hogar. Catálogos digitales,
            ofertas y atención personalizada desde Ecuador.
          </p>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola Ponte Bella, quisiera más información")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-700 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-rose-800 hover:to-rose-700 transition"
          >
            <MessageCircle className="w-4 h-4" /> Escríbenos por WhatsApp
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Explora
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.name}>
                <Link
                  href={l.href}
                  className="text-stone-400 hover:text-rose-300 transition-colors"
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-stone-400">
            <li>
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-rose-300 transition-colors"
              >
                WhatsApp: 099 931 2678
              </a>
            </li>
            <li>Ecuador</li>
            <li>Atención por WhatsApp</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Ponte Bella. Todos los derechos
            reservados.
          </p>
          <p>
            Hecho con cariño por{" "}
            <a
              href="https://www.labsproductivity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors duration-300"
            >
              {"{Productivity Labs}"}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

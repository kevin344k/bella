import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = { id: string; name: string; price: number; image: string; qty: number; stock: number }

type CartState = {
  items: CartItem[]
  open: boolean
  add: (p: Omit<CartItem, 'qty'>) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  setOpen: (o: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (p) =>
        set((s) => {
          const ex = s.items.find((i) => i.id === p.id)
          const max = p.stock > 0 ? p.stock : 99
          if (ex) return { items: s.items.map((i) => (i.id === p.id ? { ...i, ...p, qty: Math.min(i.qty + 1, max) } : i)), open: true }
          return { items: [...s.items, { ...p, qty: 1 }], open: true }
        }),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, i.stock > 0 ? i.stock : 99) } : i)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: 'pb-cart', partialize: (s) => ({ items: s.items }) }
  )
)

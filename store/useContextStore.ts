import { create } from 'zustand'

type ContextState = {
  brand?: string
  product?: string
  catalog?: string
  setContext: (ctx: Partial<Omit<ContextState, 'setContext'>>) => void
  clearContext: () => void
}

export const useContextStore = create<ContextState>((set) => ({
  brand: undefined,
  product: undefined,
  catalog: undefined,
  setContext: (ctx) => set((s) => ({ ...s, ...ctx })),
  clearContext: () => set({ brand: undefined, product: undefined, catalog: undefined })
}))

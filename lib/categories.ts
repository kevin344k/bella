export const CATEGORIES = [
  { slug: 'mujer', label: 'Mujer' },
  { slug: 'hombre', label: 'Hombre' },
  { slug: 'ninos', label: 'Niños' },
  { slug: 'hogar', label: 'Hogar' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']
export const categoryLabel = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.label || slug

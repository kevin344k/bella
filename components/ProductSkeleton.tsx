export default function ProductSkeleton() {
  return (
    <div className="h-full bg-white rounded-2xl overflow-hidden border border-rose-100/70 animate-pulse" aria-hidden="true">
      <div className="aspect-square bg-stone-200/70" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-2.5 w-1/3 rounded bg-stone-200" />
        <div className="h-4 w-4/5 rounded bg-stone-200" />
        <div className="h-5 w-1/2 rounded bg-stone-200" />
        <div className="h-10 w-full rounded-full bg-stone-200" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" role="status" aria-label="Cargando productos">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  )
}

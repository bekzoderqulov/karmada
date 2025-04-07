export default function Loading() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-40 bg-muted/50 rounded animate-pulse"></div>
        <div className="h-10 w-48 bg-muted/50 rounded animate-pulse"></div>
      </div>

      <div className="h-12 w-full bg-muted/50 rounded animate-pulse"></div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/50 rounded animate-pulse"></div>
          ))}
        </div>

        <div className="h-[400px] bg-muted/50 rounded animate-pulse"></div>
      </div>
    </div>
  )
}


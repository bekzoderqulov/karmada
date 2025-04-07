import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-7 w-40" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-10 w-full" />
          </div>

          <Card>
            <CardHeader className="py-3">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </CardContent>
            <div className="p-6 pt-0">
              <Skeleton className="h-8 w-24" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


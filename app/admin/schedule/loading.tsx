import { Skeleton } from "@/components/ui/skeleton"

export default function ScheduleLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-full mb-6" />

        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}


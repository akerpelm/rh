import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function WeeklyScheduleSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 py-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-[100px]" />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="relative">
            {/* Table header */}
            <div className="border-b">
              <div className="grid grid-cols-6 gap-2 px-4 py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Table body */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b px-4 py-4">
                <div className="grid grid-cols-6 gap-2 items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[70px]" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function LocalCommunitySkeleton() {
  return (
    <section className="py-12 md:py-20 bg-muted/40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-72 mx-auto mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PopularClubsSkeleton() {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

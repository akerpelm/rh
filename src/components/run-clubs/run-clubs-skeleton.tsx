import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function RunClubsSkeletonList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-56" />
      </div>

      {/* Mobile skeleton */}
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <MobileRunClubCardSkeleton key={i} />
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RunClubCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function MobileRunClubCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col p-3">
        {/* Top row skeleton */}
        <div className="flex">
          {/* Logo skeleton */}
          <Skeleton className="h-12 w-12 rounded-full mr-3" />

          {/* Content skeleton */}
          <div className="flex-1">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-3 w-3" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Bottom row skeleton */}
        <div className="mt-2 pt-2 border-t flex justify-between">
          {/* Run types skeleton */}
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* Runs per week skeleton */}
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  )
}

function RunClubCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4">
        {/* Logo skeleton */}
        <Skeleton className="h-16 w-16 rounded-full" />

        {/* Name and location skeleton */}
        <div className="flex flex-col space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2 pt-0 flex-1">
        {/* Run types section skeleton */}
        <div className="mb-2">
          <div className="flex items-center mb-1">
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        {/* Atmosphere section skeleton */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Info skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <div className="mt-auto">
        <Separator />
        <CardFooter className="p-4 justify-between items-center">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </CardFooter>
      </div>
    </Card>
  )
}

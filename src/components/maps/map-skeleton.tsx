import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface MapSkeletonProps {
  className?: string
}

export function MapSkeleton({ className }: MapSkeletonProps) {
  return (
    <div className={cn('relative w-full h-full flex', className)}>
      {/* Sidebar skeleton */}
      <div className="w-80 bg-card border-r">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="p-2 space-y-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Map skeleton */}
      <div className="flex-1 bg-muted/20 relative">
        {/* Map grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-muted/10" />
          ))}
        </div>

        {/* Fake map features */}
        <div className="absolute inset-0 p-4">
          <Skeleton className="h-[30%] w-[40%] absolute top-[15%] left-[5%] rounded-full opacity-10" />
          <Skeleton className="h-[25%] w-[35%] absolute top-[30%] right-[15%] rounded-full opacity-10" />
          <Skeleton className="h-[10%] w-[70%] absolute bottom-[20%] left-[15%] rounded-md opacity-10" />
          <Skeleton className="h-[5%] w-[80%] absolute bottom-[10%] left-[10%] rounded-md opacity-10" />
        </div>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]">
          <div className="relative">
            <MapPin className="h-8 w-8 text-primary/80 animate-ping absolute inset-0" />
            <MapPin className="h-8 w-8 text-primary relative z-10" />
          </div>
          <div className="mt-4 text-sm font-medium">Loading map...</div>
          <div className="mt-2 flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse delay-150" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse delay-300" />
          </div>
        </div>

        {/* Map controls mockup */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  )
}

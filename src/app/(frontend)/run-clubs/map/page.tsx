import { Suspense } from 'react'
import { Metadata } from 'next'
import { getRunClubs } from '@/lib/api/run-clubs'
import { MapSkeleton } from '@/components/maps/map-skeleton'
import { ClubMapView } from '@/components/maps/club-map-view'

export const metadata: Metadata = {
  title: 'NYC Running Club Map | NYC Running Hub',
  description: 'Explore running clubs across New York City on an interactive map',
}

export default async function RunClubMapPage() {
  // Fetch all clubs to display on the map
  const { runClubs } = await getRunClubs({
    page: 1,
    limit: 100,
  })

  return (
    <div className="absolute inset-0 h-[100vh] flex flex-col pt-14 sm:pt-16">
      <div className="px-3 py-2 sm:px-4 sm:py-4 bg-background border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">NYC Running Clubs Map</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explore {runClubs.length} running clubs across New York City
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<MapSkeleton className="flex-1" />}>
        <ClubMapView clubs={runClubs} className="flex-1" />
      </Suspense>
    </div>
  )
}

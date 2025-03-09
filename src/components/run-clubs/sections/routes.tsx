import { RunClub } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink } from 'lucide-react'
import { ensureMedia } from '@/lib/utils/payload-transforms'
import Image from 'next/image'
import Link from 'next/link'

interface RoutesListProps {
  routes: RunClub['routes']
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  moderate: 'bg-yellow-500',
  hard: 'bg-red-500',
}

const TERRAIN_BADGES = {
  road: { label: 'Road', class: 'bg-slate-500' },
  trail: { label: 'Trail', class: 'bg-emerald-500' },
  track: { label: 'Track', class: 'bg-blue-500' },
  hills: { label: 'Hills', class: 'bg-purple-500' },
}

export function RoutesList({ routes }: RoutesListProps) {
  if (!routes?.length) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((route, index) => {
        const mapImage = ensureMedia(route.mapImage)

        return (
          <Card key={index} className="overflow-hidden group">
            {mapImage?.url && (
              <div className="relative aspect-[3/2]">
                <Image src={mapImage.url} alt={route.name} fill className="object-cover" />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {route.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {route.distance && (
                  <Badge variant="outline" className="text-xs">
                    {route.distance}mi
                  </Badge>
                )}
                {route.difficulty && (
                  <Badge
                    className={`text-xs ${DIFFICULTY_COLORS[route.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
                  >
                    {route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1)}
                  </Badge>
                )}
              </div>
              {route.stravaLink && (
                <Link
                  href={route.stravaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                >
                  View on Strava
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

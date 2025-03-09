import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink } from 'lucide-react'
import { RunClub } from '@/payload-types'
import { ensureMedia } from '@/lib/utils/payload-transforms'
import Image from 'next/image'
import Link from 'next/link'

interface FeaturedRouteProps {
  route: NonNullable<RunClub['routes']>[number]
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

export function FeaturedRoute({ route }: FeaturedRouteProps) {
  const mapImage = ensureMedia(route.mapImage)

  return (
    <Card className="overflow-hidden">
      {mapImage?.url && (
        <div className="relative h-48 w-full">
          <Image src={mapImage.url} alt={route.name} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {route.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {route.distance && <Badge variant="outline">{route.distance} miles</Badge>}
          {route.difficulty && (
            <Badge
              className={DIFFICULTY_COLORS[route.difficulty as keyof typeof DIFFICULTY_COLORS]}
            >
              {route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1)}
            </Badge>
          )}
          {route.terrain?.map((terrain) => (
            <Badge
              key={terrain}
              className={TERRAIN_BADGES[terrain as keyof typeof TERRAIN_BADGES].class}
            >
              {TERRAIN_BADGES[terrain as keyof typeof TERRAIN_BADGES].label}
            </Badge>
          ))}
        </div>
        {route.description && <p className="text-sm text-muted-foreground">{route.description}</p>}
        {route.stravaLink && (
          <Link
            href={route.stravaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
          >
            View on Strava
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

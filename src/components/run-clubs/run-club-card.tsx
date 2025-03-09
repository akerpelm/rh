import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RunClub, Borough, Neighborhood } from '@/payload-types'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'

interface RunClubCardProps {
  club: RunClub
}

export function RunClubCard({ club }: RunClubCardProps) {
  // Get borough and neighborhood info
  const borough = club.borough as Borough
  const neighborhood = ensureNeighborhood(club.primaryNeighborhood)

  // Get run days (unique)
  const runDays = Array.from(new Set(club.schedule?.map((run) => run.day) || []))

  // Format run days for display
  const formatRunDays = () => {
    if (!runDays.length) return 'No scheduled runs'

    if (runDays.length <= 3) {
      return runDays.map(capitalize).join(', ')
    }

    return `${runDays.length} days/week`
  }

  // Get run types
  const runTypes = Array.from(new Set(club.schedule?.map((run) => run.runType) || []))

  return (
    <Link href={`/run-clubs/${club.slug}`} className="block group">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        {club.logo ? (
          <div className="relative w-full h-32 bg-muted">
            <Image
              src={club.logo.url || ''}
              alt={club.name}
              fill
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 60%, ${club.brandColor || '#000'})`,
                opacity: 0.1,
              }}
            />
          </div>
        ) : (
          <div
            className="w-full h-32"
            style={{ backgroundColor: club.brandColor || 'var(--muted)' }}
          />
        )}

        <CardContent className="p-4">
          <h3
            className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate"
            style={{ color: club.brandColor || undefined }}
          >
            {club.name}
          </h3>

          {(borough || neighborhood) && (
            <div className="flex items-center text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3 shrink-0 mr-1" />
              <span className="truncate">
                {neighborhood?.name && `${neighborhood.name}, `}
                {borough?.name || ''}
              </span>
            </div>
          )}

          <p className="text-sm line-clamp-2 mb-3 text-muted-foreground">{club.description}</p>

          {runDays.length > 0 && (
            <div className="flex items-center text-xs text-muted-foreground mb-3">
              <Calendar className="h-3 w-3 shrink-0 mr-1" />
              <span>{formatRunDays()}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mt-3">
            {runTypes.slice(0, 3).map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="text-[10px]"
                style={{
                  backgroundColor: `${club.brandColor}15` || undefined,
                  color: club.brandColor || undefined,
                }}
              >
                {capitalize(type)}
              </Badge>
            ))}
            {runTypes.length > 3 && (
              <Badge variant="outline" className="text-[10px]">
                +{runTypes.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {club.schedule?.length || 0} run{club.schedule?.length !== 1 ? 's' : ''} per week
          </span>
          <span className="text-xs flex items-center font-medium group-hover:text-primary transition-colors">
            View details <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

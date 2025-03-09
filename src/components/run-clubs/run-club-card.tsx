import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { StravaIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ensureValidURL } from '@/lib/utils/urls'
import { RunClub } from '@/payload-types'
import { ensureBorough, ensureMedia } from '@/lib/utils/payload-transforms'

interface RunClubCardProps {
  club: RunClub
}

export function RunClubCard({ club }: RunClubCardProps) {
  const logo = ensureMedia(club.logo)
  const borough = ensureBorough(club.borough)
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          {logo?.url ? (
            <div className="relative h-16 w-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image src={logo.url} alt={club.name} fill className="object-contain" />
            </div>
          ) : (
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-muted-foreground">
                {club.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg line-clamp-1">{club.name}</h3>
              <Badge variant="secondary" className="flex-shrink-0">
                {borough?.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {typeof club.description === 'string' ? club.description : ''}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {club.schedule?.slice(0, 2).map((run, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm border-l-2 border-primary/20 pl-3"
            >
              <div className="flex-1">
                <p className="font-medium capitalize">
                  {run.day}s @ {run.time}
                </p>
                <p className="text-muted-foreground text-xs">
                  {run.runType === 'workout'
                    ? '🏃 Workout'
                    : run.runType === 'long'
                      ? '🛣️ Long Run'
                      : run.runType === 'easy'
                        ? '😌 Easy Run'
                        : run.runType === 'social'
                          ? '🤝 Social Run'
                          : run.runType}
                </p>
              </div>
              {run.distance?.min && run.distance?.max && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {run.distance.min}-{run.distance.max}mi
                </span>
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            {club.socialMedia?.instagram && (
              <Link
                href={ensureValidURL(club.socialMedia.instagram)}
                className="text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            )}
            {club.socialMedia?.strava && (
              <Link
                href={ensureValidURL(club.socialMedia.strava)}
                className="text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StravaIcon className="h-4 w-4" />
              </Link>
            )}
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link href={`/run-clubs/${club.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

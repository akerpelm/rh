import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RunClub, Borough, Neighborhood } from '@/payload-types'
import { MapPin, Calendar, Users, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ensureNeighborhood, ensureMedia } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'

interface RunClubCardProps {
  club: RunClub
  featured?: boolean
}

export function RunClubCard({ club, featured = false }: RunClubCardProps) {
  // Get borough and neighborhood info
  const borough = club.borough as Borough
  const neighborhood = ensureNeighborhood(club.primaryNeighborhood)
  const logo = ensureMedia(club.logo)

  // Get run days (unique)
  const runDays = Array.from(new Set(club.schedule?.map((run) => run.day) || []))

  // Get run types (unique)
  const runTypes = Array.from(new Set(club.schedule?.map((run) => run.runType) || []))

  // Get atmosphere tags
  const atmosphereTags = club.clubCulture?.atmosphere || []

  // Format run days for display
  const formatRunDays = () => {
    if (!runDays.length) return 'No scheduled runs'
    if (runDays.length <= 2) return runDays.map(capitalize).join(', ')
    return `${runDays.length} days/week`
  }

  // Create short description
  const shortDescription = club.description
    ? club.description.length > 100
      ? club.description.substring(0, 100) + '...'
      : club.description
    : 'No description available'

  // Max items to show before "show more"
  const MAX_VISIBLE = 3
  const hasMoreRunTypes = runTypes.length > MAX_VISIBLE
  const hasMoreAtmosphere = atmosphereTags.length > MAX_VISIBLE

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4">
        {/* Logo/Avatar Area */}
        <div className="relative">
          {logo?.url ? (
            <div className="h-16 w-16 rounded-full overflow-hidden border border-border">
              <Image
                src={logo.url}
                alt={club.name}
                width={64}
                height={64}
                className="object-cover h-full w-full"
              />
            </div>
          ) : (
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center"
              style={{
                background: club.brandColor
                  ? `linear-gradient(135deg, ${club.brandColor}, ${club.brandColor}99)`
                  : 'linear-gradient(135deg, var(--primary), var(--primary-foreground))',
              }}
            >
              <span className="text-xl font-bold text-white">{club.name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Club Info */}
        <div className="flex flex-col">
          <h3
            className="text-lg font-semibold line-clamp-1"
            style={{ color: club.brandColor || undefined }}
          >
            {club.name}
          </h3>

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {neighborhood?.name
                ? `${neighborhood.name}, ${borough?.name || ''}`
                : borough?.name || 'New York'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2 pt-0 flex-1">
        {/* Short Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{shortDescription}</p>

        {/* Run Types - First row */}
        {runTypes.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center mb-1">
              <span className="text-xs text-muted-foreground">Run Types</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {runTypes.slice(0, MAX_VISIBLE).map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  style={{
                    backgroundColor: club.brandColor ? `${club.brandColor}15` : undefined,
                    color: club.brandColor || undefined,
                  }}
                >
                  {capitalize(type)}
                </Badge>
              ))}

              {hasMoreRunTypes && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">
                      +{runTypes.length - MAX_VISIBLE}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <div>
                      <h4 className="text-sm font-medium mb-2">All Run Types</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {runTypes.slice(MAX_VISIBLE).map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            style={{
                              backgroundColor: club.brandColor ? `${club.brandColor}15` : undefined,
                              color: club.brandColor || undefined,
                            }}
                          >
                            {capitalize(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        )}

        {/* Atmosphere Tags - Second row */}
        {atmosphereTags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-xs text-muted-foreground">Atmosphere</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {atmosphereTags.slice(0, MAX_VISIBLE).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag === 'no-drop' ? 'No Drop' : capitalize(tag.replace(/-/g, ' '))}
                </Badge>
              ))}

              {hasMoreAtmosphere && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent/50">
                      +{atmosphereTags.length - MAX_VISIBLE}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <div>
                      <h4 className="text-sm font-medium mb-2">All Atmosphere Tags</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atmosphereTags.slice(MAX_VISIBLE).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag === 'no-drop' ? 'No Drop' : capitalize(tag.replace(/-/g, ' '))}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        )}

        {/* Run Info */}
        <div className="flex items-center gap-4 text-sm mb-2">
          {runDays.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 opacity-70" />
              <span>{formatRunDays()}</span>
            </div>
          )}

          {club.schedule && club.schedule.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 opacity-70" />
              <span>{club.schedule.length} runs/week</span>
            </div>
          )}
        </div>
      </CardContent>

      <div className="mt-auto">
        <Separator />
        <CardFooter className="p-4 flex justify-between items-center">
          {club.website && (
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href={club.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Website
              </Link>
            </Button>
          )}

          <Button size="sm" className="ml-auto" asChild>
            <Link href={`/run-clubs/${club.slug}`}>
              View club
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

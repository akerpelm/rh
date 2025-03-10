import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RunClub, Borough, Neighborhood } from '@/payload-types'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ensureNeighborhood, ensureMedia } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'

interface MobileRunClubCardProps {
  club: RunClub
}

export function MobileRunClubCard({ club }: MobileRunClubCardProps) {
  // Get borough and neighborhood info
  const borough = club.borough as Borough
  const neighborhood = ensureNeighborhood(club.primaryNeighborhood)
  const logo = ensureMedia(club.logo)

  // Get run days (unique)
  const runDays = Array.from(new Set(club.schedule?.map((run) => run.day) || []))

  // Get run types (unique)
  const runTypes = Array.from(new Set(club.schedule?.map((run) => run.runType) || []))

  return (
    <Card className="overflow-hidden">
      <Link href={`/run-clubs/${club.slug}`} className="block">
        <div className="flex flex-col p-3">
          {/* Top row with logo and basic info */}
          <div className="flex">
            {/* Logo/Avatar */}
            <div className="relative mr-3 flex-shrink-0">
              {logo?.url ? (
                <div className="h-12 w-12 rounded-full overflow-hidden border border-border">
                  <Image
                    src={logo.url}
                    alt={club.name}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : (
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{
                    background: club.brandColor
                      ? `linear-gradient(135deg, ${club.brandColor}, ${club.brandColor}99)`
                      : 'linear-gradient(135deg, var(--primary), var(--primary-foreground))',
                  }}
                >
                  <span className="text-lg font-bold text-white">{club.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-1">
                <h3
                  className="font-medium text-sm line-clamp-1"
                  style={{ color: club.brandColor || undefined }}
                >
                  {club.name}
                </h3>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              </div>

              <div className="flex items-center text-xs text-muted-foreground gap-1 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {neighborhood?.name || borough?.name || 'New York'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row with run types and runs/week */}
          <div className="mt-2 pt-2 border-t flex justify-between items-center">
            {/* Run types with horizontal scrolling */}
            <div className="flex-1 overflow-x-auto scrollbar-hide pr-2">
              <div className="flex gap-1.5 flex-nowrap">
                {runTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="text-[10px] py-0 px-1.5 h-5 whitespace-nowrap"
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

            {/* Runs per week stat */}
            {club.schedule && club.schedule.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <Users className="h-3 w-3 shrink-0" />
                <span>{club.schedule.length} runs/wk</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}

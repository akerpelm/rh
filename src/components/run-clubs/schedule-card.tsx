import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import { RunClub } from '@/payload-types'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'

interface ScheduleCardProps {
  run: NonNullable<RunClub['schedule']>[number]
  clubColor?: string
  compact?: boolean
}

export function ScheduleCard({ run, clubColor, compact }: ScheduleCardProps) {
  const neighborhood = ensureNeighborhood(run.meetingLocation?.neighborhood)

  return (
    <Card className="overflow-hidden">
      <div className="h-0.5 w-full" style={{ backgroundColor: clubColor || 'var(--primary)' }} />
      <CardContent className="p-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-medium truncate">
                {capitalize(run.day)}s @ {run.time}
              </h3>
              <Badge variant="secondary" className="text-xs shrink-0">
                {run.runType}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{run.meetingLocation.name}</span>
              {neighborhood && (
                <span className="truncate before:content-['·'] before:mx-1">
                  {neighborhood.name}
                </span>
              )}
            </div>
          </div>

          {(run.distance || run.pace) && (
            <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
              {run.distance && (
                <span>
                  {run.distance.min}-{run.distance.max}mi
                </span>
              )}
              {run.pace && (
                <span>
                  {run.pace.min}-{run.pace.max}/mi
                </span>
              )}
            </div>
          )}
        </div>

        {!compact && run.details && (
          <p className="mt-2 text-xs text-muted-foreground">{run.details}</p>
        )}
      </CardContent>
    </Card>
  )
}

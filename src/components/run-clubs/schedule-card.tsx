import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink } from 'lucide-react'
import { RunClub } from '@/payload-types'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'
import { RouteMap } from '@/components/maps/route-map'

const RUN_TYPE_COLORS = {
  easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
  workout: 'bg-red-500/10 text-red-700 dark:text-red-400',
  long: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  recovery: 'bg-slate-500/10',
  shakeout: 'bg-slate-500/10',
  'race-pace': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  hills: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  track: 'bg-red-500/10 text-red-700 dark:text-red-400',
  social: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
} as const

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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="text-sm font-medium">
                {capitalize(run.day)}s @ {run.time}
              </h3>
              <Badge
                variant="secondary"
                className={`text-xs shrink-0 ${RUN_TYPE_COLORS[run.runType as keyof typeof RUN_TYPE_COLORS] || ''}`}
              >
                {run.runType.charAt(0).toUpperCase() + run.runType.slice(1)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{run.meetingLocation.name}</span>
              {neighborhood && (
                <span className="before:content-['·'] before:mx-1">{neighborhood.name}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="flex flex-wrap gap-2 text-xs">
              {run.distance && (
                <Badge variant="outline" className="font-mono">
                  {run.distance.min}-{run.distance.max}mi
                </Badge>
              )}
              {run.pace && (
                <Badge variant="outline" className="font-mono">
                  {run.pace.min}-{run.pace.max}/mi
                </Badge>
              )}
            </div>
            {run.route?.mapUrl && <RouteMap mapUrl={run.route.mapUrl} clubColor={clubColor} />}
          </div>
        </div>

        {!compact && run.details && (
          <p className="mt-2 text-xs text-muted-foreground">{run.details}</p>
        )}
      </CardContent>
    </Card>
  )
}

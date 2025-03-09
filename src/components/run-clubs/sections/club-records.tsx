import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { RunClub } from '@/payload-types'
import { format } from 'date-fns'

interface ClubRecordsProps {
  records: NonNullable<RunClub['clubRecords']>
  clubColor?: string
}

export function ClubRecords({ records, clubColor }: ClubRecordsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <Card key={record.id} className="p-3">
          <div className="flex flex-col items-center text-center gap-3">
            <Badge variant="outline" className="text-xs">
              {(record.event ?? 'Unknown').toUpperCase()}
            </Badge>
            <Badge
              className="text-background px-4 py-2 text-lg font-mono"
              style={{ backgroundColor: clubColor || 'var(--primary)' }}
            >
              {record.time}
            </Badge>
            <div>
              <p className="text-sm font-medium">{record.athleteName}</p>
              <p className="text-xs text-muted-foreground">
                {record.eventName} • {format(new Date(record.date ?? Date.now()), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

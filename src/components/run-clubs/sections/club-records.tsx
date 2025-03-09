import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { RunClub } from '@/payload-types'
import { format } from 'date-fns'
import { Trophy } from 'lucide-react'

interface ClubRecordsProps {
  records: NonNullable<RunClub['clubRecords']>
  clubColor?: string
}

const EVENT_ORDER = ['mile', '5k', '10k', 'half', 'marathon'] as const
const EVENT_NAMES: Record<(typeof EVENT_ORDER)[number], string> = {
  mile: 'Mile',
  '5k': '5K',
  '10k': '10K',
  half: 'Half Marathon',
  marathon: 'Marathon',
}

type GroupedRecords = Record<
  string,
  Record<string, { time: string; athleteName: string; date: string; eventName?: string }>
>

export function ClubRecords({ records, clubColor }: ClubRecordsProps) {
  // Group records by event and category
  const groupedRecords = records.reduce<GroupedRecords>((acc, record) => {
    if (!record.event || !record.category) return acc
    if (!acc[record.event]) acc[record.event] = {}
    acc[record.event][record.category] = {
      time: record.time,
      athleteName: record.athleteName,
      date: record.date ?? '',
      eventName: record.eventName ?? undefined,
    }
    return acc
  }, {})

  return (
    <ScrollArea className="w-full">
      <div className="space-y-6">
        {EVENT_ORDER.map((event) => {
          if (!groupedRecords[event]) return null
          const categoryRecords = groupedRecords[event]

          return (
            <div key={event} className="relative">
              <div className="sticky left-0 flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5" style={{ color: clubColor || 'var(--primary)' }} />
                <h3 className="font-semibold text-lg">{EVENT_NAMES[event]}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['men', 'women', 'non-binary'].map((category) => {
                  const record = categoryRecords[category]
                  if (!record) return null

                  return (
                    <Card key={category} className="p-4 transition-all hover:shadow-md">
                      <div className="flex flex-col items-center text-center gap-2">
                        <Badge variant="outline" className="mb-1 capitalize">
                          {category}
                        </Badge>
                        <div
                          className="text-2xl font-mono font-bold"
                          style={{ color: clubColor || 'var(--primary)' }}
                        >
                          {record.time}
                        </div>
                        <div>
                          <p className="font-medium">{record.athleteName}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.eventName && <span>{record.eventName} • </span>}
                            {format(new Date(record.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

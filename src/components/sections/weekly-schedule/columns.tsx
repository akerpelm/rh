'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { capitalize } from 'lodash'
import { getRunStatus, getStatusConfig, RunStatus } from '@/lib/utils/date'

export type ScheduledRun = {
  id: string // Changed from number to string since we're constructing it
  clubId: string
  clubName: string
  clubLogo?: { url: string }
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  time: string
  runType:
    | 'easy'
    | 'long'
    | 'workout'
    | 'recovery'
    | 'shakeout'
    | 'race-pace'
    | 'hills'
    | 'track'
    | 'social'
  distance?: {
    min?: number
    max?: number
  }
  pace?: {
    min?: string
    max?: string
  }
  details?: string
  requiresRSVP: boolean
  maxParticipants?: number
  meetingLocation: {
    name: string
    address: string
    neighborhood: {
      id: string
      name: string
      slug: string
      borough: {
        id: string
        name: string
        slug: string
      }
    }
  }
}

export const columns: ColumnDef<ScheduledRun>[] = [
  {
    accessorKey: 'day',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Day
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => capitalize(row.getValue('day')),
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    accessorKey: 'clubName',
    header: 'Club',
    cell: ({ row }) => {
      const club = row.original
      return (
        <Link
          href={`/run-clubs/${club.clubId}`}
          className="flex items-center gap-2 hover:text-primary"
        >
          {club.clubLogo ? (
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image src={club.clubLogo.url} alt={club.clubName} fill className="object-cover" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">{club.clubName.charAt(0)}</span>
            </div>
          )}
          <span>{club.clubName}</span>
        </Link>
      )
    },
  },
  {
    accessorKey: 'runType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('runType') as string
      return (
        <Badge variant="secondary">
          {type === 'workout'
            ? '🏃 Workout'
            : type === 'long'
              ? '🛣️ Long Run'
              : type === 'easy'
                ? '😌 Easy Run'
                : type === 'social'
                  ? '🤝 Social Run'
                  : capitalize(type)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'distance',
    header: 'Distance',
    cell: ({ row }) => {
      const distance = row.getValue('distance') as ScheduledRun['distance']
      if (distance?.min == null || distance?.max == null) return '-'
      return `${distance.min}-${distance.max}mi`
    },
  },
  {
    accessorKey: 'pace',
    header: 'Pace',
    cell: ({ row }) => {
      const pace = row.getValue('pace') as ScheduledRun['pace']
      if (!pace?.min || !pace?.max) return '-'
      return `${pace.min}-${pace.max}/mi`
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.original.meetingLocation
      if (!location?.neighborhood) return '-'
      return (
        <div>
          <div className="font-medium">{location.neighborhood.borough.name}</div>
          <div className="text-xs text-muted-foreground">{location.neighborhood.name}</div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true
      return row.original.meetingLocation.neighborhood.borough.name === value
    },
  },
  {
    accessorFn: (row) => getRunStatus(row.day, row.time),
    id: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as RunStatus
      const config = getStatusConfig(status)
      return (
        <Badge variant={config.variant}>
          {config.icon} {config.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value === 'all' || row.getValue(id) === value
    },
  },
]

'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Timer, UserCheck, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdvancedFiltersProps {
  searchParams: {
    dayFilter?: string
    pace?: string
    atmosphere?: string
    postRun?: string
  }
  onFilterChange: (key: string, value: string | null) => void
  className?: string
}

export function RunClubAdvancedFilters({
  searchParams,
  onFilterChange,
  className,
}: AdvancedFiltersProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Days filter */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Run Days</h3>
        </div>
        <Select
          value={searchParams.dayFilter || 'all'}
          onValueChange={(value) => onFilterChange('dayFilter', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any day</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="weekend">This weekend</SelectItem>
            <SelectItem value="monday">Mondays</SelectItem>
            <SelectItem value="tuesday">Tuesdays</SelectItem>
            <SelectItem value="wednesday">Wednesdays</SelectItem>
            <SelectItem value="thursday">Thursdays</SelectItem>
            <SelectItem value="friday">Fridays</SelectItem>
            <SelectItem value="saturday">Saturdays</SelectItem>
            <SelectItem value="sunday">Sundays</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pace filter */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Timer className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Pace</h3>
        </div>
        <Select
          value={searchParams.pace || 'all'}
          onValueChange={(value) => onFilterChange('pace', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any pace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any pace</SelectItem>
            <SelectItem value="beginner">Beginner (10:00+/mile)</SelectItem>
            <SelectItem value="intermediate">Intermediate (8:00-10:00/mile)</SelectItem>
            <SelectItem value="advanced">Advanced (&lt; 8:00/mile)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Atmosphere filter */}
      <div className="space-y-2">
        <div className="flex items-center">
          <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Atmosphere</h3>
        </div>
        <Select
          value={searchParams.atmosphere || 'all'}
          onValueChange={(value) => onFilterChange('atmosphere', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any atmosphere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any atmosphere</SelectItem>
            <SelectItem value="beginner-friendly">Beginner friendly</SelectItem>
            <SelectItem value="no-drop">No-drop policy</SelectItem>
            <SelectItem value="dog-friendly">Dog friendly</SelectItem>
            <SelectItem value="stroller-friendly">Stroller friendly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Post-Run filter */}
      <div className="space-y-2">
        <div className="flex items-center">
          <Coffee className="mr-2 h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Post-Run</h3>
        </div>
        <Select
          value={searchParams.postRun || 'all'}
          onValueChange={(value) => onFilterChange('postRun', value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any tradition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any tradition</SelectItem>
            <SelectItem value="coffee">Coffee</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="social">Social hour</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

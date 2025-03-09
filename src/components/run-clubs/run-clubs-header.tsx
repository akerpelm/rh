import { Button } from '@/components/ui/button'
import { MapPin, Users } from 'lucide-react'

export function RunClubsHeader() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Run Clubs Directory</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NYC Run Clubs</h1>
            <p className="text-muted-foreground mt-1">
              Find and connect with running clubs across New York City
            </p>
          </div>
          <Button className="hidden sm:flex" size="sm">
            <MapPin className="mr-1 h-4 w-4" />
            View Map
          </Button>
        </div>
      </div>
    </div>
  )
}

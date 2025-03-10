import { RunClub } from '@/payload-types'
import { ensureMedia } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ClubSidebarItemProps {
  club: RunClub
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}

export function ClubSidebarItem({
  club,
  isSelected,
  onClick,
  compact = false,
}: ClubSidebarItemProps) {
  const logo = ensureMedia(club.logo)
  // Add client-side only state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false)

  // Mark component as mounted after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Use default sizes for server rendering, then apply compact styles after hydration
  const useCompact = isMounted ? compact : false

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all',
        isSelected
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-muted/70 border border-transparent',
        useCompact ? 'p-2' : 'p-2.5',
      )}
      onClick={onClick}
      data-club-id={club.id}
    >
      {/* Club logo or initial */}
      {logo?.url ? (
        <div
          className={cn(
            'rounded-full overflow-hidden border border-border shrink-0',
            useCompact ? 'h-6 w-6' : 'h-8 w-8',
          )}
        >
          <Image
            src={logo.url}
            alt={club.name}
            width={useCompact ? 24 : 32}
            height={useCompact ? 24 : 32}
            className="object-cover h-full w-full"
          />
        </div>
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center shrink-0',
            useCompact ? 'h-6 w-6' : 'h-8 w-8',
          )}
          style={{
            background: club.brandColor
              ? `linear-gradient(135deg, ${club.brandColor}, ${club.brandColor}99)`
              : 'var(--primary)',
          }}
        >
          <span className={cn('font-bold text-white', useCompact ? 'text-[10px]' : 'text-xs')}>
            {club.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Club details */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn('font-medium truncate', useCompact ? 'text-xs' : 'text-sm')}
          style={{ color: isSelected ? club.brandColor : undefined }}
        >
          {club.name}
        </h3>
        {club.schedule && club.schedule.length > 0 && (
          <div
            className={cn(
              'flex items-center text-muted-foreground',
              useCompact ? 'text-[9px]' : 'text-[10px]',
            )}
          >
            <span>
              {club.schedule.length} run{club.schedule.length !== 1 ? 's' : ''}
            </span>
            {/* Only render run type info after client-side hydration to avoid mismatch */}
            {isMounted && !useCompact && club.schedule[0]?.runType && (
              <span className="ml-1 opacity-70">• {capitalize(club.schedule[0].runType)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

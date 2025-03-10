'use client'

import { RunClub } from '@/payload-types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Menu, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { ClubSidebarItem } from './club-sidebar-item'
import { cn } from '@/lib/utils'

// Define styles
const sidebarStyles = {
  sidebar: {
    backgroundColor: 'var(--background)',
    borderRight: '1px solid var(--border)',
    transition: 'width 0.3s',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 20, // Higher z-index to ensure sidebar is above map markers
  },
  sidebarOpen: {
    width: '320px',
  },
  sidebarClosed: {
    width: '0',
  },
  mobileFab: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    borderRadius: '9999px',
    padding: '12px',
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
}

interface MapSidebarProps {
  clubs: RunClub[]
  selectedClub: RunClub | null
  setSelectedClub: (club: RunClub | null) => void
  isOpen: boolean
  isMobile: boolean
}

export function MapSidebar({
  clubs,
  selectedClub,
  setSelectedClub,
  isOpen,
  isMobile,
}: MapSidebarProps) {
  // Client-side state for mobile features to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  // Only access client-side APIs after component has mounted
  const isLandscape = useMediaQuery('(orientation: landscape)')
  // Only apply mobile logic after client-side hydration is complete
  const useMobileSheet = isMounted ? isMobile && !isLandscape : false

  // Mark component as mounted after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile dialogs/sheets when a club is selected
  useEffect(() => {
    if (selectedClub) {
      setMobileDialogOpen(false)
      setMobileSheetOpen(false)
    }
  }, [selectedClub])

  // Render club list content
  const renderClubsList = () => (
    <div className="space-y-1.5">
      {clubs.map((club) => (
        <ClubSidebarItem
          key={club.id}
          club={club}
          isSelected={selectedClub?.id === club.id}
          onClick={() => {
            setSelectedClub(club)
            if (isMobile) {
              setMobileDialogOpen(false)
              setMobileSheetOpen(false)
            }
          }}
          compact={isMobile}
        />
      ))}
    </div>
  )

  // Always render a consistent structure during the initial render
  // Only apply mobile-specific rendering after client hydration
  if (!isMounted || !isMobile) {
    return (
      <aside
        className={cn(
          'h-full',
          isOpen ? 'w-80' : 'w-0',
          'transition-all duration-300 ease-in-out relative z-20',
        )}
      >
        {isOpen && (
          <div className="h-full flex flex-col border-r bg-background">
            {/* Sidebar header */}
            <div className="p-4 border-b flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Running Clubs</h2>
                <div className="bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium text-primary">
                  {clubs.length}
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <MapPin className="h-3 w-3" />
                <span>NYC Metro Area</span>
              </div>
            </div>

            {/* Sidebar content */}
            <ScrollArea className="flex-1">
              <div className="p-3">{renderClubsList()}</div>
            </ScrollArea>

            {/* Sidebar footer */}
            <div className="p-3 border-t text-xs text-muted-foreground bg-muted/30">
              <p>Click a club to view on map</p>
            </div>
          </div>
        )}
      </aside>
    )
  }

  // Only render mobile-specific content after client-side hydration
  return (
    <>
      {/* Mobile Dialog (Landscape) */}
      <Dialog open={mobileDialogOpen && isLandscape} onOpenChange={setMobileDialogOpen}>
        <DialogContent className="sm:max-w-md h-[80vh]">
          <DialogHeader>
            <DialogTitle>Running Clubs</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100%-60px)]">{renderClubsList()}</ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Mobile Sheet (Portrait) */}
      <Sheet open={mobileSheetOpen && useMobileSheet} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Running Clubs</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-2 h-[calc(100%-60px)]">{renderClubsList()}</ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Mobile FAB button */}
      <Button
        style={{ ...sidebarStyles.mobileFab }}
        onClick={() => (isLandscape ? setMobileDialogOpen(true) : setMobileSheetOpen(true))}
        className="shadow-lg absolute bottom-4 z-10"
      >
        <Menu className="h-4 w-4 mr-1.5 text-foreground" />
        <span className="text-foreground">
          {selectedClub ? `${clubs.length} Clubs` : `${clubs.length} Running Clubs`}
        </span>
      </Button>
    </>
  )
}

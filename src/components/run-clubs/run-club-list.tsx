import { RunClubCard } from '@/components/run-clubs/run-club-card'
import { MobileRunClubCard } from '@/components/run-clubs/mobile-run-club-card'
import { Pagination } from '@/components/run-clubs/pagination'
import { RunClub } from '@/payload-types'
import { ListFilter } from 'lucide-react'

interface RunClubListProps {
  runClubs: RunClub[]
  total: number
  page: number
  totalPages: number
}

export function RunClubList({ runClubs, total, page, totalPages }: RunClubListProps) {
  if (!runClubs.length) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <ListFilter className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-lg">No run clubs found</h3>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{runClubs.length}</span> of{' '}
          <span className="font-medium">{total}</span> clubs
        </p>
      </div>

      {/* Mobile view: stacked compact cards */}
      <div className="space-y-3 md:hidden">
        {runClubs.map((club) => (
          <MobileRunClubCard key={club.id} club={club} />
        ))}
      </div>

      {/* Desktop view: grid layout */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {runClubs.map((club) => (
          <RunClubCard key={club.id} club={club} />
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
    </div>
  )
}

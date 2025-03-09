import { RunClubCard } from '@/components/run-clubs/run-club-card'
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
      <div className="text-center py-10 border rounded-lg">
        <ListFilter className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-lg">No run clubs found</h3>
        <p className="text-muted-foreground">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{runClubs.length}</span> of{' '}
          <span className="font-medium">{total}</span> clubs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {runClubs.map((club) => (
          <RunClubCard key={club.id} club={club} />
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
    </div>
  )
}

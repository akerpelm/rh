import { Suspense } from 'react'
import { Separator } from '@/components/ui/separator'
import { getRunClubs, RunClubFilters as RunClubFilterTypes } from '@/lib/api/run-clubs'
import { RunClubsHeader } from '@/components/run-clubs/run-clubs-header'
import { RunClubFilters } from '@/components/run-clubs/run-club-filters'
import { RunClubsSkeletonList } from '@/components/run-clubs/run-clubs-skeleton'
import { getAllBoroughs } from '@/lib/api/boroughs'
import { RunClubList } from '@/components/run-clubs/run-club-list'

export const dynamic = 'force-dynamic'
export const revalidate = 30 // Cache results for 30 seconds

interface RunClubsPageProps {
  searchParams: {
    borough?: string
    neighborhood?: string
    search?: string
    sort?: string
    page?: string
    dayFilter?: string
    pace?: string
    atmosphere?: string
    postRun?: string
  }
}

export default async function RunClubsPage({ searchParams }: RunClubsPageProps) {
  // Create a stable key for suspense based on all relevant parameters
  const search = await searchParams
  const filterKey = JSON.stringify({
    b: search.borough,
    n: search.neighborhood,
    s: search.search,
    o: search.sort,
    p: search.page,
    d: search.dayFilter,
    pa: search.pace,
    a: search.atmosphere,
    pr: search.postRun,
  })

  const boroughs = await getAllBoroughs()

  return (
    <div className="space-y-6 py-8">
      <RunClubsHeader />

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <RunClubFilters
            boroughs={boroughs}
            searchParams={search}
            className="lg:sticky lg:top-20"
          />
        </div>

        <div className="lg:col-span-3">
          <Suspense key={filterKey} fallback={<RunClubsSkeletonList />}>
            <RunClubResults searchParamsObj={search} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Fetch club results with improved request handling
async function RunClubResults({
  searchParamsObj,
}: {
  searchParamsObj: RunClubsPageProps['searchParams']
}) {
  // Extract values safely and ensure they're properly typed
  const {
    borough,
    neighborhood,
    search,
    sort = 'name-asc',
    page: pageParam,
    dayFilter,
    pace,
    atmosphere,
    postRun,
  } = searchParamsObj

  // Debug log to verify parameter passing
  console.log('Parameters being sent to API:', {
    borough,
    neighborhood,
    search,
    sort,
    pageParam,
    dayFilter,
    pace,
    atmosphere,
    postRun,
  })

  let page = 1
  if (pageParam) {
    const pageNum = Number(pageParam)
    if (!isNaN(pageNum)) {
      page = pageNum
    }
  }

  // Create properly typed filter parameters
  const filterParams: RunClubFilterTypes = {
    borough,
    neighborhood,
    search,
    sort,
    page,
    // Type-safe filter values using the defined types
    dayFilter: dayFilter as RunClubFilterTypes['dayFilter'],
    pace: pace as RunClubFilterTypes['pace'],
    atmosphere: atmosphere as RunClubFilterTypes['atmosphere'],
    postRun: postRun as RunClubFilterTypes['postRun'],
  }

  const { runClubs, total, page: resultPage, totalPages } = await getRunClubs(filterParams)

  return (
    <RunClubList runClubs={runClubs} total={total} page={resultPage || 1} totalPages={totalPages} />
  )
}

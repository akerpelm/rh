'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  RunClubAdvancedFilters,
  AdvancedFiltersParams,
} from '@/components/run-clubs/run-club-advanced-filters'
import type { Borough } from '@/payload-types'
import { X, Search, SlidersHorizontal, Filter } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Delay in milliseconds for debouncing
const DEBOUNCE_DELAY = 500

interface RunClubFiltersProps {
  boroughs: Borough[]
  searchParams: {
    borough?: string
    neighborhood?: string
    search?: string
    sort?: string
    dayFilter?: string
    pace?: string
    atmosphere?: string
    postRun?: string
  }
  className?: string
}

export function RunClubFilters({ boroughs, searchParams, className }: RunClubFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Keep track of the current URL parameters
  const currentUrlRef = useRef(`${pathname}?${new URLSearchParams(searchParams).toString()}`)

  // Form state
  const [search, setSearch] = useState(searchParams.search || '')
  const [borough, setBorough] = useState(searchParams.borough || 'all')
  const [sort, setSort] = useState(searchParams.sort || 'name-asc')

  // Advanced filters state - initialize from URL with proper typing
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersParams>({
    dayFilter: (searchParams.dayFilter as AdvancedFiltersParams['dayFilter']) || null,
    pace: (searchParams.pace as AdvancedFiltersParams['pace']) || null,
    atmosphere: (searchParams.atmosphere as AdvancedFiltersParams['atmosphere']) || null,
    postRun: (searchParams.postRun as AdvancedFiltersParams['postRun']) || null,
  })

  // Show/hide advanced filters
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      searchParams.dayFilter ||
        searchParams.pace ||
        searchParams.atmosphere ||
        searchParams.postRun,
    ),
  )

  const [filtersPending, setFiltersPending] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Handle advanced filter changes - now with proper typing
  const handleAdvancedFilterChange = (key: keyof AdvancedFiltersParams, value: string | null) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [key]: value,
    }))

    setFiltersPending(true)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      applyFilters()
    }, DEBOUNCE_DELAY)
  }

  // Apply filters with debounce
  const applyFilters = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setFiltersPending(true)

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams()

      // Basic filters
      if (search) params.set('search', search)
      if (borough && borough !== 'all') params.set('borough', borough)
      if (sort) params.set('sort', sort)

      // Advanced filters
      if (advancedFilters.dayFilter) params.set('dayFilter', advancedFilters.dayFilter)
      if (advancedFilters.pace) params.set('pace', advancedFilters.pace)
      if (advancedFilters.atmosphere) params.set('atmosphere', advancedFilters.atmosphere)
      if (advancedFilters.postRun) params.set('postRun', advancedFilters.postRun)

      const newUrl = `${pathname}?${params.toString()}`

      if (newUrl !== currentUrlRef.current) {
        currentUrlRef.current = newUrl
        router.push(newUrl, { scroll: false })
      }

      setFiltersPending(false)
    }, DEBOUNCE_DELAY)
  }, [search, borough, sort, advancedFilters, pathname, router])

  // Reset all filters
  const resetFilters = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setSearch('')
    setBorough('all')
    setSort('name-asc')
    setAdvancedFilters({
      dayFilter: null,
      pace: null,
      atmosphere: null,
      postRun: null,
    })

    const newUrl = pathname
    if (newUrl !== currentUrlRef.current) {
      currentUrlRef.current = newUrl
      router.push(newUrl, { scroll: false })
    }
  }

  // Apply filters when values change
  useEffect(() => {
    applyFilters()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [search, borough, sort, applyFilters])

  const hasBasicFilters = search || borough !== 'all' || sort !== 'name-asc'
  const hasAdvancedFilters = Object.values(advancedFilters).some(Boolean)
  const hasActiveFilters = hasBasicFilters || hasAdvancedFilters
  const activeAdvancedFilterCount = Object.values(advancedFilters).filter(Boolean).length

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search always stays outside accordion */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Everything else goes in an accordion */}
      <Accordion type="single" collapsible className="w-full" defaultValue="filters">
        <AccordionItem value="filters">
          <AccordionTrigger className="py-2">
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filters & Sorting</span>
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {(hasBasicFilters ? 1 : 0) + activeAdvancedFilterCount}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {/* Borough filter */}
              <div className="space-y-4 pt-2">
                <div className="flex space-x-4">
                  {/* Borough filter */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Borough</h3>
                      <Select value={borough} onValueChange={setBorough}>
                        <SelectTrigger>
                          <SelectValue placeholder="All boroughs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All boroughs</SelectItem>
                          {boroughs.map((b) => (
                            <SelectItem key={b.id} value={b.id.toString()}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sort filter */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Sort By</h3>
                      <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by name" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                          <SelectItem value="createdAt-desc">Newest</SelectItem>
                          <SelectItem value="createdAt-asc">Oldest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced filters */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span className="flex items-center">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </span>
                  {activeAdvancedFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeAdvancedFilterCount}
                    </span>
                  )}
                </Button>

                {showAdvanced && (
                  <div className="pt-3 border-t mt-3">
                    <RunClubAdvancedFilters
                      searchParams={advancedFilters}
                      onFilterChange={handleAdvancedFilterChange}
                    />
                  </div>
                )}
              </div>

              {/* Reset filters button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={resetFilters}
                  disabled={filtersPending}
                >
                  Reset All Filters
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {filtersPending && (
        <div className="text-xs text-center text-muted-foreground">Updating...</div>
      )}
    </div>
  )
}

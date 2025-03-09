import { getPayload, Where } from 'payload'
import config from '@/payload.config'
import type { RunClub } from '@/payload-types'
import { format, addDays } from 'date-fns'

const CACHE_TTL = 60000
type CachedResponse = {
  runClubs: RunClub[]
  total: number
  page: number
  totalPages: number
}
const requestCache = new Map<string, { timestamp: number; data: CachedResponse }>()

export type RunClubFilters = {
  borough?: string
  neighborhood?: string
  search?: string
  sort?: string
  page?: number
  dayFilter?:
    | 'today'
    | 'tomorrow'
    | 'weekend'
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
    | undefined
  pace?: 'beginner' | 'intermediate' | 'advanced' | 'all' | undefined
  atmosphere?:
    | 'beginner-friendly'
    | 'no-drop'
    | 'dog-friendly'
    | 'stroller-friendly'
    | 'all'
    | undefined
  postRun?: 'coffee' | 'breakfast' | 'social' | 'all' | undefined
}

export async function getRunClubs({
  borough,
  neighborhood,
  search,
  sort = 'name-asc',
  page = 1,
  dayFilter,
  pace,
  atmosphere,
  postRun,
}: RunClubFilters) {
  // Create a cache key based on the request parameters
  const cacheKey = JSON.stringify({
    borough,
    neighborhood,
    search,
    sort,
    page,
    dayFilter,
    pace,
    atmosphere,
    postRun,
  })

  // Check cache
  const now = Date.now()
  const cachedResponse = requestCache.get(cacheKey)
  if (cachedResponse && now - cachedResponse.timestamp < CACHE_TTL) {
    return cachedResponse.data
  }

  const payload = await getPayload({ config })
  const limit = 12
  const filters: Where[] = []

  // Borough filter
  if (borough && borough !== 'all') {
    filters.push({ borough: { equals: parseInt(borough) } })
  }

  // Neighborhood filter
  if (neighborhood) {
    filters.push({ primaryNeighborhood: { equals: parseInt(neighborhood) } })
  }

  // Search filter
  if (search) {
    filters.push({ name: { like: search } })
  }

  // Day-based filters - ensure proper string comparison
  if (dayFilter && dayFilter !== 'all') {
    const nowDate = new Date()
    const today = format(nowDate, 'EEEE').toLowerCase()

    try {
      if (dayFilter === 'today') {
        filters.push({ 'schedule.day': { equals: today } })
      } else if (dayFilter === 'tomorrow') {
        const tomorrow = format(addDays(nowDate, 1), 'EEEE').toLowerCase()
        filters.push({ 'schedule.day': { equals: tomorrow } })
      } else if (dayFilter === 'weekend') {
        filters.push({
          or: [
            { 'schedule.day': { equals: 'saturday' } },
            { 'schedule.day': { equals: 'sunday' } },
          ],
        })
      } else {
        // Specific day of week
        filters.push({ 'schedule.day': { equals: dayFilter } })
      }
    } catch (e) {
      console.error('Error processing dayFilter:', e)
    }
  }

  // Pace filter - reworked logic to handle overlapping ranges
  if (pace && pace !== 'all') {
    if (pace === 'beginner') {
      filters.push({ 'schedule.pace.max': { greater_than_equal: '10:00' } })
    } else if (pace === 'intermediate') {
      filters.push({
        or: [
          {
            and: [
              { 'schedule.pace.min': { greater_than_equal: '08:00' } },
              { 'schedule.pace.min': { less_than_equal: '10:00' } },
            ],
          },
          {
            and: [
              { 'schedule.pace.max': { greater_than_equal: '08:00' } },
              { 'schedule.pace.max': { less_than_equal: '10:00' } },
            ],
          },
          {
            and: [
              { 'schedule.pace.min': { less_than: '08:00' } },
              { 'schedule.pace.max': { greater_than: '10:00' } },
            ],
          },
        ],
      })
    } else if (pace === 'advanced') {
      filters.push({ 'schedule.pace.min': { less_than_equal: '08:00' } })
    }
  }

  // Atmosphere filter
  if (atmosphere && atmosphere !== 'all') {
    if (atmosphere === 'beginner-friendly') {
      filters.push({ 'clubCulture.atmosphere': { contains: 'beginner' } })
    } else if (atmosphere === 'no-drop') {
      filters.push({ 'clubCulture.atmosphere': { equals: 'no-drop' } })
    } else if (atmosphere === 'dog-friendly') {
      filters.push({ 'clubCulture.atmosphere': { equals: 'dog-friendly' } })
    } else if (atmosphere === 'stroller-friendly') {
      filters.push({ 'clubCulture.atmosphere': { equals: 'stroller' } })
    }
  }

  // Post-run traditions filter - use the correct operator for array fields
  if (postRun && postRun !== 'all') {
    filters.push({ 'clubCulture.postRunTraditions': { equals: postRun } })
  }

  // Combine all conditions
  const where: Where = filters.length ? { and: filters } : {}

  // Sorting conversion
  let sortOption: string | undefined
  if (typeof sort === 'string' && sort.includes('-')) {
    const [field, direction] = sort.split('-')
    sortOption = direction === 'desc' ? `-${field}` : field
  } else {
    sortOption = 'name'
  }

  try {
    const result = await payload.find({
      collection: 'run-clubs',
      where,
      sort: sortOption,
      page,
      limit,
      depth: 2, // Load relationships
    })

    const response = {
      runClubs: result.docs as RunClub[],
      total: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
    }

    // Cache the response
    requestCache.set(cacheKey, {
      timestamp: now,
      data: response,
    })

    return response
  } catch (error) {
    console.error('Error fetching run clubs:', error)
    return {
      runClubs: [] as RunClub[],
      total: 0,
      page: 1,
      totalPages: 0,
    }
  }
}

import { Media, Borough, Neighborhood, RunClub } from '@/payload-types'

// Type guards
export const isMedia = (value: unknown): value is Media => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value &&
    typeof value.url === 'string' &&
    value.url.length > 0
  )
}

export const isBorough = (value: unknown): value is Borough => {
  return typeof value === 'object' && value !== null && 'name' in value && 'slug' in value
}

export const isNeighborhood = (value: unknown): value is Neighborhood => {
  return typeof value === 'object' && value !== null && 'name' in value && 'borough' in value
}

// Transform functions
export function ensureMedia(value: number | Media | null | undefined): Media | undefined {
  if (!value) return undefined
  if (typeof value === 'number') return undefined
  if (!isMedia(value)) return undefined
  return value
}

export function ensureBorough(value: number | Borough): Borough | undefined {
  return isBorough(value) ? value : undefined
}

export function ensureNeighborhood(
  value: number | Neighborhood | null | undefined,
): Neighborhood | undefined {
  if (!value) return undefined
  return isNeighborhood(value) ? value : undefined
}

// Main transformer for run club data
export function transformRunClubData(club: RunClub) {
  return {
    ...club,
    logo: ensureMedia(club.logo),
    borough: ensureBorough(club.borough),
    primaryNeighborhood: ensureNeighborhood(club.primaryNeighborhood),
    schedule: club.schedule?.map((run: any) => ({
      ...run,
      meetingLocation: {
        ...run.meetingLocation,
        neighborhood: ensureNeighborhood(run.meetingLocation?.neighborhood),
      },
    })),
  }
}

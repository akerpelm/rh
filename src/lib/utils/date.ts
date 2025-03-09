export type RunStatus = 'upcoming' | 'soon' | 'live' | 'inactive'

export function getRunStatus(day: string, time: string): RunStatus {
  const today = new Date()
  const currentDay = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const currentHour = today.getHours()
  const [runHour] = time.split(':').map(Number)

  // If it's today
  if (day === currentDay) {
    // Within 30 minutes of start time
    if (runHour === currentHour) return 'live'
    // Within 2 hours of start time
    if (runHour - currentHour <= 3 && runHour - currentHour > 0) return 'soon'
    // Later today
    if (runHour > currentHour) return 'upcoming'
  }

  return 'inactive'
}

export function getStatusConfig(status: RunStatus) {
  switch (status) {
    case 'live':
      return {
        label: 'Live',
        variant: 'destructive' as const,
        icon: '🔴',
      }
    case 'soon':
      return {
        label: 'Starting Soon',
        variant: 'default' as const,
        icon: '🟡',
      }
    case 'upcoming':
      return {
        label: 'Today',
        variant: 'default' as const,
        icon: '🟢',
      }
    default:
      return {
        label: 'Scheduled',
        variant: 'secondary' as const,
        icon: '⚫',
      }
  }
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

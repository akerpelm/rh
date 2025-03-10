import { RunClub } from '@/payload-types'
import { ensureMedia } from '@/lib/utils/payload-transforms'
import { capitalize } from 'lodash'

interface ClubLocation {
  name: string
  coordinates: { latitude: string; longitude: string }
  address: string
}

interface ClubPopupProps {
  club: RunClub
  location: ClubLocation
}

// Non-React component that returns HTML string for popup content
export function ClubPopup({ club, location }: ClubPopupProps): string {
  const logo = ensureMedia(club.logo)

  const logoHtml = logo?.url
    ? `<div class="w-12 h-12 rounded-full overflow-hidden border">
         <img src="${logo.url}" alt="${club.name}" class="object-cover w-full h-full" />
       </div>`
    : `<div class="w-12 h-12 rounded-full flex items-center justify-center"
         style="background: ${club.brandColor || '#3b82f6'}">
         <span class="text-xl font-bold text-white">${club.name.charAt(0).toUpperCase()}</span>
       </div>`

  // Generate the HTML for the popup
  return `
    <div class="bg-gradient-to-b from-${club.brandColor ? club.brandColor.replace('#', '') : '3b82f6'}30 to-transparent pt-4 pb-3 px-4">
      <div class="flex gap-3 items-center">
        ${logoHtml}
        <div>
          <h3 class="font-semibold text-base">${club.name}</h3>
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <span>${location.name}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 py-3 space-y-3">
      <div class="text-sm">
        <div class="flex flex-wrap gap-1.5">
          ${(club.schedule || [])
            .slice(0, 5)
            .map(
              (run) =>
                `<span class="px-2 py-0.5 bg-muted text-xs rounded-full">${capitalize(run.day)}</span>`,
            )
            .join('')}
          ${
            (club.schedule?.length || 0) > 5
              ? `<span class="px-2 py-0.5 bg-muted text-xs rounded-full">+${club.schedule!.length - 5}</span>`
              : ''
          }
        </div>
        <div class="mt-2 text-xs text-muted-foreground">${club.schedule?.length || 0} runs per week</div>
      </div>
      <div class="pt-2 border-t">
        <a href="/run-clubs/${club.slug}"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          View club profile
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  `
}

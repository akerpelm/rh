'use client'

import { RunClub } from '@/payload-types'
import { useEffect, useRef, useState } from 'react'
import { Map, Marker, Popup, NavigationControl } from 'maplibre-gl'
import { capitalize } from 'lodash'
import { cn } from '@/lib/utils'
import 'maplibre-gl/dist/maplibre-gl.css'

interface Location {
  name: string
  coordinates: { latitude: string; longitude: string }
  runs: NonNullable<NonNullable<RunClub['schedule']>>[number][]
}

interface ClubMapProps {
  club: RunClub
  className?: string
}

export function ClubMap({ club, className }: ClubMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Get unique locations from all schedules
  const locations = club.schedule?.reduce<Location[]>((acc, run) => {
    if (
      !run?.meetingLocation?.coordinates?.latitude ||
      !run?.meetingLocation?.coordinates?.longitude
    ) {
      return acc
    }

    const existingLocation = acc.find(
      (loc) =>
        loc.coordinates.latitude === run.meetingLocation?.coordinates?.latitude &&
        loc.coordinates.longitude === run.meetingLocation?.coordinates?.longitude,
    )

    if (existingLocation) {
      existingLocation.runs.push(run)
      return acc
    }

    return [
      ...acc,
      {
        name: run.meetingLocation.name,
        coordinates: {
          latitude: run.meetingLocation.coordinates.latitude,
          longitude: run.meetingLocation.coordinates.longitude,
        },
        runs: [run],
      },
    ]
  }, [])

  useEffect(() => {
    if (!mapContainer.current || !locations?.length) return

    const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || ''
    const mapStyle = `https://api.maptiler.com/maps/topo-v2/style.json?key=${MAPTILER_KEY}`

    const center: [number, number] = locations[0]
      ? [
          parseFloat(locations[0].coordinates.longitude || '0'),
          parseFloat(locations[0].coordinates.latitude || '0'),
        ]
      : [-74.006, 40.7128]

    // Initialize map
    try {
      if (!map.current) {
        map.current = new Map({
          container: mapContainer.current,
          style: mapStyle,
          center,
          zoom: 13,
          attributionControl: false,
        })

        // Add navigation controls (zoom in/out)
        map.current.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

        // Add attribution in a more subtle way
        map.current.addControl(
          {
            onAdd: () => {
              const container = document.createElement('div')
              container.className = 'text-[10px] text-muted-foreground px-1'
              container.innerHTML =
                '© <a href="https://www.maptiler.com/" target="_blank" rel="noopener" class="hover:text-primary">MapTiler</a>'
              return container
            },
            onRemove: () => {},
          },
          'bottom-left',
        )

        // Wait for map to load before adding markers
        map.current.on('load', () => {
          // Add custom CSS to style the popups
          const style = document.createElement('style')
          style.textContent = `
            .maplibregl-popup-content {
              border-radius: 0.5rem;
              border: 1px solid var(--border);
              background-color: var(--background);
              padding: 0;
              overflow: hidden;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            }
            .maplibregl-popup-tip {
              border-top-color: var(--background) !important;
            }
            .custom-marker {
              cursor: pointer;
              filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
              transition: transform 0.2s;
            }
            .custom-marker:hover {
              transform: scale(1.1);
            }
          `
          document.head.appendChild(style)

          // Add markers for each location
          addMarkers()

          // Set loading state after a small delay to ensure everything is rendered
          setTimeout(() => {
            setIsLoaded(true)
          }, 300)
        })
      }
    } catch (error) {
      console.error('Error initializing map:', error)
      setIsLoaded(true) // Still set loaded to prevent infinite loading
    }

    function addMarkers() {
      if (!map.current) return

      try {
        const mapInstance = map.current // Store reference to avoid null issues
        locations?.forEach((location) => {
          // Create custom marker element
          const marker = document.createElement('div')
          marker.className = 'custom-marker'
          marker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${
            club.brandColor || '#000000'
          }" stroke="white" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

          // Create popup HTML with modern styling
          const popupContent = document.createElement('div')
          popupContent.innerHTML = `
            <div class="p-4 text-sm space-y-3">
              <div>
                <h3 class="font-semibold">${location.name}</h3>
                <p class="text-xs opacity-70">
                  ${location.runs.length} run${location.runs.length > 1 ? 's' : ''} per week
                </p>
              </div>
              <div class="space-y-3 divide-y divide-dashed">
                ${location.runs
                  .map(
                    (run) => `
                  <div class="pt-3 first:pt-0">
                    <div class="flex items-center justify-between text-xs mb-1.5">
                      <span class="font-medium">${capitalize(run.day)}s @ ${run.time}</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] inline-block" style="background-color: ${
                        club.brandColor ? club.brandColor + '15' : 'var(--primary)'
                      }; color: ${club.brandColor || 'var(--primary)'}">
                        ${capitalize(run.runType)}
                      </span>
                    </div>
                    ${
                      (run.distance?.min && run.distance?.max) || (run.pace?.min && run.pace?.max)
                        ? `<div class="flex gap-3 text-[10px] opacity-70">
                        ${
                          run.distance?.min && run.distance?.max
                            ? `<span>${run.distance.min}-${run.distance.max} mi</span>`
                            : ''
                        }
                        ${
                          run.pace?.min && run.pace?.max
                            ? `<span>${run.pace.min}-${run.pace.max} /mi</span>`
                            : ''
                        }
                      </div>`
                        : ''
                    }
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>
          `

          // Create a popup
          const popup = new Popup({
            offset: 25,
            closeOnClick: true,
            closeButton: false,
          })

          popup.setDOMContent(popupContent)

          // Add marker to map with popup
          new Marker(marker)
            .setLngLat([
              parseFloat(location.coordinates.longitude || '0'),
              parseFloat(location.coordinates.latitude || '0'),
            ])
            .setPopup(popup)
            .addTo(mapInstance)
        })
      } catch (error) {
        console.error('Error adding markers:', error)
      }
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [locations, club.brandColor])

  return (
    <div className={cn('relative rounded-lg overflow-hidden border', className)}>
      <div
        ref={mapContainer}
        className={cn(
          'h-[320px] w-full bg-muted/30 transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}

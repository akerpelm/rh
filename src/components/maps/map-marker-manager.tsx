import { useEffect, useRef } from 'react'
import { ensureMedia } from '@/lib/utils/payload-transforms'
import { RunClub } from '@/payload-types'
import { Map, Marker, Popup, LngLatBounds } from 'maplibre-gl'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { ClubPopup } from './club-popup'

interface MapMarkerManagerProps {
  map: Map
  clubs: RunClub[]
  selectedClub: RunClub | null
  setSelectedClub: (club: RunClub | null) => void
  isMobile: boolean
  sidebarOpen?: boolean
}

// Extract locations from clubs
const extractClubMarkers = (clubs: RunClub[]) => {
  return clubs
    .map((club) => {
      let location = null

      if (club.schedule && club.schedule.length > 0) {
        const firstRun = club.schedule[0]
        if (
          firstRun.meetingLocation?.coordinates?.latitude &&
          firstRun.meetingLocation?.coordinates?.longitude
        ) {
          location = {
            name: firstRun.meetingLocation.name,
            coordinates: {
              latitude: firstRun.meetingLocation.coordinates.latitude,
              longitude: firstRun.meetingLocation.coordinates.longitude,
            },
            address: firstRun.meetingLocation.address || '',
          }
        }
      }

      return {
        club,
        location,
      }
    })
    .filter((marker) => marker.location !== null)
}

export function MapMarkerManager({
  map,
  clubs,
  selectedClub,
  setSelectedClub,
  isMobile,
  sidebarOpen = true,
}: MapMarkerManagerProps) {
  const markersRef = useRef<Marker[]>([])
  const stylesInjectedRef = useRef(false)

  // Add marker CSS styles if not already added
  useEffect(() => {
    if (!stylesInjectedRef.current) {
      const style = document.createElement('style')
      style.textContent = `
        .club-marker {
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
          transition: transform 0.2s, filter 0.2s;
          z-index: 5; /* Lower z-index than sidebar */
        }
        .club-marker:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.2));
        }
        .club-marker.selected {
          transform: scale(1.2);
          z-index: 10; /* Higher than normal markers, but lower than sidebar */
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        .maplibregl-popup-content {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .maplibregl-popup-close-button {
          padding: 4px 6px;
          color: #666;
          font-size: 16px;
          font-weight: normal;
        }
        .maplibregl-popup {
          z-index: 5;
        }
        .maplibregl-ctrl-bottom-right {
          bottom: ${isMobile ? '76px' : '10px'} !important;
        }
      `
      document.head.appendChild(style)
      stylesInjectedRef.current = true
    }
  }, [isMobile])

  // Create and manage markers
  useEffect(() => {
    // Extract club information
    const clubMarkers = extractClubMarkers(clubs)

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add new markers
    clubMarkers.forEach(({ club, location }) => {
      if (!location) return

      // Create marker element
      const markerEl = document.createElement('div')
      markerEl.className = `club-marker ${selectedClub?.id === club.id ? 'selected' : ''}`
      markerEl.dataset.clubId = String(club.id)

      // Size based on selection and mobile status
      const circleSize = selectedClub?.id === club.id ? (isMobile ? 48 : 40) : isMobile ? 36 : 32
      const color = club.brandColor || '#3b82f6'

      // Create SVG marker
      markerEl.innerHTML = `
        <svg width="${circleSize}" height="${circleSize}" viewBox="0 0 ${circleSize} ${circleSize}">
          <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2 - 2}"
            fill="${color}"
            stroke="white"
            stroke-width="2" />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="white"
            font-weight="bold"
            font-size="${circleSize / 2.5}px">
            ${club.name.charAt(0).toUpperCase()}
          </text>
        </svg>
      `

      // Create popup content
      const popupEl = document.createElement('div')
      popupEl.className = 'club-popup'

      // Render popup content using React component converted to string
      popupEl.innerHTML = ClubPopup({ club, location })

      // Create popup
      const popup = new Popup({
        offset: circleSize / 2,
        closeButton: false,
        maxWidth: isMobile ? '220px' : '300px',
      })

      popup.setDOMContent(popupEl)

      // Add marker
      const marker = new Marker({ element: markerEl })
        .setLngLat([
          parseFloat(location.coordinates.longitude),
          parseFloat(location.coordinates.latitude),
        ])
        .setPopup(popup)
        .addTo(map)

      // Store marker for later cleanup
      markersRef.current.push(marker)

      // Add click handler
      markerEl.addEventListener('click', () => {
        setSelectedClub(club)
      })
    })

    // Fit map to show all markers on first load
    if (clubMarkers.length > 0 && !selectedClub) {
      // Default center if fitting fails
      const nycCenter: [number, number] = [-73.9857, 40.7484]

      try {
        const bounds = clubMarkers.reduce(
          (bounds, marker) => {
            if (marker.location) {
              const lng = parseFloat(marker.location.coordinates.longitude)
              const lat = parseFloat(marker.location.coordinates.latitude)
              return bounds.extend([lng, lat])
            }
            return bounds
          },
          new LngLatBounds(nycCenter, nycCenter),
        )

        // Add padding - more on mobile
        map.fitBounds(bounds, {
          padding: isMobile ? { top: 50, bottom: 100, left: 50, right: 50 } : 50,
        })
      } catch (err) {
        console.error('Error fitting bounds:', err)
        map.setCenter(nycCenter)
      }
    }

    // Clean up
    return () => {
      markersRef.current.forEach((marker) => marker.remove())
    }
  }, [clubs, map, isMobile])

  // Handle selected club changes
  useEffect(() => {
    // Update marker styles
    document.querySelectorAll('.club-marker').forEach((el) => {
      el.classList.remove('selected')
    })

    if (selectedClub) {
      // Find and update the selected marker
      const markerEl = document.querySelector(`.club-marker[data-club-id="${selectedClub.id}"]`)
      if (markerEl) {
        markerEl.classList.add('selected')
      }

      // Find location for the club
      const clubMarker = extractClubMarkers(clubs).find((m) => m.club.id === selectedClub.id)

      // Fly to location
      if (clubMarker?.location) {
        map.flyTo({
          center: [
            parseFloat(clubMarker.location.coordinates.longitude),
            parseFloat(clubMarker.location.coordinates.latitude),
          ],
          zoom: isMobile ? 14 : 15,
          duration: 1000,
        })
      }
    }
  }, [selectedClub, clubs, map, isMobile])

  // Mobile selected club indicator in header
  return (
    <>
      {isMobile && selectedClub && (
        <div
          className="absolute top-0 left-0 right-0 bg-background border-b px-3 py-2 flex items-center justify-between"
          style={{ zIndex: 15 }} // Higher than markers, but lower than sidebar
        >
          <div className="flex items-center">
            {ensureMedia(selectedClub.logo)?.url ? (
              <Image
                src={ensureMedia(selectedClub.logo)!.url!}
                alt={selectedClub.name}
                width={24}
                height={24}
                className="rounded-full h-6 w-6 mr-2 object-cover"
              />
            ) : (
              <div
                className="h-6 w-6 rounded-full mr-2 flex items-center justify-center"
                style={{ background: selectedClub.brandColor || 'var(--primary)' }}
              >
                <span className="text-[10px] font-bold text-white">{selectedClub.name[0]}</span>
              </div>
            )}
            <span className="font-medium text-sm truncate max-w-[180px]">{selectedClub.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setSelectedClub(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}

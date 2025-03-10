'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Map, NavigationControl } from 'maplibre-gl'
import { RunClub } from '@/payload-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import 'maplibre-gl/dist/maplibre-gl.css'
import { MapSidebar } from './map-sidebar'
import { MapMarkerManager } from './map-marker-manager'
import { useMediaQuery } from '@/hooks/use-media-query'

// Define inline styles
const mapStyles = {
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  toggleButton: {
    position: 'absolute',
    left: '320px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'var(--background)',
    zIndex: 30, // Higher than sidebar to be clickable
    padding: '6px',
    borderRadius: '0 6px 6px 0',
    border: '1px solid var(--border)',
    borderLeft: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  toggleButtonClosed: {
    left: '0',
  },
  mapWrapper: {
    position: 'relative',
    flex: 1,
    height: '100%',
  },
}

interface ClubMapViewProps {
  clubs: RunClub[]
  className?: string
}

export function ClubMapView({ clubs, className }: ClubMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const [selectedClub, setSelectedClub] = useState<RunClub | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Add client-side hydration state to prevent mismatches
  const [isMounted, setIsMounted] = useState(false)

  // Media queries
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const isMobile = !isDesktop

  // Mark component as mounted after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  useEffect(() => {
    if (!mapContainer.current) return

    // Create a minimalist style
    const mapStyle = {
      version: 8,
      name: 'NYC Running Clubs Map',
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#e0dfdf',
          },
        },
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    }

    // NYC center coordinates
    const nycCenter: [number, number] = [-73.9857, 40.7484]

    if (!map.current) {
      map.current = new Map({
        container: mapContainer.current,
        style: mapStyle as any,
        center: nycCenter,
        zoom: 11.5,
        pitch: isMobile ? 0 : 40, // Only use pitch on desktop
        bearing: 0,
        dragRotate: !isMobile, // Disable rotation on mobile
      })

      // Add navigation controls
      map.current.addControl(
        new NavigationControl({ showCompass: !isMobile, visualizePitch: !isMobile }),
        'bottom-right',
      )

      // Add custom attribution
      map.current.addControl(
        {
          onAdd: () => {
            const container = document.createElement('div')
            container.className = 'maplibregl-ctrl maplibregl-ctrl-attrib'
            container.style.fontSize = '10px'
            container.style.padding = '2px 5px'
            container.style.background = 'rgba(255,255,255,0.7)'
            container.style.margin = '0 10px 10px 0'
            container.innerHTML =
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            return container
          },
          onRemove: () => {},
        },
        'bottom-left',
      )

      map.current.on('load', () => {
        setIsLoaded(true)
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isMobile])
  const toggleButtonStyles = isMounted
    ? {
        ...mapStyles.toggleButton,
        ...(sidebarOpen ? {} : mapStyles.toggleButtonClosed),
      }
    : null

  return (
    <div className={cn('flex h-full w-full', className)}>
      {/* Sidebar */}
      <MapSidebar
        clubs={clubs}
        selectedClub={selectedClub}
        setSelectedClub={setSelectedClub}
        isOpen={sidebarOpen}
        isMobile={isMobile}
      />

      {/* Toggle sidebar button - only render after client-side hydration */}
      {isMounted && !isMobile && toggleButtonStyles && (
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={toggleButtonStyles}>
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      )}

      {/* Map wrapper */}
      <div style={mapStyles.mapWrapper}>
        {/* Map container */}
        <div
          ref={mapContainer}
          style={mapStyles.mapContainer}
          className={cn('transition-opacity duration-500', isLoaded ? 'opacity-100' : 'opacity-0')}
        />

        {/* Map markers - only render when map is loaded */}
        {isLoaded && map.current && (
          <MapMarkerManager
            map={map.current}
            clubs={clubs}
            selectedClub={selectedClub}
            setSelectedClub={setSelectedClub}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
          />
        )}
      </div>
    </div>
  )
}

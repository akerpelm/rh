import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface RouteMapProps {
  mapUrl: string
  clubColor?: string
}

export function RouteMap({ mapUrl, clubColor }: RouteMapProps) {
  return (
    <div>
      <Link
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs hover:opacity-70"
        style={{ color: clubColor || 'var(--primary)' }}
      >
        View route <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  )
}

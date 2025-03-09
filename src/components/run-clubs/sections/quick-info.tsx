import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, Globe, MapPin, ExternalLink } from 'lucide-react'
import { RunClub } from '@/payload-types'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'
import Link from 'next/link'
import { Suspense } from 'react'
import { ClubMap } from '@/components/maps/club-map'
import { MapSkeleton } from '@/components/maps/map-skeleton'

interface QuickInfoProps {
  club: RunClub
}

export function QuickInfo({ club }: QuickInfoProps) {
  const neighborhood = ensureNeighborhood(club.primaryNeighborhood)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Links */}
        <div className="space-y-2">
          {club.contactInformation?.email && (
            <Link
              href={`mailto:${club.contactInformation.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              <span>{club.contactInformation.email}</span>
            </Link>
          )}
          {club.contactInformation?.phone && (
            <Link
              href={`tel:${club.contactInformation.phone}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              <span>{club.contactInformation.phone}</span>
            </Link>
          )}
          {club.website && (
            <Link
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Website</span>
            </Link>
          )}
        </div>

        {/* Location */}
        {neighborhood && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <p>Based in {neighborhood.name}</p>
              </div>
            </div>
            <Suspense fallback={<MapSkeleton />}>
              <ClubMap club={club} />
            </Suspense>
          </div>
        )}

        {/* Membership Info */}
        {club.membershipRequirements && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-1">Membership</p>
            <p className="text-sm text-muted-foreground">{club.membershipRequirements}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

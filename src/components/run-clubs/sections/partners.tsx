import { RunClub } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Store,
  Coffee,
  Activity,
  Utensils,
  Dumbbell,
  Building,
  ExternalLink,
  MapPin,
  Gift,
  Globe,
} from 'lucide-react'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'
import { ensureValidURL } from '@/lib/utils/urls'
import Link from 'next/link'

interface PartnerBusinessesProps {
  partners: RunClub['partnerBusinesses']
}

const TYPE_ICONS = {
  'running-store': Store,
  brand: Globe,
  coffee: Coffee,
  pt: Activity,
  restaurant: Utensils,
  gym: Dumbbell,
  other: Building,
} as const

const TYPE_LABELS = {
  'running-store': 'Running Store',
  brand: 'Brand Partner',
  coffee: 'Coffee Shop',
  pt: 'Physical Therapy',
  restaurant: 'Restaurant',
  gym: 'Gym',
  other: 'Partner',
} as const

export function PartnerBusinesses({ partners }: PartnerBusinessesProps) {
  if (!partners?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">No partner businesses listed yet.</div>
    )
  }

  // Group partners by type for better organization
  const groupedPartners = partners.reduce(
    (acc, partner) => {
      const type = partner.type as keyof typeof TYPE_ICONS
      if (!acc[type]) acc[type] = []
      acc[type].push(partner)
      return acc
    },
    {} as Record<string, typeof partners>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(groupedPartners).map(([type, typePartners]) => {
        const Icon = TYPE_ICONS[type as keyof typeof TYPE_ICONS] || Building

        return (
          <div key={type} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <h3 className="font-semibold">{TYPE_LABELS[type as keyof typeof TYPE_LABELS]}</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {typePartners.map((partner, index) => {
                const neighborhood = ensureNeighborhood(partner.location?.neighborhood)
                const hasLocation = partner.location?.address || neighborhood
                const hasSiteLinks = partner.businessURL || partner.internalURL

                return (
                  <Card key={index} className="group">
                    <CardContent className="p-5 space-y-4">
                      {/* Header */}
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {partner.businessName}
                        </h4>
                        {hasLocation && (
                          <div className="flex items-start gap-1.5 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                            <div>
                              {partner.location?.address}
                              {neighborhood && <span className="block">{neighborhood.name}</span>}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Perks */}
                      {partner.perks && (
                        <div className="flex items-start gap-1.5 text-sm">
                          <Gift className="h-4 w-4 shrink-0 mt-1" />
                          <p>{partner.perks}</p>
                        </div>
                      )}

                      {/* Links */}
                      {hasSiteLinks && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {partner.internalURL && (
                            <Button asChild size="sm" variant="outline">
                              <Link href={ensureValidURL(partner.internalURL)}>
                                View Partnership
                                <ExternalLink className="ml-1.5 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                          {partner.businessURL && (
                            <Button asChild size="sm" variant="outline">
                              <Link
                                href={ensureValidURL(partner.businessURL)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit Website
                                <ExternalLink className="ml-1.5 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

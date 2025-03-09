import { RunClub } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Coffee, Activity, Utensils, Dumbbell, Building } from 'lucide-react'
import { ensureNeighborhood } from '@/lib/utils/payload-transforms'

interface PartnerBusinessesProps {
  partners: RunClub['partnerBusinesses']
}

const TYPE_ICONS = {
  'running-store': Store,
  coffee: Coffee,
  pt: Activity,
  restaurant: Utensils,
  gym: Dumbbell,
  other: Building,
} as const

export function PartnerBusinesses({ partners }: PartnerBusinessesProps) {
  if (!partners?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">No partner businesses listed yet.</div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner, index) => {
        const Icon = TYPE_ICONS[partner.type as keyof typeof TYPE_ICONS] || Building
        const neighborhood = ensureNeighborhood(partner.location?.neighborhood)

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Icon className="w-5 h-5 mr-2 text-muted-foreground" />
              <CardTitle className="text-lg">{partner.businessName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {partner.perks && (
                <div className="text-sm">
                  <span className="font-medium">Perks: </span>
                  {partner.perks}
                </div>
              )}
              {(partner.location?.address || neighborhood) && (
                <div className="text-sm text-muted-foreground">
                  {partner.location?.address}
                  {neighborhood && <span className="block">{neighborhood.name}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

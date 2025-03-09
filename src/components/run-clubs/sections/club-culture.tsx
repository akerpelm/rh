import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RunClub } from '@/payload-types'

const TRADITION_LABELS = {
  coffee: '☕️ Coffee',
  breakfast: '🍳 Breakfast',
  stretch: '🧘‍♂️ Group Stretching',
  social: '🤝 Social Hour',
}

const ATMOSPHERE_LABELS = {
  'no-drop': '🤝 No Drop Policy',
  'pace-groups': '👥 Pace Groups',
  'all-levels': '✨ All Levels Welcome',
  beginner: '🌟 Beginner Friendly',
  photos: '📸 Photo Friendly',
  'dog-friendly': '🐕 Dog Friendly',
  stroller: '👶 Stroller Friendly',
}

interface ClubCultureProps {
  culture: RunClub['clubCulture']
  preview?: boolean
}

export function ClubCulture({ culture, preview }: ClubCultureProps) {
  if (!culture) return null

  return (
    <div className="space-y-6">
      {/* Club Atmosphere */}
      {culture.atmosphere && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Atmosphere</h3>
          <div className="flex flex-wrap gap-2">
            {culture.atmosphere.map((item) => (
              <Badge key={item} variant="secondary">
                {ATMOSPHERE_LABELS[item as keyof typeof ATMOSPHERE_LABELS]}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Post-Run Traditions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Post-Run Traditions</h3>
        <div className="flex flex-wrap gap-2">
          {culture.postRunTraditions?.map((item) => (
            <Badge key={item} variant="outline">
              {TRADITION_LABELS[item as keyof typeof TRADITION_LABELS]}
            </Badge>
          ))}
          {culture.customTraditions?.map((tradition) => (
            <Badge key={tradition.id} variant="outline">
              {tradition.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

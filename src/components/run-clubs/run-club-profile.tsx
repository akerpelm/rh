import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, Globe } from 'lucide-react'
import { StravaIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { RunClub } from '@/payload-types'
import { ensureBorough, ensureMedia, ensureNeighborhood } from '@/lib/utils/payload-transforms'
import { ensureValidURL } from '@/lib/utils/urls'
import { ScheduleCard } from './schedule-card'
import { ClubRecords } from './sections/club-records'
import { ClubGallery } from './sections/gallery'
import { PartnerBusinesses } from './sections/partners'
import { RoutesList } from './sections/routes'
import { ClubCulture } from './sections/club-culture'
import { QuickInfo } from './sections/quick-info'
import { FadeInSection } from '@/components/animations/fade-in-section'

interface RunClubProfileProps {
  club: RunClub
}

export function RunClubProfile({ club }: RunClubProfileProps) {
  const logo = ensureMedia(club.logo)
  const borough = ensureBorough(club.borough)
  const primaryNeighborhood = ensureNeighborhood(club.primaryNeighborhood)

  const clubThemeStyles = club.brandColor
    ? ({
        '--club-color': club.brandColor,
        '--club-color-light': `${club.brandColor}33`,
      } as React.CSSProperties)
    : {}

  return (
    <div className="relative min-h-screen">
      {/* Background gradient container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: club.brandColor
            ? `radial-gradient(
                60% 90% at 50% 50%,
                ${club.brandColor}15 0%,
                ${club.brandColor}08 45%,
                transparent 100%
              )`
            : undefined,
        }}
      />

      {/* Content container */}
      <div className="relative w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden p-6 mb-8" style={clubThemeStyles}>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden bg-background shadow-lg">
                    {logo?.url ? (
                      <Image
                        src={logo.url}
                        alt={club.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--club-color, var(--primary))' }}
                      >
                        <span className="text-5xl font-bold text-background">
                          {club.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6 md:hidden">{renderSocialLinks(club)}</div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
                      <div className="flex flex-wrap gap-2">
                        {borough && (
                          <Badge
                            className="text-sm px-3 py-1"
                            style={{
                              backgroundColor: 'var(--club-color, var(--primary))',
                              color: 'var(--background)',
                            }}
                          >
                            {borough.name}
                          </Badge>
                        )}
                        {primaryNeighborhood && (
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {primaryNeighborhood.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-lg">{club.description}</p>

                    <div className="hidden md:flex gap-4">{renderSocialLinks(club)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid lg:grid-cols-3 gap-8">
            <div className="lg:hidden space-y-4">
              <QuickInfo club={club} />
              <Card>
                <CardHeader>
                  <CardTitle>Club Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClubCulture culture={club.clubCulture} />
                </CardContent>
              </Card>
            </div>

            {/* Main scrollable content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Weekly Schedule */}
              <FadeInSection>
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {club.schedule?.map((run, index) => (
                      <ScheduleCard key={index} run={run} clubColor={club.brandColor ?? ''} />
                    ))}
                  </CardContent>
                </Card>
              </FadeInSection>

              {/* Routes Section */}
              {club.routes && club.routes.length > 0 && (
                <FadeInSection>
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Routes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RoutesList routes={club.routes} />
                    </CardContent>
                  </Card>
                </FadeInSection>
              )}

              {/* Gallery Section */}
              {club.gallery && club.gallery?.length > 0 && (
                <FadeInSection>
                  <Card>
                    <CardHeader>
                      <CardTitle>Photo Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClubGallery gallery={club.gallery} />
                    </CardContent>
                  </Card>
                </FadeInSection>
              )}

              {/* Partners Section */}
              {club.partnerBusinesses && club.partnerBusinesses.length > 0 && (
                <FadeInSection>
                  <Card>
                    <CardHeader>
                      <CardTitle>Local Partners</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PartnerBusinesses partners={club.partnerBusinesses} />
                    </CardContent>
                  </Card>
                </FadeInSection>
              )}

              {/* Club Records */}
              {club.clubRecords && club.clubRecords.length > 0 && (
                <FadeInSection>
                  <Card>
                    <CardHeader>
                      <CardTitle>Club Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClubRecords records={club.clubRecords} clubColor={club.brandColor ?? ''} />
                    </CardContent>
                  </Card>
                </FadeInSection>
              )}
            </div>

            {/* Desktop sticky sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-20" style={{ zIndex: 0 }}>
                <div className="space-y-4">
                  <QuickInfo club={club} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Club Culture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ClubCulture culture={club.clubCulture} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to render social links
function renderSocialLinks(club: RunClub) {
  const socialLinks = [
    {
      url: club.socialMedia?.instagram,
      icon: Instagram,
      label: 'Instagram',
      hoverColor: 'hover:text-[#E1306C]',
    },
    {
      url: club.socialMedia?.strava,
      icon: StravaIcon,
      label: 'Strava',
      hoverColor: 'hover:text-[#FC4C02]',
    },
    {
      url: club.socialMedia?.facebook,
      icon: Facebook,
      label: 'Facebook',
      hoverColor: 'hover:text-[#4267B2]',
    },
    {
      url: club.socialMedia?.twitter,
      icon: Twitter,
      label: 'Twitter',
      hoverColor: 'hover:text-[#1DA1F2]',
    },
  ]

  return socialLinks
    .filter((link) => link.url)
    .map(({ url, icon: Icon, label, hoverColor }) => (
      <Link
        key={label}
        href={ensureValidURL(url!)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('text-muted-foreground transition-colors', hoverColor)}
        aria-label={label}
      >
        <Icon className="h-5 w-5" />
      </Link>
    ))
}

function renderContactInfo(club: RunClub) {
  const contactItems = [
    {
      icon: Mail,
      value: club.contactInformation?.email,
      label: 'Email',
      href: `mailto:${club.contactInformation?.email}`,
    },
    {
      icon: Phone,
      value: club.contactInformation?.phone,
      label: 'Phone',
      href: `tel:${club.contactInformation?.phone}`,
    },
    {
      icon: Globe,
      value: club.website,
      label: 'Website',
      href: ensureValidURL(club.website ?? ''),
    },
  ].filter((item) => item.value)

  return contactItems.length > 0 ? (
    <div className="space-y-3">
      {contactItems.map(({ icon: Icon, value, label, href }) => (
        <Link
          key={label}
          href={href}
          target={label === 'Website' ? '_blank' : undefined}
          rel={label === 'Website' ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Icon className="h-4 w-4" />
          <span>{value}</span>
        </Link>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground text-sm">No contact information provided.</p>
  )
}

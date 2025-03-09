import { getBoroughData } from '@/lib/fetchers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import config from '@/payload.config'
import { Neighborhood, RunClub } from '@/payload-types'
import { ensureBorough, ensureMedia } from '@/lib/utils/payload-transforms'

async function getLocalCommunityData() {
  const payload = await getPayload({ config: await config })
  const [boroughsResponse, neighborhoodsResponse, clubsResponse] = await Promise.all([
    payload.find({
      collection: 'boroughs',
      depth: 2,
    }),
    payload.find({
      collection: 'neighborhoods',
      depth: 1,
    }),
    payload.find({
      collection: 'run-clubs',
      depth: 1,
    }),
  ])

  const boroughs = boroughsResponse.docs.reduce(
    (acc, borough) => {
      acc[borough.slug] = {
        ...borough,
        neighborhoods: neighborhoodsResponse.docs.filter(
          (n) => ensureBorough(n.borough)?.id === borough.id,
        ),
        clubs: clubsResponse.docs.filter((c) => ensureBorough(c.borough)?.id === borough.id),
      }
      return acc
    },
    {} as Record<string, any>,
  )

  return { boroughs }
}

export default async function LocalCommunity() {
  const { boroughs } = await getLocalCommunityData()

  return (
    <section className="py-12 md:py-20 bg-muted/40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Find Your Local Community</h2>

        <Tabs defaultValue={Object.keys(boroughs)[0]} className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <TabsList className="flex flex-wrap justify-center gap-2">
              {Object.entries(boroughs).map(([slug, borough]) => (
                <TabsTrigger key={slug} value={slug} className="flex-1">
                  {borough.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(boroughs).map(([slug, borough]) => (
            <TabsContent key={slug} value={slug} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Popular Neighborhoods</h3>
                      {borough.neighborhoods?.length > 5 && (
                        <Button variant="link" size="sm" className="h-auto p-0" asChild>
                          <Link href={`/neighborhoods?borough=${slug}`}>View all</Link>
                        </Button>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {borough.neighborhoods?.slice(0, 5).map((neighborhood: Neighborhood) => (
                        <li key={neighborhood.id}>
                          <Link
                            href={`/neighborhoods/${neighborhood.slug}`}
                            className="text-primary hover:underline flex items-center gap-2 py-1"
                          >
                            <span className="flex-1">{neighborhood.name}</span>
                            {(neighborhood.runningSpots?.length ?? 0) > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {neighborhood.runningSpots?.length ?? 0} spots
                              </Badge>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Popular Running Routes</h3>
                    <ul className="space-y-1">
                      {borough.neighborhoods
                        ?.filter((n: Neighborhood) => (n.runningSpots?.length ?? 0) > 0)
                        .slice(0, 5)
                        .map((neighborhood: Neighborhood) => (
                          <li key={neighborhood.id}>
                            {neighborhood.runningSpots?.slice(0, 1).map((spot) => (
                              <Link
                                key={spot.name}
                                href={`/neighborhoods/${neighborhood.slug}#${spot.name
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}`}
                                className="text-primary hover:underline block py-1"
                              >
                                {spot.name}
                              </Link>
                            ))}
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Running Clubs</h3>
                    <ul className="space-y-3">
                      {borough.clubs?.slice(0, 5).map((club: RunClub) => (
                        <li key={club.id}>
                          <Link
                            href={`/run-clubs/${club.slug}`}
                            className="group flex items-center gap-3 hover:text-primary"
                          >
                            {(() => {
                              const logo = ensureMedia(club.logo)
                              return logo?.url ? (
                                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                                  <Image
                                    src={logo.url}
                                    alt={club.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {club.name.charAt(0)}
                                  </span>
                                </div>
                              )
                            })()}
                            <span className="text-sm font-medium group-hover:underline line-clamp-1">
                              {club.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/run-clubs?borough=${slug}`}>
                          View All {borough.name} Clubs
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

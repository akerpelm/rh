import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, MapPin, Search } from 'lucide-react'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch featured run clubs
  // const runClubsResponse = await payload.find({
  //   collection: 'run-clubs',
  //   limit: 3,
  // })
  // const featuredClubs = runClubsResponse.docs

  return (
    <>
      {/* Full-width hero section */}
      <div> {/* Offset the Shell's top padding */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* <Image
              src="/hero-bg.jpg"
              alt="NYC Runners"
              fill
              className="object-cover opacity-30"
              priority
            /> */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          </div>

          <div className="relative z-10 text-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Unite with NYC's Running Community
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover clubs, events, and resources tailored for every runner.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/run-clubs">
                  <MapPin className="w-5 h-5" />
                  Find a Run Club
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/events">
                  <Calendar className="w-5 h-5" />
                  Explore Events
                </Link>
              </Button>
            </div>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for clubs, events, or stores..."
                className="pl-10 py-6 rounded-full"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Rest of the sections will be automatically contained by Shell */}
      {/* Borough Tabs */}
      <section className="py-12 md:py-20 bg-muted/40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Local Community</h2>

          <Tabs defaultValue="manhattan" className="w-full max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <TabsList className="flex flex-wrap justify-center gap-2">
                <TabsTrigger value="manhattan" className="flex-1">Manhattan</TabsTrigger>
                <TabsTrigger value="brooklyn" className="flex-1">Brooklyn</TabsTrigger>
                <TabsTrigger value="queens" className="flex-1">Queens</TabsTrigger>
                <TabsTrigger value="bronx" className="flex-1">Bronx</TabsTrigger>
                <TabsTrigger value="staten" className="flex-1">Staten Island</TabsTrigger>
              </TabsList>
            </div>
            {['manhattan', 'brooklyn', 'queens', 'bronx', 'staten'].map((borough) => (
              <TabsContent key={borough} value={borough} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">Popular Neighborhoods</h3>
                      <ul className="space-y-1">
                        {borough === 'manhattan' ? (
                          <>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Central Park
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Riverside Park
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Battery Park
                              </Link>
                            </li>
                          </>
                        ) : borough === 'brooklyn' ? (
                          <>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Prospect Park
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Williamsburg
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                DUMBO
                              </Link>
                            </li>
                          </>
                        ) : (
                          <li>Coming soon...</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">Popular Running Routes</h3>
                      <ul className="space-y-1">
                        {borough === 'manhattan' ? (
                          <>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Central Park Loop
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Hudson River Greenway
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                East River Promenade
                              </Link>
                            </li>
                          </>
                        ) : borough === 'brooklyn' ? (
                          <>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Prospect Park Loop
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Brooklyn Bridge Park
                              </Link>
                            </li>
                            <li>
                              <Link href="#" className="text-primary hover:underline">
                                Shore Road Park
                              </Link>
                            </li>
                          </>
                        ) : (
                          <li>Coming soon...</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mt-6">
                  <Button asChild>
                    <Link href={`/run-clubs?borough=${borough}`}>
                      View All {borough.charAt(0).toUpperCase() + borough.slice(1)} Running Clubs
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      {/* Featured Run Clubs */}
      <section className="py-12 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Run Clubs</h2>
            <Button variant="outline" asChild>
              <Link href="/run-clubs">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {featuredClubs.map((club) => (
              <Card key={club.id} className="overflow-hidden">
                {club.logo ? (
                  <div className="relative h-48 bg-muted">
                    <Image src={club.logo.url} alt={club.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No logo available</span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl">{club.name}</h3>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {club.borough.charAt(0).toUpperCase() + club.borough.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {typeof club.description === 'string'
                      ? club.description
                      : 'Join this amazing run club in NYC!'}
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/run-clubs/${club.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))} */}
          </div>
        </div>
      </section>
      {/* Upcoming Events */}
      <section className="py-12 md:py-20 bg-muted/40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button variant="outline" asChild>
              <Link href="/events">View Calendar</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[4rem] h-16 bg-primary/10 rounded-md">
                      <span className="text-primary text-lg font-bold">
                        {new Date().getDate() + i * 3}
                      </span>
                      <span className="text-xs text-primary">
                        {new Date().toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">NYC Weekend Long Run</h3>
                      <p className="text-sm text-muted-foreground mb-2">7:00 AM · Central Park</p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-muted-foreground">Free · Open to all</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/events">Explore All Events</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-12 md:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Runners Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah J.',
                club: 'Brooklyn Road Runners',
                text: "NYC Running Hub helped me find my running community after moving to the city. I've made incredible friends and improved my running.",
              },
              {
                name: 'Michael T.',
                club: 'Harlem Run',
                text: 'The event calendar keeps me informed of all the best races and group runs. I never miss a chance to run with fellow NYC runners now.',
              },
              {
                name: 'Jessica L.',
                club: 'Queens Distance Runners',
                text: 'As a run club leader, this platform has helped us grow our community and connect with runners we would never have reached otherwise.',
              },
            ].map((testimonial, i) => (
              <Card key={i} className="relative">
                <CardContent className="p-8">
                  <div className="absolute -top-6 left-8">
                    <Avatar className="h-12 w-12 border-4 border-background">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {testimonial.name.split(' ')[0][0]}
                        {testimonial.name.split(' ')[1][0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="pt-6">
                    <p className="italic mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.club}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with NYC Running</h2>
            <p className="mb-6">
              Get the latest news about clubs, events, and community happenings delivered to your
              inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-primary-foreground text-primary"
              />
              <Button variant="secondary" size="lg" className="sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Partner Logos */}
      <section className="py-12 border-t">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-medium text-muted-foreground mb-8">
            Trusted by NYC's Running Community
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-24 bg-muted/50 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

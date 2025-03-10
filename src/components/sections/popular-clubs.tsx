import { getPayload } from 'payload'
import config from '@/payload.config'
import { RunClubCard } from '@/components/run-clubs/run-club-card'
import { MobileRunClubCard } from '@/components/run-clubs/mobile-run-club-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getPopularClubs() {
  const payload = await getPayload({ config: await config })

  const { docs: clubs } = await payload.find({
    collection: 'run-clubs',
    // In a real app, you might sort by popularity metrics
    sort: '-createdAt', // For now, just show newest
    limit: 6,
    depth: 2,
  })

  return clubs
}

export default async function PopularClubs() {
  const clubs = await getPopularClubs()

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Running Clubs</h2>
            <p className="text-muted-foreground">Connect with New York's most active communities</p>
          </div>
          <Button asChild>
            <Link href="/run-clubs">View All Clubs</Link>
          </Button>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {clubs.map((club) => (
            <MobileRunClubCard key={club.id} club={club} />
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {clubs.map((club) => (
            <RunClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { getPayload } from 'payload'
import { Button } from '@/components/ui/button'
import { RunClubCard } from '@/components/run-clubs/run-club-card'
import config from '@/payload.config'

async function getFeaturedClubs() {
  const payload = await getPayload({ config: await config })
  const response = await payload.find({
    collection: 'run-clubs',
    limit: 3,
    sort: '-updatedAt', // You might want to add a 'featured' field to the collection instead
  })
  return response.docs
}

export default async function PopularClubs() {
  const featuredClubs = await getFeaturedClubs()

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Run Clubs</h2>
          <Button variant="outline" asChild>
            <Link href="/run-clubs">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClubs.map((club) => (
            <RunClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </section>
  )
}

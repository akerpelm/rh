import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { RunClubProfile } from '@/components/run-clubs/run-club-profile'

interface RunClubPageProps {
  params: {
    slug: string
  }
}

export default async function RunClubPage({ params }: RunClubPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const {
    docs: [club],
  } = await payload.find({
    collection: 'run-clubs',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  if (!club) {
    notFound()
  }

  return <RunClubProfile club={club} />
}

import { getPayload } from 'payload'
import config from '@/payload.config'
import { columns, type ScheduleItem } from './weekly-schedule/columns'
import { DataTable } from './weekly-schedule/data-table'
import { transformRunClubData } from '@/lib/utils/payload-transforms'

async function getRunSchedule(): Promise<ScheduleItem[]> {
  const payload = await getPayload({ config: await config })

  const response = await payload.find({
    collection: 'run-clubs',
    depth: 3,
    where: {
      'schedule.day': {
        not_equals: null,
      },
    },
  })

  const transformedDocs = response.docs.map(transformRunClubData)

  return transformedDocs.flatMap((club) =>
    (club.schedule || []).map((run) => ({
      ...run,
      id: `${club.id}-${run.day}-${run.time}`,
      clubId: String(club.id),
      clubName: club.name,
      clubLogo: club.logo,
      slug: club.slug,
    })),
  )
}

export default async function WeeklySchedule() {
  const runs = await getRunSchedule()
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Weekly Run Schedule</h2>
        <DataTable columns={columns} data={runs} />
      </div>
    </section>
  )
}

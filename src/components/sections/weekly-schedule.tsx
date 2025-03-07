import { getPayload } from 'payload'
import config from '@/payload.config'
import { columns, type ScheduledRun } from './weekly-schedule/columns'
import { DataTable } from './weekly-schedule/data-table'

async function getRunSchedule(): Promise<ScheduledRun[]> {
  const payload = await getPayload({ config: await config })

  const response = await payload.find({
    collection: 'run-clubs',
    depth: 2,
    // where: {
    //   runClub.schedule: {
    //     exists: true,
    //   },
    // },
  })

  const runs: ScheduledRun[] = response.docs.flatMap((club) =>
    (club.schedule || []).map((run) => ({
      id: `${club.id}-${run.day}-${run.time}`,
      clubId: club.id,
      clubName: club.name || '',
      clubLogo: club.logo,
      day: run.day,
      time: run.time,
      runType: run.runType,
      distance: run.distance,
      pace: run.pace,
      details: run.details,
      requiresRSVP: run.requiresRSVP || false,
      maxParticipants: run.maxParticipants,
      meetingLocation: run.meetingLocation,
    })),
  )

  return runs
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

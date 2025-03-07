import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getWeeklySchedule() {
  const payload = await getPayload({ config: await config })
  // ... weekly schedule fetching logic
}

export async function getBoroughData() {
  const payload = await getPayload({ config: await config })
  // ... borough data fetching logic
}

export async function getFeaturedClubs() {
  const payload = await getPayload({ config: await config })
  // ... featured clubs fetching logic
}

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Borough, Neighborhood } from '@/payload-types'

export async function getAllBoroughs(): Promise<Borough[]> {
  const payload = await getPayload({ config })

  try {
    const response = await payload.find({
      collection: 'boroughs',
      limit: 100,
    })

    return response.docs as Borough[]
  } catch (error) {
    console.error('Error fetching boroughs:', error)
    return []
  }
}

export async function getNeighborhoodsByBorough(boroughId: number): Promise<Neighborhood[]> {
  const payload = await getPayload({ config })

  try {
    const response = await payload.find({
      collection: 'neighborhoods',
      where: {
        borough: {
          equals: boroughId,
        },
      },
      limit: 100,
    })

    return response.docs as Neighborhood[]
  } catch (error) {
    console.error(`Error fetching neighborhoods for borough ID ${boroughId}:`, error)
    return []
  }
}

'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { RunClub } from '@/payload-types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface MeetingPointsMapProps {
  schedule: RunClub['schedule']
}

export function MeetingPointsMap({ schedule }: MeetingPointsMapProps) {
  const meetingPoints =
    schedule?.filter(
      (run) =>
        run.meetingLocation?.coordinates?.latitude && run.meetingLocation?.coordinates?.longitude,
    ) ?? []

  if (!meetingPoints.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <MapContainer
            center={[40.7128, -74.006]} // NYC coordinates
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {meetingPoints.map((run, index) => (
              <Marker
                key={index}
                position={[
                  Number(run.meetingLocation.coordinates.latitude),
                  Number(run.meetingLocation.coordinates.longitude),
                ]}
              >
                <Popup>
                  <strong>{run.meetingLocation.name}</strong>
                  <br />
                  {capitalize(run.day)}s @ {run.time}
                  <br />
                  {run.runType} Run
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface GeocodingResult {
  lat: string
  lon: string
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
    )
    const data = await response.json()

    if (data?.[0]) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

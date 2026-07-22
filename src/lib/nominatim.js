/**
 * Nominatim OpenStreetMap Geocoding Client
 * Free geocoding service with custom User-Agent requirement.
 */

export async function searchAddress(query) {
  if (!query || query.trim().length < 3) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&addressdetails=1&limit=6`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'WakeyWakyPWA/1.0 (https://wakeywaky.app)'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim query failed: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item) => ({
      id: item.place_id,
      name: item.display_name.split(',')[0],
      fullAddress: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
}

export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'WakeyWakyPWA/1.0 (https://wakeywaky.app)'
      }
    });
    if (!response.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const data = await response.json();
    return data.display_name ? data.display_name.split(',')[0] : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

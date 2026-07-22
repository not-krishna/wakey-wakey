/**
 * Geographic calculation utilities using Haversine formula
 */

/**
 * Calculates distance between two coordinates in meters.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats distance in meters into human-readable text (e.g., "450m" or "2.4km").
 */
export function formatDistance(distanceMeters) {
  if (distanceMeters == null || isNaN(distanceMeters)) return '--';
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

/**
 * Estimates arrival time text assuming average transit speed (~30 km/h = ~8.3 m/s).
 */
export function estimateETA(distanceMeters) {
  if (!distanceMeters) return 'Calculated shortly';
  const speedMetersPerSec = 8.33;
  const seconds = distanceMeters / speedMetersPerSec;
  const minutes = Math.ceil(seconds / 60);

  if (minutes <= 1) return 'Arriving now';
  if (minutes < 60) return `~${minutes} min remaining`;
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  return `~${hours}h ${remainingMin}m remaining`;
}

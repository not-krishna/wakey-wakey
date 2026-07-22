import { useState, useEffect, useRef } from 'react';
import { calculateHaversineDistance } from '../lib/geo';

/**
 * Custom Hook: useGeolocationWatch
 * Watches navigator.geolocation and computes live distance to target destination.
 */
export function useGeolocationWatch(destination, isActive = false) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceRemaining, setDistanceRemaining] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!isActive || !navigator.geolocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const newLoc = { lat: latitude, lng: longitude, accuracy };
      setCurrentLocation(newLoc);
      setError(null);

      if (destination?.lat != null && destination?.lng != null) {
        const dist = calculateHaversineDistance(
          latitude,
          longitude,
          destination.lat,
          destination.lng
        );
        setDistanceRemaining(dist);
      }
    };

    const handleError = (err) => {
      console.warn('Geolocation watch error:', err);
      let errorMsg = 'Hmm, I lost track of you. Mind checking your GPS?';
      if (err.code === err.PERMISSION_DENIED) {
        errorMsg = "I need your location to keep watch — tap settings to allow access.";
      }
      setError(errorMsg);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    // Watch position pings
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isActive, destination]);

  return {
    currentLocation,
    distanceRemaining,
    error
  };
}

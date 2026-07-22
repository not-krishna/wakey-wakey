import React, { createContext, useContext, useState, useCallback } from 'react';
import { useGeolocationWatch } from '../hooks/useGeolocationWatch';
import { useAlarmTrigger } from '../hooks/useAlarmTrigger';
import { useWakeLock } from '../hooks/useWakeLock';
import { primeAudioContext } from '../lib/sound';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [activeTrip, setActiveTrip] = useState(null); // null or { destination, alertRadiusMeters, label, status }

  const isActive = activeTrip?.status === 'active';
  const isAlarming = activeTrip?.status === 'alarm';

  // Geolocation Watcher
  const { currentLocation, distanceRemaining, error: geoError } = useGeolocationWatch(
    activeTrip?.destination,
    isActive
  );

  // Wake Lock Hook
  useWakeLock(isActive || isAlarming);

  // Trigger Alarm handler
  const handleAlarmTriggered = useCallback(() => {
    setActiveTrip((prev) => (prev ? { ...prev, status: 'alarm' } : null));
  }, []);

  // Multi-channel Alarm Trigger Hook
  const { stopAlarm, testAlarm } = useAlarmTrigger({
    distanceRemaining,
    alertRadiusMeters: activeTrip?.alertRadiusMeters || 500,
    destinationName: activeTrip?.destination?.name || 'your stop',
    isActive,
    onAlarmTriggered: handleAlarmTriggered
  });

  const startTrip = useCallback((destination, alertRadiusMeters = 500, label = '') => {
    // Prime Audio Context on user tap gesture
    primeAudioContext();

    setActiveTrip({
      destination,
      alertRadiusMeters,
      label,
      status: 'active',
      startTime: Date.now()
    });
  }, []);

  const triggerAlarmManually = useCallback(() => {
    if (activeTrip) {
      setActiveTrip((prev) => ({ ...prev, status: 'alarm' }));
      testAlarm();
    }
  }, [activeTrip, testAlarm]);

  const completeTrip = useCallback(() => {
    stopAlarm();
    setActiveTrip((prev) => (prev ? { ...prev, status: 'completed' } : null));
  }, [stopAlarm]);

  const cancelTrip = useCallback(() => {
    stopAlarm();
    setActiveTrip(null);
  }, [stopAlarm]);

  const clearCompletedTrip = useCallback(() => {
    setActiveTrip(null);
  }, []);

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        currentLocation,
        distanceRemaining,
        geoError,
        startTrip,
        triggerAlarmManually,
        completeTrip,
        cancelTrip,
        clearCompletedTrip,
        stopAlarm
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within a TripProvider');
  return ctx;
}

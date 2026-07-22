import { useEffect, useRef, useState } from 'react';

/**
 * Custom Hook: useWakeLock
 * Keeps mobile screen awake during active transit tracking.
 */
export function useWakeLock(enabled = false) {
  const wakeLockRef = useRef(null);
  const [isSupported] = useState(() => 'wakeLock' in navigator);
  const [isAcquired, setIsAcquired] = useState(false);

  useEffect(() => {
    if (!enabled || !isSupported) return;

    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          if (isMounted) setIsAcquired(true);

          wakeLockRef.current.addEventListener('release', () => {
            if (isMounted) setIsAcquired(false);
          });
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err.message);
        if (isMounted) setIsAcquired(false);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [enabled, isSupported]);

  return { isSupported, isAcquired };
}

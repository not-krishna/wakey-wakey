import { useEffect, useRef, useCallback } from 'react';
import { startAlarmSound, stopAlarmSound, escalateAlarmSound } from '../lib/sound';

/**
 * Custom Hook: useAlarmTrigger
 * Checks distance against threshold and fires audio, vibration, & push notification.
 */
export function useAlarmTrigger({
  distanceRemaining,
  alertRadiusMeters = 500,
  destinationName = 'your stop',
  isActive = false,
  onAlarmTriggered
}) {
  const isTriggeredRef = useRef(false);
  const escalationTimerRef = useRef(null);

  const stopAlarm = useCallback(() => {
    stopAlarmSound();
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
    if (escalationTimerRef.current) {
      clearTimeout(escalationTimerRef.current);
      escalationTimerRef.current = null;
    }
    isTriggeredRef.current = false;
  }, []);

  const fireAlarmEffects = useCallback(() => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;

    // 1. Play Web Audio Alarm Chime
    startAlarmSound();

    // 2. Hardware Vibration Pattern
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300, 100, 500, 200, 500]);
    }

    // 3. Native Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Koa: Wakey waky! Your stop is coming up 🚏`, {
          body: `You're approaching ${destinationName}.`,
          icon: '/favicon.svg',
          tag: 'wakey-waky-alarm',
          renotify: true,
          requireInteraction: true
        });
      } catch (err) {
        console.warn('Notification trigger error:', err);
      }
    }

    // 4. Notify Parent Component to switch UI state
    if (onAlarmTriggered) {
      onAlarmTriggered();
    }

    // 5. 20-second Escalation Timer
    escalationTimerRef.current = setTimeout(() => {
      if (isTriggeredRef.current) {
        escalateAlarmSound();
        if ('vibrate' in navigator) {
          navigator.vibrate([600, 100, 600, 100, 800]);
        }
      }
    }, 20000);
  }, [destinationName, onAlarmTriggered]);

  useEffect(() => {
    if (!isActive) {
      isTriggeredRef.current = false;
      return;
    }

    if (
      distanceRemaining !== null &&
      distanceRemaining <= alertRadiusMeters &&
      !isTriggeredRef.current
    ) {
      fireAlarmEffects();
    }
  }, [distanceRemaining, alertRadiusMeters, isActive, fireAlarmEffects]);

  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, [stopAlarm]);

  return {
    stopAlarm,
    testAlarm: fireAlarmEffects
  };
}

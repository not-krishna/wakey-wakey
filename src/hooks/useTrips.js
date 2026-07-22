import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom Hook: useTrips
 * Provides Firestore CRUD operations for saved stops/trips.
 */
export function useTrips() {
  const { user } = useAuth();
  const [savedStops, setSavedStops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedStops = async () => {
    if (!user) {
      setSavedStops([]);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'trips'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const stops = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setSavedStops(stops);
    } catch (err) {
      console.warn('Error fetching saved stops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedStops();
  }, [user]);

  const saveStop = async (destination, alertRadiusMeters, label) => {
    if (!user) return null;
    try {
      const tripData = {
        uid: user.uid,
        label: label || destination.name || 'Saved Stop',
        destination: {
          lat: destination.lat,
          lng: destination.lng,
          name: destination.name || 'Target Stop'
        },
        alertRadiusMeters: alertRadiusMeters || 500,
        createdAt: serverTimestamp(),
        lastUsedAt: serverTimestamp(),
        status: 'saved'
      };

      const docRef = await addDoc(collection(db, 'trips'), tripData);
      const newStop = { id: docRef.id, ...tripData };
      setSavedStops((prev) => [newStop, ...prev]);
      return newStop;
    } catch (err) {
      console.error('Error saving stop to Firestore:', err);
      throw err;
    }
  };

  const deleteStop = async (tripId) => {
    if (!user || !tripId) return;
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      setSavedStops((prev) => prev.filter((s) => s.id !== tripId));
    } catch (err) {
      console.error('Error deleting stop:', err);
    }
  };

  const updateStopRadius = async (tripId, newRadius) => {
    if (!user || !tripId) return;
    try {
      await updateDoc(doc(db, 'trips', tripId), {
        alertRadiusMeters: newRadius,
        lastUsedAt: serverTimestamp()
      });
      setSavedStops((prev) =>
        prev.map((s) => (s.id === tripId ? { ...s, alertRadiusMeters: newRadius } : s))
      );
    } catch (err) {
      console.error('Error updating stop radius:', err);
    }
  };

  return {
    savedStops,
    loading,
    fetchSavedStops,
    saveStop,
    deleteStop,
    updateStopRadius
  };
}

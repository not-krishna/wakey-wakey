import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Bookmark, LocateFixed, Loader2 } from 'lucide-react';
import MapView from '../components/MapView';
import DestinationSearch from '../components/DestinationSearch';
import RadiusPicker from '../components/RadiusPicker';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';
import { reverseGeocode } from '../lib/nominatim';

export default function SetDestination() {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTrip } = useTrip();
  const { user } = useAuth();
  const { saveStop } = useTrips();

  const [destination, setDestination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nickname, setNickname] = useState('');
  const [alertRadius, setAlertRadius] = useState(500);
  const [saveStopToggle, setSaveStopToggle] = useState(false);
  const [locatingUser, setLocatingUser] = useState(true);

  // Automatically request current location on screen mount to set default map center
  useEffect(() => {
    if ('geolocation' in navigator) {
      setLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          };
          setUserLocation(coords);
          setLocatingUser(false);
        },
        (err) => {
          console.warn('Initial location fetch failed:', err);
          setLocatingUser(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocatingUser(false);
    }
  }, []);

  useEffect(() => {
    // Check if passed a preselected stop from Home or SavedStops
    if (location.state?.preselectStop) {
      const s = location.state.preselectStop;
      const dest = s.destination || { lat: s.lat, lng: s.lng, name: s.label };
      setDestination(dest);
      setNickname(s.label || dest.name || 'My Stop');
      if (s.alertRadiusMeters) setAlertRadius(s.alertRadiusMeters);
    }
  }, [location.state]);

  const handleSelectFromSearch = (item) => {
    const dest = { lat: item.lat, lng: item.lng, name: item.name };
    setDestination(dest);
    setNickname(item.name);
  };

  const handleMapClick = async (lat, lng) => {
    const placeName = await reverseGeocode(lat, lng);
    const dest = { lat, lng, name: placeName };
    setDestination(dest);
    setNickname(placeName);
  };

  const handleRecenterLocation = () => {
    if ('geolocation' in navigator) {
      setLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setLocatingUser(false);
        },
        () => setLocatingUser(false),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleStartTrip = async () => {
    if (!destination) return;

    const finalLabel = nickname.trim() || destination.name || 'Target Stop';

    if (user && saveStopToggle) {
      try {
        await saveStop(destination, alertRadius, finalLabel);
      } catch (err) {
        console.warn('Could not save stop:', err);
      }
    }

    startTrip(destination, alertRadius, finalLabel);
    navigate('/active-trip', { replace: true });
  };

  return (
    <div className="set-dest-screen">
      {/* Navigation Header */}
      <header className="dest-header">
        <button onClick={() => navigate(-1)} className="btn-ghost back-btn" aria-label="Go back">
          <ArrowLeft size={22} />
        </button>
        <h2 className="header-title">Where to?</h2>
        <div className="header-spacer" />
      </header>

      {/* Search Bar Pinned */}
      <div className="search-bar-wrapper">
        <DestinationSearch onSelectDestination={handleSelectFromSearch} />
      </div>

      {/* Leaflet Map Centered on User Location by Default */}
      <div className="map-container flex-1">
        <MapView
          destination={destination}
          currentLocation={userLocation}
          onMapClick={handleMapClick}
          interactive={true}
        />

        {/* Floating Recenter Location Button */}
        <button onClick={handleRecenterLocation} className="recenter-gps-btn" aria-label="Center on my location">
          {locatingUser ? <Loader2 size={20} className="animate-spin" /> : <LocateFixed size={20} />}
        </button>

        {!destination && (
          <div className="map-tip-bubble">
            <MapPin size={16} />
            <span>Search an address or tap directly on the map to set your stop</span>
          </div>
        )}
      </div>

      {/* Confirm Bottom Sheet */}
      {destination && (
        <div className="confirm-bottom-sheet">
          <div className="drag-handle" />

          <div className="dest-name-row">
            <label className="input-label">Destination Name</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Way home, Central Station"
              className="nickname-input"
            />
          </div>

          <RadiusPicker value={alertRadius} onChange={setAlertRadius} />

          {user && (
            <div className="save-toggle-row">
              <label className="toggle-label">
                <Bookmark size={18} className="save-icon" />
                <span>Save this stop for quick reuse</span>
              </label>
              <input
                type="checkbox"
                checked={saveStopToggle}
                onChange={(e) => setSaveStopToggle(e.target.checked)}
                className="custom-checkbox"
              />
            </div>
          )}

          <button onClick={handleStartTrip} className="btn-primary start-trip-btn">
            Start Trip
          </button>
        </div>
      )}

      <style>{`
        .set-dest-screen {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          position: relative;
          background-color: var(--color-bg);
        }

        .dest-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: calc(var(--safe-top) + 8px) 16px 8px;
          background-color: var(--color-bg);
          z-index: 40;
        }

        .header-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
        }

        .header-spacer {
          width: 40px;
        }

        .search-bar-wrapper {
          padding: 0 16px 10px;
          background-color: var(--color-bg);
          z-index: 40;
        }

        .map-container {
          position: relative;
          width: 100%;
          flex: 1;
        }

        .recenter-gps-btn {
          position: absolute;
          bottom: 24px;
          right: 16px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 1.5px solid var(--color-border);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-float);
          z-index: 30;
          cursor: pointer;
        }

        .map-tip-bubble {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text);
          font-weight: 600;
          box-shadow: var(--shadow-soft);
          z-index: 30;
          pointer-events: none;
          max-width: 90%;
          text-align: center;
        }

        .confirm-bottom-sheet {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--color-bg);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          padding: 16px 20px calc(var(--safe-bottom) + 20px);
          box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.12);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideUpSheet 0.25s ease-out;
        }

        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .drag-handle {
          width: 36px;
          height: 4px;
          background-color: var(--color-border);
          border-radius: 2px;
          align-self: center;
        }

        .dest-name-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .nickname-input {
          padding: 10px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-text);
          outline: none;
        }

        .nickname-input:focus {
          border-color: var(--color-primary);
        }

        .save-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-bg-alt);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 600;
        }

        .save-icon {
          color: var(--color-primary);
        }

        .custom-checkbox {
          width: 20px;
          height: 20px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .start-trip-btn {
          min-height: 52px;
        }
      `}</style>
    </div>
  );
}

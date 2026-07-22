import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Plus } from 'lucide-react';
import MascotIllustration from '../components/MascotIllustration';
import SavedStopCard from '../components/SavedStopCard';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';
import { useTrip } from '../context/TripContext';

export default function SavedStops() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const { savedStops, deleteStop, loading } = useTrips();
  const { startTrip } = useTrip();

  const handleStartStopTrip = (stop) => {
    const dest = stop.destination || { lat: stop.lat, lng: stop.lng, name: stop.label };
    startTrip(dest, stop.alertRadiusMeters || 500, stop.label || dest.name);
    navigate('/active-trip');
  };

  const handleAddStopClick = () => {
    navigate('/set-destination');
  };

  return (
    <div className="saved-stops-screen">
      <header className="page-header">
        <h1 className="h1-title">Saved Stops</h1>
        {user && (
          <button onClick={handleAddStopClick} className="btn-ghost add-stop-btn">
            <Plus size={18} />
            Add
          </button>
        )}
      </header>

      {!user ? (
        <div className="empty-saved-state">
          <MascotIllustration state="idle" size={160} />
          <h2 className="h2-title">Sign in to sync your stops</h2>
          <p className="empty-sub">Save your frequent commutes and start trips with a single tap.</p>
          <button onClick={signInWithGoogle} className="btn-primary auth-btn">
            <LogIn size={18} />
            Sign in with Google
          </button>
        </div>
      ) : savedStops.length === 0 ? (
        <div className="empty-saved-state">
          <MascotIllustration state="idle" size={160} />
          <h2 className="h2-title">No saved stops yet</h2>
          <p className="empty-sub">Start a trip and save it for next time.</p>
          <button onClick={handleAddStopClick} className="btn-primary">
            Find a Destination
          </button>
        </div>
      ) : (
        <div className="stops-list flex-1">
          {savedStops.map((stop) => (
            <SavedStopCard
              key={stop.id}
              stop={stop}
              variant="card"
              onSelect={handleStartStopTrip}
              onDelete={deleteStop}
            />
          ))}
        </div>
      )}

      <style>{`
        .saved-stops-screen {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px 16px;
          gap: 16px;
          background-color: var(--color-bg);
          overflow-y: auto;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: calc(var(--safe-top) + 8px);
        }

        .add-stop-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-primary);
          font-weight: 700;
        }

        .stops-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-saved-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          padding: 30px 20px;
        }

        .empty-sub {
          font-size: 14px;
          color: var(--color-text-muted);
          max-width: 280px;
        }

        .auth-btn {
          max-width: 240px;
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, LogIn, X } from 'lucide-react';
import MascotIllustration from '../components/MascotIllustration';
import SavedStopCard from '../components/SavedStopCard';
import InstallPrompt from '../components/InstallPrompt';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';

export default function Home() {
  const navigate = useNavigate();
  const { user, userProfile, signInWithGoogle } = useAuth();
  const { savedStops } = useTrips();
  const [hideGuestBanner, setHideGuestBanner] = useState(false);

  const displayName = userProfile?.displayName || user?.displayName || 'there';

  const handleStartSearch = () => {
    navigate('/set-destination');
  };

  const handleSelectSavedStop = (stop) => {
    navigate('/set-destination', { state: { preselectStop: stop } });
  };

  return (
    <div className="home-screen">
      {/* Top Greeting Header */}
      <header className="greeting-header">
        <span className="caption-text">Ready to nap?</span>
        <h1 className="h1-title">Hi, {displayName} 👋</h1>
      </header>

      {/* Main Search Bar Launcher */}
      <div onClick={handleStartSearch} className="search-launcher">
        <MapPin size={20} className="launcher-pin" />
        <span className="launcher-placeholder">Where should I wake you up?</span>
        <Search size={18} className="launcher-icon" />
      </div>

      {/* Guest Sign-In Banner */}
      {!user && !hideGuestBanner && (
        <div className="guest-banner">
          <div className="banner-left">
            <span className="guest-title">Sign in to save your stops</span>
            <span className="guest-sub">Sync favorite destinations across devices</span>
          </div>
          <button onClick={signInWithGoogle} className="btn-secondary google-btn">
            <LogIn size={16} />
            Sign in
          </button>
          <button onClick={() => setHideGuestBanner(true)} className="dismiss-btn" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Saved Stops Horizontal Scroll Row */}
      {user && savedStops.length > 0 && (
        <div className="saved-stops-section">
          <div className="section-header">
            <h2 className="h2-title">Quick Start Saved Stop</h2>
          </div>
          <div className="chips-scroll-row">
            {savedStops.map((stop) => (
              <SavedStopCard
                key={stop.id}
                stop={stop}
                variant="chip"
                onSelect={handleSelectSavedStop}
              />
            ))}
          </div>
        </div>
      )}

      {/* Central Cozy Mascot Illustration */}
      <div className="mascot-container">
        <MascotIllustration state="idle" size={200} />
        <p className="mascot-quote">"Snooze away — I've got my eye on the map."</p>
      </div>

      <InstallPrompt />

      <style>{`
        .home-screen {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px 16px;
          gap: 20px;
          background-color: var(--color-bg);
          overflow-y: auto;
        }

        .greeting-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: calc(var(--safe-top) + 8px);
        }

        .search-launcher {
          display: flex;
          align-items: center;
          background-color: var(--color-bg-alt);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-pill);
          padding: 14px 18px;
          box-shadow: var(--shadow-soft);
          gap: 12px;
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .search-launcher:active {
          transform: scale(0.98);
          border-color: var(--color-primary-light);
        }

        .launcher-pin {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .launcher-placeholder {
          flex: 1;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 15px;
          color: var(--color-text-muted);
        }

        .launcher-icon {
          color: var(--color-text-muted);
        }

        .guest-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-bg-alt);
          border: 1px dashed var(--color-primary-light);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          gap: 12px;
          position: relative;
        }

        .banner-left {
          display: flex;
          flex-direction: column;
        }

        .guest-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 14px;
          color: var(--color-text);
        }

        .guest-sub {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .google-btn {
          width: auto !important;
          min-height: 36px !important;
          padding: 6px 14px !important;
          font-size: 13px !important;
          flex-shrink: 0;
        }

        .dismiss-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .saved-stops-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chips-scroll-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }

        .chips-scroll-row::-webkit-scrollbar {
          display: none;
        }

        .mascot-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 220px;
          margin-top: 10px;
        }

        .mascot-quote {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 14px;
          color: var(--color-text-muted);
          text-align: center;
          max-width: 280px;
        }
      `}</style>
    </div>
  );
}

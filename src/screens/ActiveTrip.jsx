import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import MapView from '../components/MapView';
import MascotIllustration from '../components/MascotIllustration';
import { useTrip } from '../context/TripContext';
import { formatDistance, estimateETA } from '../lib/geo';

export default function ActiveTrip() {
  const navigate = useNavigate();
  const {
    activeTrip,
    currentLocation,
    distanceRemaining,
    cancelTrip,
    triggerAlarmManually,
    completeTrip
  } = useTrip();

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showReassurance, setShowReassurance] = useState(true);
  const initialDistanceRef = useRef(null);

  // Auto-redirect if no trip active or if alarm triggered
  useEffect(() => {
    if (!activeTrip) {
      navigate('/', { replace: true });
    } else if (activeTrip.status === 'alarm') {
      navigate('/alarm', { replace: true });
    } else if (activeTrip.status === 'completed') {
      navigate('/complete', { replace: true });
    }
  }, [activeTrip, navigate]);

  // Capture initial distance for progress bar calculation
  useEffect(() => {
    if (distanceRemaining && initialDistanceRef.current === null) {
      initialDistanceRef.current = distanceRemaining;
    }
  }, [distanceRemaining]);

  // Fade out reassurance banner after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReassurance(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!activeTrip) return null;

  // Calculate progress %
  let progressPercent = 0;
  if (initialDistanceRef.current && distanceRemaining !== null) {
    const covered = initialDistanceRef.current - distanceRemaining;
    progressPercent = Math.max(0, Math.min(100, Math.round((covered / initialDistanceRef.current) * 100)));
  }

  const handleCancelClick = () => {
    setShowConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    cancelTrip();
    navigate('/', { replace: true });
  };

  return (
    <div className="active-trip-screen">
      {/* Top Left Floating Cancel Button */}
      <button onClick={handleCancelClick} className="cancel-floating-btn" aria-label="Cancel trip">
        <X size={18} />
        <span>Cancel</span>
      </button>

      {/* Full-Screen Map */}
      <div className="active-map-wrapper">
        <MapView
          destination={activeTrip.destination}
          currentLocation={currentLocation}
          interactive={true}
        />
      </div>

      {/* Reassurance Banner (Fades out after 10s) */}
      {showReassurance && (
        <div className="reassurance-toast">
          <ShieldCheck size={16} className="reassurance-icon" />
          <span>Koa's got this — feel free to rest your eyes.</span>
        </div>
      )}

      {/* Floating Status Card */}
      <div className="status-floating-card">
        <div className="card-inner">
          <MascotIllustration state="watching" size={48} />
          <div className="status-text-stack">
            <div className="dest-name">{activeTrip.label || activeTrip.destination?.name}</div>
            <div className="distance-bold">{formatDistance(distanceRemaining)}</div>
            <div className="eta-sub">{estimateETA(distanceRemaining)}</div>
          </div>
          {/* Demo button to trigger alarm manually */}
          <button onClick={triggerAlarmManually} className="test-alarm-pill" title="Test Alarm">
            Test Alarm
          </button>
        </div>

        {/* Progress Bar along bottom edge */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Confirm Cancel Modal */}
      {showConfirmCancel && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <AlertTriangle size={36} className="modal-warning-icon" />
            <h3 className="h2-title">Cancel this trip?</h3>
            <p className="modal-text">Koa will stop watching your location for this stop.</p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmCancel(false)} className="btn-secondary">
                Keep Watching
              </button>
              <button onClick={handleConfirmCancel} className="btn-primary danger-btn">
                Yes, Cancel Trip
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .active-trip-screen {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--color-bg);
        }

        .cancel-floating-btn {
          position: absolute;
          top: calc(var(--safe-top) + 12px);
          left: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-pill);
          color: var(--color-text);
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          box-shadow: var(--shadow-soft);
          z-index: 50;
          cursor: pointer;
        }

        .active-map-wrapper {
          width: 100%;
          height: 100%;
        }

        .reassurance-toast {
          position: absolute;
          top: calc(var(--safe-top) + 64px);
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(46, 125, 50, 0.9);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--shadow-soft);
          z-index: 50;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .status-floating-card {
          position: absolute;
          bottom: calc(var(--safe-bottom) + 16px);
          left: 16px;
          right: 16px;
          background-color: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-float);
          overflow: hidden;
          z-index: 50;
          display: flex;
          flex-direction: column;
        }

        .card-inner {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          gap: 14px;
        }

        .status-text-stack {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .dest-name {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .distance-bold {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.1;
        }

        .eta-sub {
          font-size: 13px;
          color: var(--color-text-muted);
        }

        .test-alarm-pill {
          background-color: var(--color-accent);
          color: var(--color-primary-dark);
          border: none;
          border-radius: var(--radius-pill);
          padding: 6px 12px;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .progress-track {
          width: 100%;
          height: 5px;
          background-color: var(--color-border);
        }

        .progress-fill {
          height: 100%;
          background-color: var(--color-primary);
          transition: width 0.3s ease;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 200;
        }

        .confirm-modal {
          background-color: var(--color-bg);
          border-radius: var(--radius-md);
          padding: 24px;
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .modal-warning-icon {
          color: var(--color-alarm);
        }

        .modal-text {
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 8px;
        }

        .danger-btn {
          background-color: var(--color-error) !important;
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotIllustration from '../components/MascotIllustration';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../hooks/useTrips';
import { Bookmark, Check } from 'lucide-react';

export default function TripComplete() {
  const navigate = useNavigate();
  const { activeTrip, clearCompletedTrip } = useTrip();
  const { user } = useAuth();
  const { saveStop } = useTrips();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const destName = activeTrip?.label || activeTrip?.destination?.name || 'Your stop';

  const handleSaveStop = async () => {
    if (!user || !activeTrip?.destination || saved) return;
    setSaving(true);
    try {
      await saveStop(
        activeTrip.destination,
        activeTrip.alertRadiusMeters || 500,
        destName
      );
      setSaved(true);
    } catch (err) {
      console.warn('Save stop error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDone = () => {
    clearCompletedTrip();
    navigate('/', { replace: true });
  };

  return (
    <div className="complete-screen">
      <div className="complete-mascot">
        <MascotIllustration state="happy" size={220} />
      </div>

      <div className="complete-content">
        <h1 className="display-title">Nice, you made it! 🎉</h1>
        <p className="body-text">Nap safely next time too.</p>

        {user && activeTrip?.destination && (
          <div className="save-prompt-card">
            {saved ? (
              <div className="saved-success">
                <Check size={18} className="success-icon" />
                <span>Saved to your stops!</span>
              </div>
            ) : (
              <div className="save-prompt-inner">
                <span className="save-text">Save <strong>{destName}</strong> for next time?</span>
                <div className="prompt-buttons">
                  <button onClick={handleSaveStop} disabled={saving} className="btn-primary save-mini-btn">
                    <Bookmark size={14} />
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={handleDone} className="btn-primary done-btn">
          Back to Home
        </button>
      </div>

      <style>{`
        .complete-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          padding: calc(var(--safe-top) + 24px) 24px calc(var(--safe-bottom) + 32px);
          background-color: var(--color-bg);
          text-align: center;
        }

        .complete-mascot {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .complete-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 360px;
        }

        .body-text {
          font-size: 16px;
          color: var(--color-text-muted);
        }

        .save-prompt-card {
          width: 100%;
          background-color: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-top: 8px;
        }

        .save-prompt-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .save-text {
          font-size: 14px;
          color: var(--color-text);
          text-align: left;
        }

        .save-mini-btn {
          width: auto !important;
          min-height: 36px !important;
          padding: 6px 14px !important;
          font-size: 13px !important;
        }

        .saved-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--color-primary);
          font-size: 14px;
        }

        .done-btn {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

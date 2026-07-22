import React from 'react';
import { useNavigate } from 'react-router-dom';
import MascotIllustration from '../components/MascotIllustration';
import { useTrip } from '../context/TripContext';

export default function Alarm() {
  const navigate = useNavigate();
  const { activeTrip, completeTrip } = useTrip();

  const handleAwakeClick = () => {
    completeTrip();
    navigate('/complete', { replace: true });
  };

  const destName = activeTrip?.label || activeTrip?.destination?.name || 'your stop';

  return (
    <div className="alarm-screen">
      {/* Sound Equalizer Waveform Indicator */}
      <div className="waveform-container" aria-label="Audio alarm playing">
        <div className="waveform-bar" />
        <div className="waveform-bar" />
        <div className="waveform-bar" />
        <div className="waveform-bar" />
      </div>

      {/* Large Waking-up Koa Mascot */}
      <div className="mascot-alarm-wrapper">
        <MascotIllustration state="waking" size={240} />
      </div>

      {/* Headline & Subline */}
      <div className="alarm-text-group">
        <h1 className="alarm-title">Wakey waky! 🚏</h1>
        <p className="alarm-sub">You're almost at {destName}.</p>
      </div>

      {/* "I'm awake" Dismiss Button */}
      <div className="alarm-action-container">
        <button onClick={handleAwakeClick} className="btn-alarm">
          I'm awake
        </button>
      </div>

      <style>{`
        .alarm-screen {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: calc(var(--safe-top) + 24px) 24px calc(var(--safe-bottom) + 32px);
          background: radial-gradient(circle at center, #FF8A65 0%, #FF7043 100%);
          color: #FFFFFF;
          text-align: center;
          z-index: 9999;
        }

        .waveform-container {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 28px;
        }

        .mascot-alarm-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
        }

        .alarm-text-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .alarm-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .alarm-sub {
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }

        .alarm-action-container {
          width: 100%;
          max-width: 360px;
        }
      `}</style>
    </div>
  );
}

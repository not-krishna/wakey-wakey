import React from 'react';
import { MapPin, Navigation, Trash2 } from 'lucide-react';
import { formatDistance } from '../lib/geo';

export default function SavedStopCard({
  stop,
  onSelect,
  onDelete,
  variant = 'card' // 'card' or 'chip'
}) {
  if (variant === 'chip') {
    return (
      <button onClick={() => onSelect(stop)} className="saved-chip">
        <MapPin size={16} className="chip-pin" />
        <span className="chip-label">{stop.label || stop.destination?.name}</span>
        <style>{`
          .saved-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background-color: var(--color-bg-alt);
            border: 1.5px solid var(--color-border);
            border-radius: var(--radius-pill);
            color: var(--color-text);
            font-family: var(--font-heading);
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
            transition: background-color 0.15s ease, border-color 0.15s ease;
          }

          .saved-chip:active {
            background-color: var(--color-accent);
            border-color: var(--color-primary-light);
          }

          .chip-pin {
            color: var(--color-primary);
          }
        `}</style>
      </button>
    );
  }

  return (
    <div className="saved-card">
      <div className="card-left">
        <div className="pin-circle">
          <MapPin size={20} className="card-pin" />
        </div>
        <div className="card-info">
          <h3 className="card-title">{stop.label || stop.destination?.name}</h3>
          <span className="card-sub">Alert at {formatDistance(stop.alertRadiusMeters || 500)}</span>
        </div>
      </div>

      <div className="card-actions">
        <button onClick={() => onSelect(stop)} className="btn-primary start-chip-btn">
          <Navigation size={16} />
          Start
        </button>
        {onDelete && (
          <button onClick={() => onDelete(stop.id)} className="delete-btn" aria-label="Delete stop">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <style>{`
        .saved-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          box-shadow: var(--shadow-soft);
          gap: 12px;
        }

        .card-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .pin-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #FFFFFF;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          flex-shrink: 0;
        }

        .card-pin {
          color: var(--color-primary);
        }

        .card-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .card-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 16px;
          color: var(--color-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-sub {
          font-size: 13px;
          color: var(--color-text-muted);
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .start-chip-btn {
          width: auto !important;
          min-height: 38px !important;
          padding: 8px 16px !important;
          font-size: 14px !important;
        }

        .delete-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
        }

        .delete-btn:hover {
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}

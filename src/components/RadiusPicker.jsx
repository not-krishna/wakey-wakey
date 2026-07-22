import React from 'react';
import { formatDistance } from '../lib/geo';

export default function RadiusPicker({ value = 500, onChange }) {
  return (
    <div className="radius-picker-container">
      <div className="radius-header">
        <span className="radius-label">Wake up alert distance:</span>
        <span className="radius-value">{formatDistance(value)}</span>
      </div>

      <div className="slider-wrapper">
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
        />
        <div className="slider-range-labels">
          <span>100m</span>
          <span>500m</span>
          <span>1km</span>
          <span>2km</span>
        </div>
      </div>

      <style>{`
        .radius-picker-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .radius-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .radius-label {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 14px;
          color: var(--color-text);
        }

        .radius-value {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 16px;
          color: var(--color-primary);
          background-color: var(--color-accent);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
        }

        .slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .radius-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: var(--color-border);
          outline: none;
        }

        .radius-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: transform 0.1s ease;
        }

        .radius-slider::-webkit-slider-thumb:active {
          transform: scale(1.15);
        }

        .slider-range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}

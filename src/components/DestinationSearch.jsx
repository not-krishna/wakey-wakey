import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchAddress } from '../lib/nominatim';

export default function DestinationSearch({ onSelectDestination, placeholder = "Where should I wake you up?" }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const res = await searchAddress(query);
      setResults(res);
      setLoading(false);
      setIsOpen(true);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSelect = (item) => {
    onSelectDestination(item);
    setQuery(item.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <MapPin className="search-icon" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {loading ? (
          <Loader2 className="spinner-icon animate-spin" size={18} />
        ) : query ? (
          <button onClick={handleClear} className="clear-btn" aria-label="Clear search">
            <X size={18} />
          </button>
        ) : null}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-results-dropdown">
          {results.map((item) => (
            <li key={item.id} onClick={() => handleSelect(item)} className="result-item">
              <MapPin className="result-pin-icon" size={18} />
              <div className="result-text">
                <span className="result-title">{item.name}</span>
                <span className="result-subtitle">{item.fullAddress}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !loading && results.length === 0 && (
        <div className="no-results-dropdown">
          <span>No matching stops found. Try tapping the map directly!</span>
        </div>
      )}

      <style>{`
        .search-container {
          position: relative;
          width: 100%;
          z-index: 50;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background-color: var(--color-bg-alt);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-pill);
          padding: 10px 16px;
          box-shadow: var(--shadow-soft);
          gap: 10px;
        }

        .search-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--color-text);
          outline: none;
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .clear-btn {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
        }

        .spinner-icon {
          color: var(--color-primary);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .search-results-dropdown,
        .no-results-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-float);
          max-height: 260px;
          overflow-y: auto;
          list-style: none;
          padding: 6px 0;
          z-index: 60;
        }

        .result-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .result-item:hover, .result-item:active {
          background-color: var(--color-bg-alt);
        }

        .result-pin-icon {
          color: var(--color-primary);
          margin-top: 2px;
          flex-shrink: 0;
        }

        .result-text {
          display: flex;
          flex-direction: column;
        }

        .result-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 15px;
          color: var(--color-text);
        }

        .result-subtitle {
          font-size: 12px;
          color: var(--color-text-muted);
          line-height: 1.3;
        }

        .no-results-dropdown {
          padding: 16px;
          font-size: 14px;
          color: var(--color-text-muted);
          text-align: center;
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bookmark, Settings } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export default function BottomNav() {
  const { activeTrip } = useTrip();
  const location = useLocation();

  // Hide bottom nav during Active Trip or Alarm screens
  if (activeTrip?.status === 'active' || activeTrip?.status === 'alarm') {
    return null;
  }

  // Also hide on sub-screens like /set-destination
  if (location.pathname === '/set-destination') {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/saved', label: 'Saved Stops', icon: Bookmark },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <div className={`icon-badge ${isActive ? 'active-badge' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="nav-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}

      <style>{`
        .bottom-nav {
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 64px;
          background-color: var(--color-bg);
          border-top: 1px solid var(--color-border);
          padding-bottom: var(--safe-bottom);
          z-index: 100;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--color-text-muted);
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          flex: 1;
          gap: 3px;
          transition: color 0.15s ease;
        }

        .icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 28px;
          border-radius: var(--radius-pill);
          transition: background-color 0.2s ease;
        }

        .nav-item.active {
          color: var(--color-primary);
          font-weight: 700;
        }

        .icon-badge.active-badge {
          background-color: var(--color-accent);
          color: var(--color-primary-dark);
        }
      `}</style>
    </nav>
  );
}

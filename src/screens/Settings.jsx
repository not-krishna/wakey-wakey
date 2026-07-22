import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Check, User, Heart, Info, Map } from 'lucide-react';
import MascotIllustration from '../components/MascotIllustration';
import ShareAppButton from '../components/ShareAppButton';
import RadiusPicker from '../components/RadiusPicker';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, userProfile, signInWithGoogle, signOut, updateDisplayName, updateDefaultRadius } = useAuth();

  const [displayNameInput, setDisplayNameInput] = useState('');
  const [defaultRadius, setDefaultRadius] = useState(500);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayNameInput(userProfile.displayName);
    } else if (user?.displayName) {
      setDisplayNameInput(user.displayName);
    }

    if (userProfile?.defaultAlertRadiusMeters) {
      setDefaultRadius(userProfile.defaultAlertRadiusMeters);
    }
  }, [userProfile, user]);

  const handleSaveName = async () => {
    if (!displayNameInput.trim()) return;
    try {
      await updateDisplayName(displayNameInput.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      console.warn('Update name error:', err);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setDefaultRadius(newRadius);
    if (user) {
      updateDefaultRadius(newRadius).catch(() => {});
    }
  };

  return (
    <div className="settings-screen">
      <header className="page-header">
        <h1 className="h1-title">Settings</h1>
      </header>

      {/* Profile Section */}
      <section className="settings-section card">
        <h2 className="section-title">
          <User size={18} />
          Profile
        </h2>

        {user ? (
          <div className="profile-box">
            <div className="avatar-row">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="user-avatar" />
              ) : (
                <MascotIllustration state="badge" size={54} />
              )}
              <div className="profile-info">
                <span className="user-email">{user.email}</span>
                <button onClick={signOut} className="sign-out-link">
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>

            <div className="edit-name-group">
              <label className="caption-text">Display Name</label>
              <div className="name-input-row">
                <input
                  type="text"
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  placeholder="Your name"
                  className="name-input"
                />
                <button onClick={handleSaveName} className="btn-primary save-name-btn">
                  {nameSaved ? <Check size={16} /> : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="guest-profile-box">
            <p className="caption-text">Sign in to sync your saved stops and default alarm preferences across all devices.</p>
            <button onClick={signInWithGoogle} className="btn-primary">
              <LogIn size={18} />
              Sign in with Google
            </button>
          </div>
        )}
      </section>

      {/* Preferences Section */}
      <section className="settings-section card">
        <h2 className="section-title">Default Alarm Radius</h2>
        <RadiusPicker value={defaultRadius} onChange={handleRadiusChange} />
      </section>

      {/* Share Section */}
      <section className="settings-section card">
        <h2 className="section-title">
          <Heart size={18} />
          Spread the Word
        </h2>
        <p className="caption-text">Know someone who sleeps on the train? Help them nap safely too.</p>
        <ShareAppButton />
      </section>

      {/* About & Attribution Section */}
      <section className="settings-section card about-card">
        <h2 className="section-title">
          <Info size={18} />
          About Wakey Waky
        </h2>
        <div className="about-lines">
          <div className="about-line">
            <span>App Version</span>
            <strong>v1.0.0 (PWA)</strong>
          </div>
          <div className="about-line">
            <span>Mascot</span>
            <strong>Koa the Koala 🐨</strong>
          </div>
          <div className="osm-attribution">
            <Map size={14} />
            <span>Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors, Geocoding by Nominatim.</span>
          </div>
        </div>
      </section>

      <style>{`
        .settings-screen {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px 16px;
          gap: 16px;
          background-color: var(--color-bg);
          overflow-y: auto;
        }

        .page-header {
          margin-top: calc(var(--safe-top) + 8px);
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
        }

        .profile-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .avatar-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid var(--color-primary-light);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-email {
          font-size: 14px;
          color: var(--color-text-muted);
        }

        .sign-out-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--color-error);
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }

        .edit-name-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .name-input-row {
          display: flex;
          gap: 8px;
        }

        .name-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-family: var(--font-body);
          outline: none;
        }

        .save-name-btn {
          width: auto !important;
          min-height: 42px !important;
          padding: 8px 18px !important;
          font-size: 14px !important;
        }

        .guest-profile-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .about-card {
          margin-bottom: 20px;
        }

        .about-lines {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
        }

        .about-line {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 6px;
        }

        .osm-attribution {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--color-text-muted);
          line-height: 1.3;
          margin-top: 4px;
        }

        .osm-attribution a {
          color: var(--color-primary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

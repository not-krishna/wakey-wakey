import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download, Smartphone } from 'lucide-react';
import MascotIllustration from './MascotIllustration';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissedSession, setDismissedSession] = useState(false);

  useEffect(() => {
    // Check if app is ALREADY running in installed standalone mode
    const standaloneCheck =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(standaloneCheck);

    // Detect iOS devices
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iosCheck);

    // Capture Android/Chrome native install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsStandalone(true);
    }
  };

  // If already installed as a standalone PWA or dismissed for current session, don't display
  if (isStandalone || dismissedSession) {
    return null;
  }

  return (
    <div className="install-modal-overlay">
      <div className="install-popup-card">
        <button
          onClick={() => setDismissedSession(true)}
          className="close-popup-btn"
          aria-label="Close install prompt"
        >
          <X size={20} />
        </button>

        <div className="popup-header">
          <MascotIllustration state="badge" size={64} />
          <div className="popup-title-group">
            <h3 className="popup-title">Install Wakey Waky</h3>
            <span className="popup-subtitle">Install as a Web App for reliable nap alarms!</span>
          </div>
        </div>

        <div className="popup-benefits">
          <div className="benefit-item">
            <Smartphone size={16} className="benefit-icon" />
            <span>Runs as a standalone app without browser chrome</span>
          </div>
          <div className="benefit-item">
            <Download size={16} className="benefit-icon" />
            <span>Reliable background location watching & alarm alerts</span>
          </div>
        </div>

        {deferredPrompt ? (
          <button onClick={handleInstallAndroid} className="btn-primary install-action-btn">
            <Download size={18} />
            Install App Now
          </button>
        ) : isIOS ? (
          <div className="ios-instructions-box">
            <p className="ios-instruction-title">How to install on iOS Safari:</p>
            <div className="ios-step-row">
              <span className="step-num">1</span>
              <span>Tap the <strong>Share</strong> button <Share size={15} className="inline-icon" /> at the bottom of Safari</span>
            </div>
            <div className="ios-step-row">
              <span className="step-num">2</span>
              <span>Scroll down & tap <strong>Add to Home Screen</strong> <PlusSquare size={15} className="inline-icon" /></span>
            </div>
          </div>
        ) : (
          <div className="generic-pwa-note">
            <p>To install: Open browser menu (<strong>⋮</strong>) and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
          </div>
        )}
      </div>

      <style>{`
        .install-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 16px;
          z-index: 999;
          animation: fadeIn 0.25s ease-out;
        }

        .install-popup-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background-color: var(--color-bg);
          border: 2px solid var(--color-primary-light);
          border-radius: var(--radius-lg);
          padding: 24px 20px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-popup-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .popup-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .popup-title-group {
          display: flex;
          flex-direction: column;
        }

        .popup-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text);
        }

        .popup-subtitle {
          font-size: 13px;
          color: var(--color-text-muted);
          line-height: 1.3;
        }

        .popup-benefits {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: var(--color-bg-alt);
          padding: 12px 14px;
          border-radius: var(--radius-md);
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--color-text);
          font-weight: 600;
        }

        .benefit-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .install-action-btn {
          min-height: 50px;
          font-size: 16px;
        }

        .ios-instructions-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .ios-instruction-title {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: var(--color-primary-dark);
        }

        .ios-step-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--color-text);
        }

        .step-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background-color: var(--color-primary);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .inline-icon {
          display: inline;
          vertical-align: middle;
          color: var(--color-primary);
        }

        .generic-pwa-note {
          font-size: 13px;
          color: var(--color-text-muted);
          text-align: center;
          padding: 8px;
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotIllustration from '../components/MascotIllustration';
import { ChevronRight, MapPin, Bell, ShieldAlert } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0, 1, 2 = slides; 3 = location priming; 4 = notification priming

  const slides = [
    {
      state: 'idle',
      headline: 'Meet Koa 🐨',
      body: 'Hi, I\'m Koa 🐨 I\'ll make sure you never sleep past your stop.'
    },
    {
      state: 'watching',
      headline: 'Set your stop.',
      body: 'Drop a pin on your map — bus, train, metro, doesn\'t matter.'
    },
    {
      state: 'waking',
      headline: 'Doze off freely.',
      body: 'Koa watches the map and wakes you right on time.'
    }
  ];

  const finishOnboarding = () => {
    localStorage.setItem('koa_onboarding_done', 'true');
    navigate('/', { replace: true });
  };

  const handleNextSlide = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3); // move to Location Priming
    }
  };

  const handleAllowLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setStep(4),
        () => setStep(4),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setStep(4);
    }
  };

  const handleAllowNotifications = async () => {
    if ('Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
    finishOnboarding();
  };

  // Location Priming Screen (Step 3)
  if (step === 3) {
    return (
      <div className="onboarding-screen priming-screen">
        <div className="priming-content">
          <MascotIllustration state="watching" size={180} />
          <h2 className="h1-title text-center">Enable Location Access</h2>
          <div className="permission-badge-box">
            <ShieldAlert size={18} className="badge-icon" />
            <span>Required for live GPS transit stop watching</span>
          </div>
          <p className="body-text text-center">
            I need your location to keep watch — just while your transit trip is active.
          </p>
          <button onClick={handleAllowLocation} className="btn-primary">
            <MapPin size={20} />
            Allow Location Access
          </button>
        </div>
        <OnboardingStyles />
      </div>
    );
  }

  // Notification Priming Screen (Step 4)
  if (step === 4) {
    return (
      <div className="onboarding-screen priming-screen">
        <div className="priming-content">
          <MascotIllustration state="waking" size={180} />
          <h2 className="h1-title text-center">Enable Notification Alerts</h2>
          <div className="permission-badge-box">
            <ShieldAlert size={18} className="badge-icon" />
            <span>Required to wake you up before your stop</span>
          </div>
          <p className="body-text text-center">
            Let me shout when it's time to wake up? Allow notifications so Koa can ring your alarm on time.
          </p>
          <button onClick={handleAllowNotifications} className="btn-primary">
            <Bell size={20} />
            Allow Notifications
          </button>
        </div>
        <OnboardingStyles />
      </div>
    );
  }

  // Standard 3-Slide Intro (Steps 0, 1, 2)
  const currentSlide = slides[step];

  return (
    <div className="onboarding-screen">
      <div className="onboarding-header">
        {step < 2 && (
          <button onClick={finishOnboarding} className="btn-ghost skip-btn">
            Skip
          </button>
        )}
      </div>

      <div className="slide-illustration">
        <MascotIllustration state={currentSlide.state} size={220} />
      </div>

      <div className="slide-content">
        <h2 className="display-title text-center">{currentSlide.headline}</h2>
        <p className="body-text text-center">{currentSlide.body}</p>

        {/* Dot Pagination */}
        <div className="dots-container">
          {slides.map((_, idx) => (
            <div key={idx} className={`dot ${idx === step ? 'active-dot' : ''}`} />
          ))}
        </div>

        <button onClick={handleNextSlide} className="btn-primary next-btn">
          {step === 2 ? "Let's go" : 'Next'}
          <ChevronRight size={20} />
        </button>
      </div>

      <OnboardingStyles />
    </div>
  );
}

function OnboardingStyles() {
  return (
    <style>{`
      .onboarding-screen {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 24px 20px;
        background-color: var(--color-bg);
        position: relative;
        justify-content: space-between;
      }

      .onboarding-header {
        display: flex;
        justify-content: flex-end;
        min-height: 40px;
      }

      .slide-illustration {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .slide-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding-bottom: 20px;
      }

      .priming-screen {
        justify-content: center;
      }

      .priming-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 18px;
      }

      .permission-badge-box {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--color-bg-alt);
        border: 1px solid var(--color-primary-light);
        border-radius: var(--radius-pill);
        padding: 6px 14px;
        font-family: var(--font-heading);
        font-size: 13px;
        font-weight: 700;
        color: var(--color-primary-dark);
      }

      .badge-icon {
        color: var(--color-primary);
      }

      .body-text {
        font-size: 16px;
        color: var(--color-text-muted);
        line-height: 1.4;
        max-width: 320px;
      }

      .text-center {
        text-align: center;
      }

      .dots-container {
        display: flex;
        gap: 8px;
        margin: 8px 0;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--color-border);
        transition: width 0.2s ease, background-color 0.2s ease;
      }

      .dot.active-dot {
        width: 24px;
        border-radius: 4px;
        background-color: var(--color-primary);
      }
    `}</style>
  );
}

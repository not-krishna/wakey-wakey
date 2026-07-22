import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotIllustration from '../components/MascotIllustration';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      const hasCompletedOnboarding = localStorage.getItem('koa_onboarding_done');
      if (hasCompletedOnboarding) {
        navigate('/', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [loading, navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="badge-wrapper">
          <MascotIllustration state="badge" size={120} />
        </div>
        <h1 className="splash-title">Wakey Waky</h1>
        <p className="splash-tagline">Never miss your stop.</p>
      </div>

      <style>{`
        .splash-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background-color: var(--color-primary);
          color: #FFFFFF;
          text-align: center;
          padding: 24px;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .badge-wrapper {
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.15));
        }

        .splash-title {
          font-family: var(--font-heading);
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .splash-tagline {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}

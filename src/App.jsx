import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

import BottomNav from './components/BottomNav';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import SetDestination from './screens/SetDestination';
import ActiveTrip from './screens/ActiveTrip';
import Alarm from './screens/Alarm';
import TripComplete from './screens/TripComplete';
import SavedStops from './screens/SavedStops';
import Settings from './screens/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <div className="app-container">
            <main className="main-content">
              <Routes>
                <Route path="/splash" element={<Splash />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/" element={<Home />} />
                <Route path="/set-destination" element={<SetDestination />} />
                <Route path="/active-trip" element={<ActiveTrip />} />
                <Route path="/alarm" element={<Alarm />} />
                <Route path="/complete" element={<TripComplete />} />
                <Route path="/saved" element={<SavedStops />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

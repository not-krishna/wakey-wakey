# Wakey Waky — Frontend Spec

## 1. Stack
- **Framework:** React + Vite
- **PWA plugin:** `vite-plugin-pwa` (handles manifest + service worker generation)
- **Routing:** React Router (simple, few screens)
- **Maps:** Leaflet + `react-leaflet`, tiles from OpenStreetMap
- **Geocoding (address search):** Nominatim (OSM) REST API, no key
- **State:** React Context + hooks is enough (no Redux needed for this scope)
- **Styling:** CSS variables from designsystem.md (plain CSS Modules or Tailwind config
  mapped to those tokens — either is fine, pick one and stay consistent)
- **Auth/DB:** Firebase SDK (`firebase/auth`, `firebase/firestore`) per backend.md

## 2. PWA Configuration

`manifest.json` essentials:
```json
{
  "name": "Wakey Waky",
  "short_name": "Wakey Waky",
  "description": "Koa the koala wakes you up before you miss your stop.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#2E7D32",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- `display: standalone` so it opens like a native app once installed (no browser chrome).
- Add an **"Add to Home Screen" prompt component** — Android supports the native
  `beforeinstallprompt` event; iOS Safari does NOT, so we need a custom instructional
  banner for iOS users ("Tap Share → Add to Home Screen") — show Koa explaining this
  with a small illustration per designsystem.md.
- Service worker (via `vite-plugin-pwa`, `injectManifest` or `generateSW` strategy):
  caches app shell for offline load, but does NOT try to cache/replay live GPS data.

## 3. Screens

1. **Splash / Loading**
   - Idle Koa illustration, app name, brief fade to next screen.

2. **Onboarding (first launch only)**
   - 2-3 short slides introducing Koa and the concept.
   - Ends with permission priming screens (see Section 5) before actually requesting
     browser permissions.

3. **Home**
   - If no active trip: "Where should I wake you up?" search bar + Koa idle
     illustration + list of saved stops (if signed in) as quick-select chips.
   - Sign-in entry point (optional, not forced) — small "Sign in to save stops" link.

4. **Set Destination**
   - Map view (Leaflet) + search bar (Nominatim autocomplete-style search-on-type,
     debounced).
   - Tap map or select search result to drop destination pin.
   - Confirm sheet slides up: destination name, alert radius slider/stepper (default
     500m, adjustable), "Save this stop" toggle (only if signed in), "Start Trip" button.

5. **Active Trip**
   - Full map view, current location (green dot) + destination (koala-ear pin) +
     live distance/ETA readout.
   - "Watching Koa" illustration in a small persistent card.
   - Wake Lock active (screen won't sleep) with a note explaining why.
   - Cancel trip button (secondary/outlined style).

6. **Alarm Screen** (full-screen takeover, triggered on proximity)
   - `--color-alarm` background wash, Waking-up Koa illustration, "Wakey waky!" title,
     large "I'm awake" pill button to dismiss, sound + vibration firing on entry.
   - If not dismissed within N seconds, repeat/escalate (louder or re-vibrate) — exact
     timing to be tuned during testing.

7. **Trip Complete**
   - Happy Koa, brief confirmation, returns to Home. Option to "Save as favorite stop."

8. **Saved Stops** (only if signed in)
   - List of saved trip templates, tap to quick-start a new trip to that destination.

9. **Settings**
   - Sign in/out, editable display name (simple text field, saves to Firestore
     `users/{uid}.displayName`, no uniqueness check), default alert radius,
     notification/vibration toggles, **"Share Wakey Waky" button**, about/credits
     (OSM attribution required — see Section 6).
   - Share button uses the native **Web Share API** (`navigator.share`) where
     supported — opens the OS share sheet (WhatsApp, Messages, etc.) with a short
     Koa-voiced message + app link. Falls back to "Copy Link" (clipboard) on
     browsers/desktops without Web Share support.
     ```js
     const shareApp = async () => {
       const shareData = {
         title: "Wakey Waky",
         text: "Never miss your stop again — Koa's got your back 🐨🚏",
         url: "https://wakeywaky.app", // replace with real deployed URL
       };
       if (navigator.share) {
         await navigator.share(shareData);
       } else {
         await navigator.clipboard.writeText(shareData.url);
         // show toast: "Link copied!"
       }
     };
     ```
   - This is app-referral sharing only (no live trip sharing, no friends list/social
     graph) — kept intentionally simple for MVP.

## 4. Component Structure (suggested)

```
src/
  components/
    MascotIllustration.jsx     (renders correct Koa state by prop)
    MapView.jsx
    DestinationSearch.jsx
    RadiusPicker.jsx
    AlarmOverlay.jsx
    InstallPrompt.jsx          (Android native + iOS custom banner)
    SavedStopCard.jsx
    ShareAppButton.jsx         (Web Share API, clipboard fallback)
  screens/
    Splash.jsx
    Onboarding.jsx
    Home.jsx
    SetDestination.jsx
    ActiveTrip.jsx
    Alarm.jsx
    TripComplete.jsx
    SavedStops.jsx
    Settings.jsx
  hooks/
    useGeolocationWatch.js     (wraps watchPosition, distance calc)
    useAlarmTrigger.js         (fires notification/sound/vibration on threshold)
    useAuth.js                 (Firebase auth state)
    useTrips.js                (Firestore CRUD for trips)
    useWakeLock.js
  lib/
    firebase.js                (init, reads .env vars)
    geo.js                     (haversine distance, formatting helpers)
    nominatim.js                (geocoding search wrapper)
  context/
    AuthContext.jsx
    TripContext.jsx
```

## 5. Permission Priming (UX pattern)

Never call `Notification.requestPermission()` or
`navigator.geolocation.getCurrentPosition()` cold. Always show an in-app explainer
screen first (Koa-voiced, per designsystem.md copy table), THEN trigger the real
browser prompt when the user taps "Allow." This avoids the permission being denied
out of surprise/distrust, which can't easily be re-prompted afterward.

## 6. Attribution Requirements
- OpenStreetMap tiles require visible attribution on the map (small text, standard
  Leaflet default: "© OpenStreetMap contributors") — do not remove.
- Nominatim usage policy requires a valid `User-Agent` / referrer identifying the app,
  and reasonable request rates (debounce search input, don't fire on every keystroke).

## 7. Responsive/Platform Notes
- Design for mobile-first (this is a phone-in-pocket app), but keep layout usable at
  tablet/desktop widths for testing convenience — not a priority to polish desktop.
- Safe-area insets (`env(safe-area-inset-*)`) needed for iOS notch/home-indicator
  spacing, especially on the full-screen Alarm overlay.

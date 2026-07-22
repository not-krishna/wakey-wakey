# Wakey Waky — Backend Spec

## 1. Overview
Backend is intentionally lightweight — this is a client-heavy PWA. "Backend" here means:
1. **Firebase Auth** — Google Sign-In (free)
2. **Firestore** — store user profiles + saved trips/stops (free tier: Spark plan)
3. **Browser-native APIs** — Geolocation, Notifications, Service Worker — these run
   client-side, no server needed, but are documented here since they're core to how
   "alarms" actually fire.
4. No custom server required for MVP. Everything runs client-side + Firebase. A
   lightweight serverless function (Firebase Cloud Functions) is OPTIONAL, only needed
   later if we add server-side push notifications (see Section 6).

## 2. Firebase Project Setup (from scratch)

Steps for whoever sets this up (you or the AI builder, walking through Firebase Console):

1. Go to https://console.firebase.google.com → "Add project" → name it e.g.
   `wakey-waky` → disable Google Analytics (not needed for MVP, keeps it simple).
2. In the project, go to **Build → Authentication → Get Started** → enable
   **Google** as a sign-in provider. Set a support email (required by Google).
3. Go to **Build → Firestore Database → Create database** → start in
   **production mode** → pick a region close to your primary users.
4. Go to **Project settings (gear icon) → General → Your apps → Add app → Web (</>)**.
   Register the app (nickname: `wakey-waky-web`). Firebase will generate a config
   object — this is what the app needs (see "What I need from you" below).
5. (For installability/PWA) No extra Firebase step needed — PWA manifest + service
   worker are handled in the frontend, not Firebase.
6. Set Firestore Security Rules (see Section 4) before going live — default "production
   mode" locks everything, we need to explicitly allow authenticated users to read/write
   their own data.

## 3. Data Model (Firestore)

```
users (collection)
  └── {uid} (document)
        - displayName: string          (defaults to Google name on first sign-in,
                                         user can edit freely in Settings — no
                                         uniqueness check, purely cosmetic)
        - email: string
        - photoURL: string
        - createdAt: timestamp
        - defaultAlertRadiusMeters: number   (e.g. 500)

trips (collection)
  └── {tripId} (document)
        - uid: string                  (owner, matches auth uid)
        - label: string                (optional nickname, e.g. "Way home")
        - destination:
            - lat: number
            - lng: number
            - name: string             (reverse-geocoded or user-entered label)
        - alertRadiusMeters: number
        - createdAt: timestamp
        - lastUsedAt: timestamp
        - status: "active" | "completed" | "cancelled"
```

Notes:
- We store trips as a flat collection (not nested under users) so we can query
  `where uid == currentUser.uid` easily and keep security rules simple.
- No location history / live-tracking data is stored server-side — location tracking
  during an active trip stays entirely on-device (privacy-friendly, also avoids
  Firestore write costs for constant GPS pings).
- "Saved/favorite stops" = trips with `status` reused as a template (label + destination
  saved for quick reuse) — same collection, just create a new trip doc from a saved one.

## 4. Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /trips/{tripId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

## 5. Auth Flow
1. User taps "Sign in with Google" → Firebase `signInWithPopup` (desktop) or
   `signInWithRedirect` (recommended for mobile PWAs / iOS Safari, since popups are
   flaky in installed PWA contexts).
2. On first sign-in, create their `users/{uid}` doc with defaults
   (`defaultAlertRadiusMeters: 500`).
3. Store auth state via Firebase's built-in persistence (`browserLocalPersistence`) so
   they stay logged in between PWA launches.
4. Sign-in is only needed to save/sync trips across devices — the app should still let
   someone start a one-off trip WITHOUT signing in (stored temporarily in memory/
   localStorage only), to reduce friction. Prompt sign-in only when they try to "save"
   a stop.
5. In Settings, the user can edit their `displayName` field directly (simple text
   input, updates the Firestore `users/{uid}` doc). This is purely a cosmetic label
   shown in-app (e.g. "Hi, Alex!" greeting) — it does not need to be unique and is
   not used for lookup/search, so no extra validation/index required.

## 6. Notifications & Alarm Logic (client-side, the core mechanic)

This is the trickiest part technically — flagging the constraints clearly:

- **Permissions needed:** `Notification.requestPermission()` (for push/local
  notifications) and Geolocation permission (`navigator.geolocation.watchPosition`).
  Both must be requested with clear context (per designsystem.md copy) — browsers block
  cold/unexplained permission prompts.
- **Foreground tracking:** while the PWA tab/app is open and active, use
  `watchPosition` to poll location, calculate distance to destination (haversine
  formula), and trigger a local notification + in-app alarm screen + sound + vibration
  (`navigator.vibrate`) when within `alertRadiusMeters`.
- **Background tracking limitation (IMPORTANT, flag to user):**
  - **Android (Chrome):** Service workers + Periodic Background Sync / Web Push can
    keep working reasonably well even when the browser is backgrounded, especially if
    the PWA is "installed" (Add to Home Screen).
  - **iOS (Safari):** PWAs have NO reliable background geolocation. If the screen locks
    or the user switches apps, location tracking pauses. This is an Apple/WebKit
    platform limitation, not something we can code around in a PWA.
  - **Practical mitigation for MVP:** Keep-awake screen (Wake Lock API,
    `navigator.wakeLock`) to stop the phone screen from locking during an active trip,
    with clear copy telling the user to keep the app open/screen on for reliable
    alarms. Set expectations honestly in-app rather than over-promising background
    reliability on iOS.
- **Sound:** local alarm sound plays via `<audio>` element (must be triggered by a
  recent user gesture to satisfy autoplay policies — e.g. user taps "Start trip" which
  primes the audio context).
- **Optional Phase 2:** Firebase Cloud Messaging (FCM) for true push notifications sent
  from a Cloud Function, if we later add a small server component to track trips
  server-side (would remove the "app must stay open" limitation on Android, still
  limited on iOS due to WebKit push support restrictions).

## 7. Environment Variables

The Firebase web config goes into a `.env` file (never committed to git):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Add `.env` to `.gitignore` immediately.

## 8. What I'll need from you in chat (when we get to actually building)

✅ **Done** — Firebase config received and wired into `.env` + `src/lib/firebase.js`:
- `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`,
  and `measurementId` (Analytics was enabled on the project — kept optional/guarded in
  code since Analytics doesn't reliably work in all PWA contexts and depends on
  cookies; app functions fully without it).

No Google Maps API key needed — we're using OpenStreetMap + Leaflet (free, keyless).
For geocoding (turning a searched address into lat/lng), we'll use **Nominatim**
(OSM's free geocoding API) — no key required, just a usage policy to respect
(reasonable rate limits, custom User-Agent header).

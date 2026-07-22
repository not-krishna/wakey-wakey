# Wakey Waky — Full App Build & Visual Instructions

This is the master build doc. It walks through the **entire app, screen by screen**,
describing exactly what it should look like and how it should be built. Use alongside
`designsystem.md` (tokens/mascot/voice), `backend.md` (Firebase/data), and
`frontend.md` (stack/components) — this file ties them together into one build order.

---

## 0. Global Layout Rules

- **Viewport:** mobile-first, designed at a 390×844 base (iPhone-ish) but must flex to
  360×800 (common Android) and up to tablet widths without breaking.
- **Safe areas:** every full-screen view must respect
  `env(safe-area-inset-top/bottom)` — critical on iOS for notch + home indicator.
- **Base spacing unit:** 8px grid. Margins/paddings should be multiples of 8
  (8, 16, 24, 32...). Screen edge padding = 16px on mobile.
- **Corner radius scale:** small elements (chips, inputs) = 12px, cards = 16px, bottom
  sheets = 20px (top corners only), buttons = fully pill (9999px).
- **Global background:** `--color-bg` (#FFFFFF) as base, `--color-bg-alt` (#F4FAF4)
  for any raised card/sheet surface.
- **Shadows:** one soft shadow style used everywhere for elevation:
  `0 2px 8px rgba(0,0,0,0.06)`. Never use hard/dark drop shadows — keep it soft, matches
  the cozy mascot vibe.
- **Sticky elements:** bottom nav / primary CTA buttons are sticky-bottom with a subtle
  top gradient fade on the content behind them, not a hard line.
- **Font:** Quicksand (headings) / Nunito (body) from Google Fonts, loaded via
  `@fontsource` npm packages (not a runtime Google Fonts CDN call, for offline PWA
  reliability).

---

## 1. App Shell / Navigation

- No traditional top app bar most of the time — screens feel more like a single
  continuous "conversation with Koa" than a boxy admin panel.
- **Bottom navigation** (3 items, visible on Home / Saved Stops / Settings only —
  hidden during Active Trip and Alarm, which are full-screen takeovers):
  - 🏠 Home
  - ⭐ Saved Stops
  - ⚙️ Settings
  - Active tab: icon + label in `--color-primary`, filled pill background
    `--color-accent` behind the icon. Inactive: `--color-text-muted`, no background.
- **Back navigation:** simple chevron-left top-left, ghost button style, appears on
  sub-screens (Set Destination, individual Saved Stop detail).

---

## 2. Screen-by-Screen Detail

### 2.1 Splash Screen
- Full green (`--color-primary`) background.
- Centered: white circular badge (120px) containing Koa's face icon, app name "Wakey
  Waky" below in white Quicksand bold 28px, small tagline under in a lighter weight:
  "Never miss your stop."
- Idle Koa "breathing" animation (subtle scale pulse) while Firebase auth state
  resolves in the background.
- Auto-transitions to Onboarding (first launch) or Home (returning user) after
  auth/session check — no manual "continue" tap needed, max ~1.5s.

### 2.2 Onboarding (first launch only, 3 slides, swipeable)
Each slide: illustration top ~55% of screen, headline + one line of body text below,
dot pagination, "Next" pill button (last slide says "Let's go").
1. **Slide 1 — Idle Koa hugging a leaf.** Headline: "Meet Koa 🐨" Body: "Koa naps a lot
   — but never lets you miss your stop."
2. **Slide 2 — Watching Koa with map pin.** Headline: "Set your stop." Body: "Drop a
   pin on your map — bus, train, metro, doesn't matter."
3. **Slide 3 — Waking-up Koa.** Headline: "Doze off freely." Body: "Koa watches the
   map and wakes you right on time."
- Skip link top-right (small, muted text) on slides 1-2.

### 2.3 Permission Priming (part of onboarding flow, 2 sub-screens)
Shown right after onboarding, before the real browser prompts fire.
- **Location priming:** Watching Koa illustration, headline "I need to see where we
  are" body copy from designsystem.md, single primary button "Allow Location" (this
  tap triggers the real `getCurrentPosition`/`watchPosition` browser prompt
  immediately after).
- **Notification priming:** Alert Koa illustration (ear perked), headline "Let me
  shout when it's time?" primary button "Allow Notifications" (triggers real
  `Notification.requestPermission()`).
- If a user denies at the OS level, show a small persistent banner later on Home:
  "Koa can't watch without permissions — tap to fix" linking to OS settings
  instructions (can't reopen the prompt directly once denied, this is a browser
  limitation).

### 2.4 Home
- Top: greeting bar — "Hi, {displayName} 👋" if signed in, or "Hi there 👋" if guest,
  left-aligned, muted small text above it: "Ready to nap?"
- Below greeting: **large search bar** (pill-shaped, `--color-bg-alt` fill, map-pin
  leading icon, placeholder "Where should I wake you up?") — tapping opens Set
  Destination screen.
- If guest (not signed in): a slim dismissible card below the search bar —
  "Sign in to save your stops" with a Google "G" icon button (small, secondary
  style) — not a blocking modal, easy to ignore.
- **Saved Stops row** (only if signed in AND has saved stops): horizontal scroll of
  chip-cards, each showing stop name + small pin icon, tapping quick-starts a trip to
  that destination (skips straight to the confirm sheet with saved radius).
- Bottom third: Idle Koa illustration, medium size, centered, purely decorative/
  atmosphere when no trip is active.
- Bottom nav visible.

### 2.5 Set Destination
- Back chevron top-left, header text "Where to?" centered.
- Search input pinned under header (same pill style as Home), live results appear as
  a list below it (Nominatim results: name + secondary address line, tap to select).
- Below/behind the search list: full **Leaflet map**, fills remaining screen height.
  Tapping directly on the map also drops a pin (alternative to search).
- Selected destination shows a custom koala-ear pin (per designsystem.md) with a
  small label bubble above it showing the chosen name.
- **Confirm bottom sheet** slides up from bottom once a destination is chosen (20px
  top-radius, `--color-bg` fill, drag handle bar at top):
  - Destination name (editable text field, in case user wants a custom nickname like
    "Home")
  - "Alert radius" row: label + current value ("500m") + a horizontal slider
    (100m–2000m range, step 50m) with `--color-primary` fill track
  - Toggle row "Save this stop" (only rendered if signed in) — off by default
  - Primary pill button, full width: **"Start Trip"** — `--color-primary` fill, white
    text, large tap target (min 48px height)

### 2.6 Active Trip
- Full-screen map (Leaflet), no bottom nav, no header chrome except a small floating
  "✕ Cancel Trip" ghost button top-left (safe-area aware) with a confirm-dialog before
  actually cancelling.
- Current location: simple green filled dot with a soft pulsing ring animation
  (indicates "live").
- Destination: koala-ear pin, static.
- Route/distance line (thin dashed `--color-primary-light` line) connecting the two,
  optional but nice to have.
- **Floating status card**, bottom of screen, above safe-area, rounded-16 card:
  - Small Watching-Koa illustration (left, ~48px)
  - Distance remaining + rough ETA (right, stacked text: bold distance on top,
    muted ETA below)
  - Subtle progress bar along the bottom edge of the card showing % of trip
    distance covered
- A one-line reassurance caption below the card, small muted text: "Koa's got this —
  feel free to rest your eyes." (only shown once per trip, first 10 seconds, then
  fades out — avoid nagging/clutter during the ride)
- Wake Lock is engaged the whole time (screen won't auto-sleep); if the OS still
  backgrounds the tab (user switches apps), nothing crashes — resume gracefully when
  foregrounded, and recalculate distance immediately on resume.

### 2.7 Alarm Screen (the money moment)
- **Full-screen takeover**, immediate, no transition delay. Background: `--color-alarm`
  (#FF7043) as a soft radial wash from center (not flat/harsh).
- Centered: large **Waking-up Koa illustration** (biggest mascot moment in the app,
  ~40% of screen height), arms-up pose with small motion/sparkle lines around it.
- Below illustration: headline "Wakey waky! 🚏" (white, Quicksand bold, 28px),
  subline with the actual stop name: "You're almost at {destination name}."
- Large **"I'm awake"** pill button, white fill with `--color-alarm` text (inverted
  from the usual primary-button style, for contrast against the orange background),
  full width, positioned in the lower third, generous tap target (56px height min).
- Visual "sound is playing" indicator: small animated waveform/equalizer bars near
  the top, so users understand audio is intentional even if their device is on
  silent/vibrate.
- On mount: play alarm sound (looping, primed earlier via the Start Trip tap to
  satisfy autoplay policy), fire `navigator.vibrate` in a repeating pattern, and fire
  a system notification simultaneously (in case the tab isn't focused).
- Tapping "I'm awake" stops all of the above immediately and transitions to Trip
  Complete.
- If untouched for ~20s, escalate: increase vibration intensity/pattern and re-fire
  the notification (helps if the phone is in a pocket/bag).

### 2.8 Trip Complete
- Centered **Happy Koa illustration** (waving/thumbs-up).
- Headline: "Nice, you made it! 🎉"
- Small body line: "Nap safely next time too."
- If this destination wasn't already a saved stop: an inline prompt — "Save
  {destination name} for next time?" with a small "Save" pill button + "No thanks"
  text link.
- Primary button: "Back to Home" — returns to Home screen, bottom nav reappears.

### 2.9 Saved Stops
- Header "Saved Stops," bottom nav visible.
- List of cards (not chips here, full-width rows this time), each: small map-pin
  icon, stop name (bold), radius shown as muted subtext ("Alert at 500m"), and a
  trailing "Start" pill button.
- Swipe-to-delete or a small "···" menu per row (edit name / change radius / delete) —
  either pattern is fine, pick whichever is faster to build.
- Empty state (no saved stops yet): small Idle Koa illustration + "No saved stops
  yet — start a trip and save it for next time."

### 2.10 Settings
- Header "Settings," bottom nav visible.
- **Profile section** (top): avatar (Google photo or default Koa-face placeholder),
  editable display name field inline, email (read-only, muted), "Sign out" text
  link in `--color-error`.
  - If guest: instead show "Sign in with Google" primary button here.
- **Preferences section:** default alert radius stepper, notification toggle,
  vibration toggle, sound toggle.
- **Share section:** "Share Wakey Waky" row with an icon + the Web Share
  API/clipboard-fallback button described in frontend.md.
- **About section:** app version, OSM attribution line (required, do not remove),
  small credits line for Koa mascot artwork.

### 2.11 iOS "Add to Home Screen" Banner (cross-cutting, not a standalone screen)
- Appears as a dismissible bottom banner (not a full screen) on Safari/iOS only, when
  the app is NOT already running in standalone mode.
- Small Koa peeking illustration + text: "Add Koa to your Home Screen for the best
  experience" + a 2-step visual hint (Share icon → "Add to Home Screen") since iOS
  doesn't support a native programmatic install prompt.
- Dismiss (✕) persists the dismissal in localStorage so it doesn't nag every launch —
  reappear after ~7 days if still not installed.

---

## 3. Build Order (recommended sequence for the AI builder)

1. Scaffold Vite + React project, install deps (`firebase`, `react-router-dom`,
   `leaflet`, `react-leaflet`, `vite-plugin-pwa`, `@fontsource/quicksand`,
   `@fontsource/nunito`).
2. Drop in `.env` and `src/lib/firebase.js` (already provided).
3. Set up global CSS variables/tokens from `designsystem.md` Section 3-4.
4. Build App Shell (routing + bottom nav) with placeholder empty screens.
5. Build Home + Set Destination + map integration (Leaflet + Nominatim search) —
   this is the core "can I even pick a destination" loop, get it working end-to-end
   before touching auth.
6. Build Active Trip screen + `useGeolocationWatch` + distance calculation.
7. Build Alarm screen + `useAlarmTrigger` (sound/vibration/notification firing).
8. Build Trip Complete + wire the full happy-path loop (Home → Destination → Active →
   Alarm → Complete → Home) before adding auth/persistence.
9. Add Firebase Auth (Google sign-in) + Settings screen sign-in/out.
10. Add Firestore trip saving + Saved Stops screen.
11. Add PWA manifest, service worker, install prompts (Android native +
    custom iOS banner).
12. Polish pass: mascot illustrations swapped in for real assets, animations,
    permission-priming screens, empty states, iOS Wake Lock, safe-area insets.
13. Cross-device test pass (see testing notes below) — Android Chrome install +
    background behavior, iOS Safari install + foreground-only behavior.

---

## 4. Things to Explicitly Test Before Calling It Done
- Fresh install on Android Chrome: notification + location permission prompts appear
  correctly, alarm fires with app backgrounded.
- Fresh install on iOS Safari (Add to Home Screen): alarm fires ONLY reliably while
  app is foregrounded/screen on — confirm this matches user expectations set in-app
  copy (don't overpromise).
- Denying permissions: app doesn't crash, shows the "tap to fix" banner instead.
- Signing out mid-trip: active trip should still complete normally (don't force a
  navigation away from Active Trip just because auth state changed).
- Slow/offline network: app shell still loads (cached via service worker); map tiles
  may fail gracefully (show a "no connection" state on the map area, not a blank
  crash).

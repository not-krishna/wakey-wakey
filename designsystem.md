# Wakey Waky — Design System

## 1. Brand Concept
Wakey Waky is a transit "don't miss your stop" alarm PWA. The entire personality of the
app is built around a **koala mascot** — koalas are famous for sleeping a lot, which is a
playful, on-the-nose fit for an app whose whole job is waking sleepy commuters.

**Tone:** friendly, cozy, reassuring, a little playful — never alarming or stressful, even
though the app's job is to alert people. Think "a friendly koala nudging your shoulder,"
not "a shrieking siren."

## 2. Mascot — "Koa" the Koala
- Name: **Koa**
- Role: appears throughout the app in different poses/states tied to app state.
- Style: flat/vector illustration, rounded shapes, minimal linework, soft shadows. No
  photorealism. Should scale down cleanly to a small icon (favicon / notification icon)
  and up to a large hero illustration.
- Mascot states needed (deliverables for illustrator/AI image gen):
  1. **Idle/Sleepy Koa** — eyes closed, hugging a eucalyptus leaf/pillow → shown on
     Home screen before a trip is set.
  2. **Alert/Watching Koa** — one eye open, ear perked, holding a tiny map pin → shown
     while a trip is actively being tracked.
  3. **Waking-up Koa** — eyes wide open, arms up, motion lines → shown during the
     alarm/notification moment.
  4. **Happy/Success Koa** — thumbs up or waving → shown after user confirms they're
     awake / reached their stop.
  5. **Error/Confused Koa** — scratching head → shown for permission errors, GPS
     issues, offline states.
- Mascot appears in: splash screen, onboarding, empty states, the alarm screen itself,
  push notification icon, and loading spinners (as a simple breathing/pulsing animation).

## 3. Color Palette

Green + white is the core palette. Keep it light, fresh, "eucalyptus," not corporate.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#2E7D32` | Primary buttons, active nav, brand accents |
| `--color-primary-light` | `#66BB6A` | Hover states, secondary accents, progress bars |
| `--color-primary-dark` | `#1B5E20` | Pressed states, headers on dark mode |
| `--color-accent` | `#A5D6A7` | Chips, badges, subtle highlights |
| `--color-bg` | `#FFFFFF` | App background |
| `--color-bg-alt` | `#F4FAF4` | Cards, sheets, secondary surfaces |
| `--color-text` | `#1B1B1B` | Primary text |
| `--color-text-muted` | `#6B7A6B` | Secondary text, captions |
| `--color-border` | `#DCEBDC` | Dividers, input borders |
| `--color-alarm` | `#FF7043` | Alarm-triggered state ONLY (warm orange, used sparingly, never as a default brand color) |
| `--color-error` | `#D32F2F` | Error states, destructive actions |

Dark mode (optional, phase 2): invert to `#0E140E` background, keep the same greens
shifted lighter for contrast (`#81C784` primary).

## 4. Typography
- Font: **Quicksand** or **Nunito** (rounded, friendly, good free Google Fonts match for
  a koala/soft mascot vibe). Fallback: `system-ui, sans-serif`.
- Scale:
  - Display (mascot screens / alarm title): 32px / bold
  - H1 (screen titles): 24px / bold
  - H2 (section headers): 18px / semibold
  - Body: 16px / regular
  - Caption / muted: 13px / regular
- Line height: 1.4 for body, 1.2 for headings.

## 5. Voice & Copy Guidelines
All UI copy, notifications, and alerts should sound like Koa is talking to the user —
warm, brief, never robotic or scary.

| Situation | Example copy |
|---|---|
| Onboarding | "Hi, I'm Koa 🐨 I'll make sure you never sleep past your stop." |
| Setting a destination | "Where should I wake you up?" |
| Trip started | "Snooze away — I've got my eye on the map." |
| Approaching stop (pre-alarm, e.g. 5 min out) | "Almost there — starting to stir..." |
| Alarm triggered | "Wakey waky! Your stop is coming up 🚏" |
| Permission requests | "I need your location to keep watch — just while the trip is active." |
| Notification permission | "Let me shout when it's time to wake up?" |
| GPS/offline error | "Hmm, I lost track of you. Mind checking your GPS?" |
| Trip completed | "Nice, you made it! 🎉 Nap safely next time too." |

Avoid: exclamation-heavy urgency, ALL CAPS, siren/emergency language, guilt-tripping
copy ("You almost missed it!!").

## 6. Iconography
- Rounded, 2px stroke line icons (e.g. Phosphor Icons "rounded" set or Lucide) to match
  the soft mascot style — NOT sharp/geometric icon sets.
- Custom icons needed: sleeping-koala app icon, alarm-bell-with-leaf, map-pin-with-ear
  (Koa's ear as the pin tip, playful touch), radius-circle icon for alert-distance setting.

## 7. Core Components (style rules, not full specs — detail in frontend.md)
- **Buttons:** fully rounded (pill-shaped), primary = solid green, secondary = outlined
  green, disabled = light grey with muted text.
- **Cards:** 16px corner radius, soft shadow (`0 2px 8px rgba(0,0,0,0.06)`), bg-alt fill.
- **Bottom sheet / modals:** rounded top corners (20px), used for destination search and
  alert-radius picker.
- **Map pins:** custom koala-ear-shaped pin for destination; simple green dot for current
  location (no browser default red pin).
- **Alarm screen:** full-screen takeover, `--color-alarm` background wash, large
  Waking-up Koa illustration, big "I'm awake" pill button, sound waveform animation.
- **Notifications:** small Koa head as the notification icon/badge; title always starts
  with "Koa:" e.g. "Koa: Wakey waky! Your stop is coming up."

## 8. Motion
- Keep animations soft and bouncy (ease-out, slight overshoot) — never sharp or jarring,
  matching the calm brand — EXCEPT the alarm-trigger moment, which can have a stronger
  pulse/shake to actually get the user's attention.
- Idle Koa "breathes" (subtle scale 1 → 1.02 loop) on loading/empty states.

## 9. Accessibility Notes
- Maintain WCAG AA contrast for text on green backgrounds (test `--color-primary` text
  on white, and white text on `--color-primary`).
- Alarm must never rely on color alone — always pair with sound + vibration + text.
- Support Dynamic Type / OS font scaling; don't lock font sizes in px only, use rem.

## 10. Assets To Produce (checklist for AI builder / designer)
- [ ] App icon (512x512, 192x192, favicon) — sleeping Koa face, white bg, rounded square
- [ ] Splash screen illustration (Idle Koa, centered, green bg)
- [ ] 5 mascot state illustrations (see Section 2), SVG or PNG w/ transparent bg
- [ ] Notification badge icon (monochrome, simplified Koa silhouette per platform spec)
- [ ] Custom map pin SVGs (destination pin, current-location dot)
- [ ] Icon set (rounded style, ~15-20 icons for nav/actions)

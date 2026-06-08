# Bluey Quest

A mobile-first Progressive Web App that encourages healthy habits through gamification and positive reinforcement. Earn **Dollarbucks**, build your **Keepy Uppy** streak, and log food with zero shame — no weight focus, no punishment.

Inspired by cozy, playful energy.

**PRIVATE JAYDAN EDITION**  
Bluey assets permitted.  
Must be removed before any public release.

## Current Project Status (June 2026)

### Working Features

#### Authentication

- ✅ Supabase Authentication
- ✅ Account Creation
- ✅ Email Verification
- ✅ Login
- ✅ Session Persistence
- ✅ Protected Routes

#### Core Habit Tracking

- ✅ Daily Action Buttons
- ✅ Dollarbucks Rewards
- ✅ Daily Reset Logic
- ✅ Flare Day Mode
- ✅ Transaction Recording
- ✅ Transaction History

#### Food Tracking

- ✅ Food Logging
- ✅ Timestamp Recording
- ✅ Food History
- ✅ CSV Export

#### Personalization

- ✅ Bluey Theme
- ✅ Bingo Theme
- ✅ Muffin Theme
- ✅ Theme Persistence
- ✅ Profile Settings

#### Character System

- ✅ Bluey Interactions
- ✅ Bingo Interactions
- ✅ Muffin Interactions
- ✅ Character Quotes
- ✅ Character Animations
- ✅ Character Sound Support

#### Bug Inspector System

- ✅ Bug Inspector Muffin
- ✅ Bug Reporting
- ✅ Senior Bug Inspector Achievement
- ✅ Achievement Reward System

#### Easter Eggs

- ✅ Sneak Peek System
- ✅ Muffin Mode
- ✅ Flamingo Queen Event

#### Deployment

- ✅ GitHub Repository
- ✅ Vercel Deployment
- ✅ Supabase Database
- ✅ Environment Variables Configured

#### PWA

- ✅ Dollarbuck App Icon Assets
- ✅ Manifest Configuration
- ✅ Install Prompt
- ✅ Splash Screen Assets

### Testing Still Needed

#### Authentication

- ☐ Verify production login flow
- ☐ Verify production signup flow
- ☐ Verify password recovery flow

#### Daily Systems

- ☐ Midnight streak rollover testing
- ☐ Consecutive day streak testing
- ☐ Multi-day Flare Day testing

#### Mobile Testing

- ☐ Android Chrome
- ☐ Samsung Internet
- ☐ iPhone Safari
- ☐ Tablet Layout

#### PWA Testing

- ☐ Install to Home Screen
- ☐ Splash Screen Display
- ☐ Dollarbuck Icon Display
- ☐ Offline Behavior
- ☐ Push Notification Support (future)

#### Character Testing

- ☐ Verify all PNG assets display correctly
- ☐ Verify Muffin interactions
- ☐ Verify Flamingo Queen trigger
- ☐ Verify Bug Inspector flow

### Immediate Next Tasks

1. Verify production deployment is stable.
2. Complete PWA install testing.
3. Verify Dollarbuck icon appears correctly on devices.
4. Verify splash screen behavior.
5. Commit and push latest README updates.
6. Create final Jaydan account.
7. Install Bluey Quest on Jaydan's phone.
8. Begin real-world testing.

### Current Release Goal

**Target Release:**  
Private Jaydan Edition v0.1

**Success Criteria:**

- Authentication works.
- Daily actions work.
- Food logging works.
- CSV export works.
- Character interactions work.
- Bug Inspector works.
- Muffin Mode works.
- Flamingo Queen works.
- PWA installs correctly.
- Jaydan can use the application independently.

### Long-Term Vision

Bluey Quest began as a private habit and symptom management tool designed specifically for someone living with chronic illness, fatigue, pain flares, and executive dysfunction.

The long-term goal is to evolve the underlying system into a broader health-focused application that helps users build habits, track symptoms, reduce number fatigue, and celebrate progress through encouragement rather than punishment.

The Jaydan Edition serves as the prototype and testing ground for future versions.

---

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (Auth + Postgres + RLS)
- Serwist (PWA / service worker)
- Vercel-ready deployment

## Branding

App name everywhere: **Bluey Quest** (exact capitalization).

Used in app title, splash screen, manifest, metadata, browser tab, and install prompt. Title font: Nunito (rounded, playful).

## Character Asset Registry

Central registry: `src/lib/characters/index.ts` → `CHARACTER_ASSETS`  
File guide: [public/characters/ASSETS.md](./public/characters/ASSETS.md)

| Character | Assets |
|-----------|--------|
| Bluey | `bluey-default`, `bluey-heart`, `bluey-shock` |
| Bingo | `bingo-default`, `bingo-happy`, `bingo-balloon` |
| Muffin | `muffin-default`, `muffin-buginspector`, `flamingo-queen`, `muffin-flamingo-ride` |
| Hero | `bluey-bingo-hero` (splash) |

**Global image rules:** transparency, `object-contain`, no circles/frames/borders.

**Asset pipeline (v0.2.1):** `npm run assets` copies source files directly — no black-keying. Preserves pupils, outlines, and shadows.

## Companion Encouragement Card

The dashboard encouragement card is a character check-in — not a trading card.

- Random Bluey / Bingo / Muffin on load with character-specific quotes
- Tap character for a new quote from that companion
- Character overlaps top-left of gradient card (110–140px)
- Special states: Bingo Happy (task done), Bluey Heart (flare/milestone), Flamingo Queen (Muffin Mode)

## Dollarbuck App Icon

Official icon: `public/icons/blueydollarbuck.png` (transparent background).

```bash
npm run icons    # regenerate 48–512px sizes + src/app/icon.png
npm run assets   # refresh character PNGs from assets folder
```

## Features (Jaydan Edition — v0.1 + v0.2 in progress)

- Email/password auth with persistent sessions
- Dashboard: balance, streak, multiplier, daily actions
- Food logging (name + timestamp only)
- Transaction history with multiplier details
- Food history with CSV export
- Keepy Uppy streak & bonus tiers
- Character themes (Bluey / Bingo / Muffin) with persistence
- Companion encouragement card with tap-for-quote interactions
- Character sounds toggle (Settings)
- **Bug Inspector Muffin** — `muffin-buginspector.png` only
- Sneak Peek → **Flamingo Queen** easter egg (`muffin-flamingo-ride.png`)
- Dollarbuck PWA icon (transparent), polished splash screen, installable PWA

## Getting Started

### 1. Clone and install

```bash
cd bluey-quest
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run both migration files (in order):
   - `supabase/migrations/20250529000000_initial_schema.sql`
   - `supabase/migrations/20250608000000_profile_settings.sql`
   - `supabase/migrations/20250608100000_jaydan_edition.sql`
   - `supabase/migrations/20250608200000_character_themes.sql`
3. Under **Authentication → Providers**, enable Email.
4. Copy your project URL and anon key from **Settings → API**.

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up with email/password, then complete daily actions on the dashboard.

### 5. PWA install

- **Production build required** for the service worker (`npm run build && npm start`).
- On mobile: use browser “Add to Home Screen”.
- Dollarbuck icons live in `public/icons/` (source: `blueydollarbuck.png`). Regenerate with `npm run icons`.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Set **Authentication → URL Configuration** in Supabase:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## Project Structure

```
src/
  app/              # Routes, server actions
  components/       # UI (dashboard, food, layout, auth)
  lib/
    game/           # Streak & reward services
    features/       # Placeholders for future systems
    supabase/       # Client, server, middleware helpers
    streak.ts       # Multiplier & streak math
supabase/migrations # Database schema + RLS
public/             # Manifest, icons, service worker output
```

## Keepy Uppy Bonus Tiers

| Streak days | Multiplier |
|-------------|------------|
| 0–6         | 1.0x       |
| 7–13        | 1.1x       |
| 14–29       | 1.25x      |
| 30–59       | 1.5x       |
| 60–99       | 1.75x      |
| 100+        | 2.0x       |

Any daily action **or** food log counts toward the streak for that day.

## Version Roadmap

| Version | Scope |
|---------|-------|
| **v0.1** | Core Functionality |
| **v0.15** | Notifications |
| **v0.2** | PWA Completion + Flare Mode Expansion + Rewards Store |
| **v0.2.1** | Asset pipeline fix, theme save diagnostics, splash redesign *(current)* |
| **v0.3** | AI Analysis |
| **v0.5** | Public Product Split |

---

## Future Expansion (Not Implemented)

Placeholder stubs live under `src/lib/features/`. Items below are planned only — not built yet.

### v0.1 — Core Functionality *(shipped)*

- Email/password auth, dashboard, daily actions, food log, streaks, Dollarbucks
- Character themes, interactions, sounds toggle
- Bug fixes: Sneak Peek modal, Flare Mode once-per-day, theme save persistence

#### Bug Inspector System *(shipped)*

Official character: `public/characters/muffin-buginspector.png` (not generic bug icons)

- Playful bug report FAB and modal: **🐶 Bug Inspector Muffin**
- Random subtext: *"Tell me what's broken!"* / *"Muffin is investigating..."* / *"This is UNACCEPTABLE!"*
- Random success quotes: *"I SHALL INVESTIGATE."*, *"THIS IS UNACCEPTABLE."*, etc.
- **Senior Bug Inspector** easter egg: 10 lifetime reports → +25 Dollarbucks (one-time)
- Admin bugs page uses Muffin 3 branding

**Character roles:** Bluey (guide/adventure), Bingo (comfort/rest), Muffin (chaos/easter eggs/bug inspector)

**Assets:** See [public/characters/ASSETS.md](./public/characters/ASSETS.md)

### v0.15 — Notifications

See [Character Reminder System](#future-feature-character-reminder-system-planned-for-v015) below.

### v0.2 — In Progress

#### PWA Completion

**Status:** In Progress

##### App Icon

Official asset: `public/icons/blueydollarbuck.png`

This is the official Bluey Dollarbuck and is used as the application icon.

Generated sizes (via `node scripts/generate-icons.mjs`):

- 48×48, 72×72, 96×96, 144×144, 192×192, 512×512

Used for:

- Home Screen Icon
- Android Install Icon
- PWA Manifest (`public/manifest.webmanifest`)
- Browser Tab Icon (`src/app/icon.png`)

**Goal:** When Jaydan installs Bluey Quest on her phone, the icon appears as a Dollarbuck rather than a generic web shortcut.

##### Splash Screen

**Status:** Implemented

Displays on app launch:

> **Bluey Quest**  
> Healthy habits.  
> Cozy rewards.  
> One day at a time.

Featuring Bluey and Bingo artwork. Shown on PWA cold start and first browser visit per session.

**Implementation:** `src/components/pwa/SplashScreen.tsx`

##### Flamingo Queen Secret Event

**Status:** Partially implemented (Muffin Mode easter egg); additional obscure triggers planned

Asset: `public/characters/muffinFlamingoQueen.png`

A hidden Muffin easter egg discovered through curiosity. Currently activated via **Sneak Peek** (5 clicks) → Muffin Mode.

**Activation (current):** Sneak Peek button on dashboard, 5 cumulative clicks.

**Activation (planned):**

- Multiple Muffin taps
- Repeated Muffin Mode activations
- Secret interaction sequence
- Rare random chance
- Special dates

**Reward display:**

> **FLAMINGO QUEEN HAS ARRIVED**

Shows Flamingo Queen Muffin prominently with quote: *"I AM THE FLAMINGO QUEEN."*

**Rewards (current):**

- +50 Dollarbucks
- Transaction: `Muffin Mode: Flamingo Queen Bonus`

**Rewards (planned):**

- Unique Badge
- Exclusive quote variants
- Additional obscure trigger paths

**Design goal:** A surprise moment that rewards curiosity and makes the app feel personal and handcrafted.

##### Current Release Goal (Jaydan Edition)

Before Jaydan returns:

- [x] Dollarbuck home screen icon
- [x] PWA manifest with full icon set
- [x] Splash screen
- [x] Character images integrated (PNG-first, larger home display)
- [x] Bug Inspector Muffin (`muffin-buginspector.png`)
- [x] Flamingo Queen celebration modal + companion card states
- [x] Character asset registry + encouragement card redesign
- [x] Flamingo Queen documented
- [ ] Vercel deployment stable
- [ ] Core testing completed

**Target:** Stable Jaydan Edition Release

### v0.2.1 — Final Polish & Bugfix *(current)*

#### Asset Pipeline Fix

**Root cause:** `stripBlackBackground()` in `copy-character-assets.mjs` removed all dark pixels (RGB &lt; 40), destroying pupils, outlines, and facial detail.

**Fix:** Direct byte-for-byte copy from source files. Lossless WebP only for `muffin-default.webp`. All character assets rebuilt.

#### Theme Save Bug

**Likely causes:** Missing migration `20250608200000_character_themes.sql` (theme constraint or `character_sounds_enabled` column).

**Fix:** Development-mode error messages show exact Supabase failure. Fallback retry without `character_sounds_enabled` if column missing. Profile row existence verified after update.

**Action required:** Run migration in Supabase SQL Editor if theme save still fails in production.

#### Splash Screen Redesign

Hierarchy: Dollarbuck → **Bluey Quest** → `bluey-bingo-hero.png` (piggyback) → tagline.

#### Image Quality

- `CharacterImage` defaults to `object-contain`
- No CSS filters on character art
- Encouragement card mascot overlap preserved

#### Flare Mode Expansion + Rewards Store (planned)

- Flare Shields
- Custom Rewards Store
- Achievements
- Weekly Quests

### v0.3 — AI Analysis

- AI Trend Analysis
- Mood Tracking
- Symptom Tracking

### v0.5 — Public Product Split

- Remove private Jaydan Edition assets
- Public-safe branding and art
- Distribution-ready build

---

## Future Feature: Character Reminder System (Planned for v0.15)

### Purpose

Many users with chronic illness, chronic fatigue, ADHD, executive dysfunction, and brain fog benefit from gentle reminders.

Bluey Quest reminders should never feel like alarms, nagging, guilt, or task management.

The goal is:

> "Friendly check-ins from companions."

Not:

> "You forgot your responsibilities."

### Design Philosophy

Reminders should:

- Encourage
- Support
- Reduce stress
- Feel playful
- Be easy to disable

Reminders should NEVER:

- Shame
- Guilt trip
- Mention weight
- Mention calories
- Pressure users

### Technical Architecture

**Platform:**

- Progressive Web App (PWA)
- Browser Push Notifications
- Service Worker based

**Future support:**

- Android
- iPhone (PWA support permitting)
- Desktop browsers

No SMS. No email reminders.

Notifications should open Bluey Quest when tapped.

### Notification Permission Flow

After initial onboarding:

> "Would you like Bluey, Bingo, and Muffin to help remind you about your adventures?"

**Options:**

- Allow Notifications
- Maybe Later
- No Thanks

Store preference. Never repeatedly ask.

### Reminder Characters

#### Bluey

Adventure focused.

Examples:

- "Ready for today's adventure?"
- "Have you completed any quests today?"
- "Every adventure starts with one step."

#### Bingo

Gentle support.

Examples:

- "Little things count too."
- "Even a small snack counts."
- "You've got this."
- "Resting counts too."

#### Muffin

Chaotic encouragement.

Examples:

- "I REQUIRE DOLLARBUCKS."
- "I WAS BEING SPECIAL."
- "THIS APP NEEDS MORE CHAOS."
- "GO DO A QUEST."

### Reminder Frequency Settings

**Options:**

- Off
- Morning Only
- Morning + Evening
- Every 6 Hours
- Every 3 Hours

**Default:** Morning + Evening

Avoid excessive reminders.

### Smart Reminder Logic

**Do NOT send reminders if:**

- User has already completed multiple actions today
- User recently opened the app
- User recently logged food

**Do send reminders when:**

- No actions completed today
- No food logged today
- User has not opened app recently

### Character Preference

Users may select:

- Bluey Only
- Bingo Only
- Muffin Only
- Random

**Default:** Random

### Future Expansion

Potential future reminders:

- Streak protection warnings
- Flare Mode encouragement
- Reward redemption reminders
- Achievement notifications
- Weekly adventure summaries

All future reminder systems must follow Bluey Quest philosophy:

- **Supportive** > Productive
- **Companion** > Manager
- **Encouragement** > Obligation

## License

Private / personal use — adjust as needed for your deployment.

## Documentation

- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — philosophy, architecture, and onboarding
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) — step-by-step v0.1 QA checklist
- [TEST_REPORT.md](./TEST_REPORT.md) — Jaydan Edition bug-fix verification report
- [public/characters/ASSETS.md](./public/characters/ASSETS.md) — character image placement guide

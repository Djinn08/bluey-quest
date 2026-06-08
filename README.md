# Bluey Quest

A mobile-first Progressive Web App that encourages healthy habits through gamification and positive reinforcement. Earn **Dollarbucks**, build your **Keepy Uppy** streak, and log food with zero shame — no weight focus, no punishment.

Inspired by cozy, playful energy.

**PRIVATE JAYDAN EDITION**  
Bluey assets permitted.  
Must be removed before any public release.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (Auth + Postgres + RLS)
- Serwist (PWA / service worker)
- Vercel-ready deployment

## Features (V1)

- Email/password auth with persistent sessions
- Dashboard: balance, streak, multiplier, daily actions
- Food logging (name + timestamp only)
- Transaction history with multiplier details
- Food history with CSV export
- Keepy Uppy streak & bonus tiers
- Installable PWA with offline-friendly caching

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
- Icons live in `public/icons/`.

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
| **v0.2** | Flare Mode Expansion + Rewards Store |
| **v0.3** | AI Analysis |
| **v0.5** | Public Product Split |

---

## Future Expansion (Not Implemented)

Placeholder stubs live under `src/lib/features/`. Items below are planned only — not built yet.

### v0.1 — Core Functionality (current)

- Email/password auth, dashboard, daily actions, food log, streaks, Dollarbucks, PWA

### v0.15 — Notifications

See [Character Reminder System](#future-feature-character-reminder-system-planned-for-v015) below.

### v0.2 — Flare Mode Expansion + Rewards Store

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

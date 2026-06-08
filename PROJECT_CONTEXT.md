# Project Name

**Bluey Quest**

Version: **Jaydan Edition** (private build — v0.2 feature set)

---

# Project Purpose

Bluey Quest is a habit-building and wellness companion originally created for a user with chronic illness, chronic pain, fatigue, executive dysfunction, and number fatigue.

The goal is **NOT** weight loss.

The goal is **NOT** calorie counting.

The goal is to make self-care feel **rewarding** instead of **exhausting**.

The app uses positive reinforcement, gamification, and accessibility-focused design.

---

# Core Philosophy

* Reward effort, not outcomes.
* Never punish users.
* Never shame users.
* Consistency is more important than perfection.
* Some days surviving is the achievement.
* Chronic illness users may have dramatically different energy levels from day to day.
* The app should reduce cognitive load.
* The app should avoid overwhelming users with numbers.

---

# Origin Story

The app was originally created for **Jaydan**.

Jaydan struggles with:

* hEDS
* POTS
* Fibromyalgia
* Chronic pain
* Fatigue
* Executive dysfunction
* Health tracking burnout

Most health apps increased stress.

Bluey Quest was designed to make health tracking feel like a game instead.

---

# Core Loop

1. User completes action.
2. Action earns **Dollarbucks**.
3. Dollarbucks contribute to progress.
4. **Keepy Uppy** streak increases.
5. User feels rewarded.
6. Repeat.

---

# Current Systems

## Authentication

**Status:** Implemented (v0.1)

* Email/password signup and signin via **Supabase Auth**.
* Sessions persist via HTTP cookies (`@supabase/ssr`).
* Middleware (`src/middleware.ts`) refreshes sessions and redirects unauthenticated users to `/login`.
* Auth server actions live in `src/app/actions/auth.ts`.
* On signup, a database trigger (`handle_new_user`) auto-creates a `profiles` row and a `streaks` row.

**Flow:**

1. User submits login form → server action calls `signInWithPassword` or `signUp`.
2. Supabase sets session cookies.
3. User is redirected to dashboard (`/`).
4. Sign out clears session and redirects to `/login`.

Errors are user-friendly (no raw crashes). Connection failures show: *"Could not connect to Bluey Quest. Please check your connection and try again."*

---

## Dollarbucks

**Status:** Implemented (v0.1)

Dollarbucks are the primary reward currency stored on `profiles.dollarbucks_balance`.

**How rewards are earned:**

Daily actions grant base rewards (see Daily Actions). The **Keepy Uppy multiplier** is applied at earn time.

| Action        | Base reward |
|---------------|-------------|
| Breakfast     | 5           |
| Lunch         | 5           |
| Dinner        | 5           |
| Snack         | 2           |
| Water Goal    | 10          |
| Walk          | 10          |
| PT / Exercise | 25          |

**Implementation:**

* `src/lib/constants.ts` — reward values and labels
* `src/lib/game/reward-service.ts` — updates balance and writes transaction
* `src/app/actions/game.ts` — `completeDailyAction` orchestrates the flow
* UI shows floating `+N Dollarbucks` animation on earn (`FloatingReward`)

Food logging does **not** earn Dollarbucks but **does** count toward streak activity.

---

## Keepy Uppy

**Status:** Implemented (v0.1)

Keepy Uppy is the streak system stored in `streaks`.

**Fields:**

* `current_streak_days` — consecutive days with at least one qualifying activity
* `last_activity_date` — last calendar date the user was active

**Qualifying activity (any one counts per day):**

* Any daily action completion
* Any food log entry

**Multiplier tiers (Keepy Uppy Bonus):**

| Streak days | Multiplier |
|-------------|------------|
| 0–6         | 1.0x       |
| 7–13        | 1.1x       |
| 14–29       | 1.25x      |
| 30–59       | 1.5x       |
| 60–99       | 1.75x      |
| 100+        | 2.0x       |

**Streak rules:**

* First activity of a new day extends streak by 1 if yesterday was active.
* Missing one or more full days resets streak to 1 on next activity (not 0 mid-day).
* If user was inactive for 2+ days, dashboard load sets streak display to 0 and shows a gentle reset message — never shaming.

**Implementation:**

* `src/lib/streak.ts` — multiplier math and date logic
* `src/lib/game/streak-service.ts` — `recordActivity`, `ensureStreakCurrent`

---

## Daily Actions

**Status:** Implemented (v0.1)

Seven large touch-friendly buttons on the dashboard. Each can be completed **once per calendar day**.

**Actions:** Breakfast, Lunch, Dinner, Snack, Water Goal, Walk, PT / Exercise

**Completed state (v0.1 polish):**

* Green button with checkmark
* Subtle completion animation
* Disabled — cannot earn twice same day
* Enforced by DB unique constraint `(user_id, action_type, action_date)`

**Implementation:**

* `src/components/dashboard/ActionGrid.tsx` — client UI
* `src/app/actions/game.ts` — `completeDailyAction`
* `daily_actions` table

---

## Food Logging

**Status:** Implemented (v0.1)

Simple modal on dashboard: **Log Food**.

**Stored fields only:**

* Food name
* Timestamp (`logged_at`)
* User ID
* Date (`entry_date`)

**Examples:** Apple, Chicken Sandwich, Pizza

**Not stored:** calories, macros, portions, serving sizes, nutrition labels.

Food logging counts toward Keepy Uppy but does not grant Dollarbucks.

**Implementation:**

* `src/components/dashboard/LogFoodSection.tsx`
* `src/app/actions/game.ts` — `logFood`
* `food_entries` table

---

## Food History

**Status:** Implemented (v0.1)

Route: `/food-history`

Chronological list grouped by day. Shows **Today**, **Yesterday**, or full date headers. Each entry shows time + food name.

**Implementation:** `src/components/food/FoodHistoryList.tsx`

---

## Transaction History

**Status:** Implemented (v0.1)

Route: `/transactions` (bottom nav: **History**)

Shows Dollarbucks earnings newest first. Each row includes:

* Date and time
* Action name
* Reward earned
* Multiplier applied (when not 1.0x)
* Base reward breakdown

**Implementation:** `src/components/transactions/TransactionList.tsx`, `transactions` table

---

## CSV Export → Export & Analyze

**Status:** Replaced in Jaydan Edition

Route: **Settings → Export & Analyze**

Generates two downloads:

1. **Analysis Package** — structured JSON (`version: "1.0"`) with profile, streak, flare days, food entries, daily actions, transactions, store redemptions, and `aiAnalysisReady: true` for future AI endpoints.
2. **CSV Download** — chronological merged export (same spirit as v0.1 CSV).

**Implementation:**

* `src/lib/export/analysis-package.ts` — `buildAnalysisPackage`, `packageToCsv`
* `src/app/actions/export.ts` — server actions for JSON and CSV download

Architecture is modular: a future `sendToAiAnalysis(package)` function can consume `AnalysisPackage` without changing gather logic.

---

## User Profiles

**Status:** Implemented (v0.1)

`profiles` table extends `auth.users`:

* `dollarbucks_balance`
* `display_name` (optional)
* `theme_preference` (`cozy` | `bright` | `calm`)
* `created_at`, `updated_at`

Auto-created on signup via trigger.

Display name appears in app header greeting when set.

---

## Settings

**Status:** Implemented (v0.1)

Route: `/settings`

**Fields:**

* Display Name
* Theme Preference (Cozy / Bright / Calm)

**Also includes:**

* Export & Analyze (JSON + CSV)
* Sign out

**Implementation:** `src/components/settings/SettingsForm.tsx`, `src/app/actions/settings.ts`

Theme applied via `data-theme` attribute on `<html>` (`ThemeProvider`).

---

## Daily Reset Logic

**Status:** Implemented (v0.1)

There is **no midnight cron job**. Daily reset is **implicit** via calendar date comparison.

**"Today" is determined by:**

```ts
getTodayDateString() // src/lib/streak.ts
// Returns YYYY-MM-DD using Intl en-CA format
// Uses server/runtime local timezone (not user timezone yet)
```

**Daily actions reset when:**

* `action_date !== today` → previous completions are not queried → buttons appear available again.

**Streak reset when:**

* `last_activity_date` is more than 1 day before today → streak shown as 0 on dashboard load until user acts again.

**Important:** App passes explicit `action_date` / `entry_date` on insert. Do not rely on Postgres `current_date` defaults alone — they may differ if DB timezone ≠ app timezone.

---

## Jaydan Edition Features

The private Jaydan Edition optimizes for **delight, encouragement, personality, and ease of use** — not monetization or generic users. All messaging follows Bluey Quest philosophy: positive, no guilt, no shame, no calorie/weight obsession.

### Bug Report System

**Status:** Implemented (Jaydan Edition)

* Floating 🐛 FAB fixed bottom-right on all authenticated pages (`BugReportFab`)
* Modal: category (Bug / Suggestion / Complaint / Feature Request), message, optional screenshot upload
* Stored in `bug_reports` table; screenshots in Supabase Storage bucket `bug-screenshots`
* Admin view: `/admin/bugs` — date, category, user, message, newest first

**Implementation:** `src/app/actions/bugs.ts`, `src/components/bugs/BugReportFab.tsx`

### Character System

**Status:** Implemented (Jaydan Edition)

Original placeholder character art in `public/characters/` (SVG — not copyrighted assets):

* muffin, bluey, bingo, buginspector

Central definitions and message pools in `src/lib/characters/index.ts`:

* Popup messages (random)
* Daily encouragement messages (date-hash rotation)
* Flare mode encouragement messages

### Random Character Popups

**Status:** Implemented (Jaydan Edition)

On dashboard load: **10% chance**, **once per day** via `localStorage`. Smooth fade modal with character image, name, message. Buttons: **Continue Adventure** / **Dismiss**.

**Implementation:** `src/components/dashboard/CharacterPopup.tsx`

### Character Encouragement Card

**Status:** Implemented (Jaydan Edition)

Replaces generic encouragement on dashboard. Shows character image, name, and a message that rotates daily (randomized from pool, stable per calendar day).

**Implementation:** `src/components/dashboard/CharacterEncouragementCard.tsx`

### Muffin Chaos Events

**Status:** Implemented (Jaydan Edition)

**5% chance** after completing a daily action. Bonus popup with animated reward (+3, +5, or +10 Dollarbucks). Recorded in transaction history.

Examples: *"Muffin approved this decision."*, *"Muffin found spare Dollarbucks."*

**Implementation:** `src/lib/game/chaos-events.ts`, integrated in `src/app/actions/game.ts` and `ActionGrid.tsx`

### Better Action Feedback

**Status:** Implemented (Jaydan Edition)

Completed actions show green **✓ Completed Today** button, success animation, and floating **+N Dollarbucks** text.

**Implementation:** `src/components/dashboard/ActionGrid.tsx`

### Flare Mode

**Status:** Implemented (Jaydan Edition)

**⚡ Flare Day** button on dashboard. When activated:

* Message: *"Today's goal is survival, not perfection."*
* Protects Keepy Uppy streak for that day
* Records row in `flare_days` table
* Shows special encouragement (e.g. *"You still showed up."*, *"Rest is productive."*)

**Implementation:** `src/lib/game/flare-service.ts`, `src/app/actions/flare.ts`, `FlareModeButton.tsx`, streak protection in `streak-service.ts`

### Dollarbucks Store

**Status:** Implemented (Jaydan Edition)

Route: `/store` (bottom nav)

Default items: Movie Night (500), Takeout Night (1500), Plushie Fund (2500), New Game Fund (10000). Redeem subtracts balance, writes transaction + `store_redemptions` row.

**Implementation:** `src/lib/store/items.ts`, `src/app/actions/store.ts`, `StoreGrid.tsx`

### Export & Analyze

See **Export & Analyze** section above.

### Admin Dashboard

**Status:** Implemented (Jaydan Edition) — no auth required (private build)

* `/admin` — cards: Dollarbucks, streak, food entries, bug reports, recent transactions, flare day count
* `/admin/bugs` — bug report list

Uses `SUPABASE_SERVICE_ROLE_KEY` via `src/lib/supabase/admin.ts`. Middleware excludes `/admin` from auth redirect.

### Easter Egg — Muffin Mode

**Status:** Implemented (Jaydan Edition)

**Sneak Peek** button: 5 clicks → 🐶 **MUFFIN MODE ACTIVATED**, confetti, +50 bonus Dollarbucks, message *"I AM THE FLAMINGO QUEEN."*

**Implementation:** `SneakPeekButton.tsx`, `ConfettiBurst.tsx`, `src/app/actions/easter-egg.ts`

---

* `public/manifest.webmanifest`
* Serwist service worker (`src/app/sw.ts` → `public/sw.js` on build)
* Install prompt component on dashboard (production)
* Icons: `public/icons/icon-192.png`, `icon-512.png`

### PWA

# Dollarbucks

Dollarbucks are the primary reward currency.

**Purpose:**

* Reward participation.
* Not performance.
* Not weight loss.
* Not appearance.
* Not calorie restriction.

Dollarbucks currently accumulate on the profile balance and can be **spent in the Store** (Jaydan Edition).

---

# Keepy Uppy

Keepy Uppy is the streak system.

**Purpose:**

* Encourage consistency.
* Not perfection.

**Already in v0.1:**

* Streak day counter
* Keepy Uppy Bonus multipliers on rewards

**Jaydan Edition additions:**

* Streak protection on **Flare Days** (`flare_days` table)
* Flare mode button and gentle survival messaging

When a streak breaks, the app shows: *"Tomorrow is a great day to start another Keepy Uppy streak!"* — never punitive language.

---

# Food Logging Philosophy

Food logging exists for **pattern recognition**.

Not calorie counting.

Food entries should remain simple.

**Examples:**

* Apple
* Chicken Sandwich
* Pizza

The system intentionally avoids:

* calories
* macros
* serving sizes
* nutrition labels

If a future feature adds nutritional data, it must be optional, hidden by default, and never tied to rewards or shaming.

---

# Flare Mode

**Status:** Implemented (Jaydan Edition)

**Purpose:** Protect users during chronic illness flares without shame.

**Behavior:**

* One activation per calendar day
* Streak protected even if no other activity
* Reduced-expectation messaging — survival over perfection
* Recorded in `flare_days` for export and admin visibility

**Design goal:** Users should not feel punished for being sick.

# Future Roadmap

## v0.1

* Core functionality
* Food logging
* Dollarbucks
* Keepy Uppy (with multipliers)
* CSV export
* Settings (display name, theme)
* PWA install support
* UI polish (completed states, animations)

## Jaydan Edition (current private build)

* Bug report system + admin
* Character system (popups, encouragement)
* Muffin chaos events
* Flare Mode + streak protection
* Dollarbucks Store
* Export & Analyze (JSON + CSV, AI-ready)
* Admin dashboard
* Muffin Mode easter egg
* Enhanced action feedback

## Future (public / v0.3+)

* Food pattern analysis
* Trend tracking
* Better reporting
* Optional mood/symptom tracking (only if low-stress UX)

---

# Public Version Notes

Current version contains **Bluey-inspired concepts** (playful tone, original emoji/styling — no copyrighted assets).

Future public release **must remove copyrighted references**.

**Possible replacements:**

| Current       | Public alternative   |
|---------------|----------------------|
| Dollarbucks   | Adventure Points     |
| Keepy Uppy    | Momentum             |
| Bluey Quest   | TBD                  |
| Muffin Preview| TBD playful mascot   |

Maintain philosophy while removing copyrighted terms.

Visual direction should stay: soft blues, warm oranges, rounded cards, friendly language, cozy feel.

---

# Technical Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 15 (App Router)             |
| Language     | TypeScript                          |
| Styling      | Tailwind CSS v4                     |
| Database     | Supabase (PostgreSQL)               |
| Auth         | Supabase Auth                       |
| Hosting      | Vercel (target)                     |
| PWA          | Serwist (`@serwist/next`)           |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Required for /admin pages only
```

Copy from `.env.local.example`. Never commit `.env.local`.

## Architecture Overview

```
Browser (PWA)
    ↓
Next.js App Router
    ├── Server Components (pages fetch data)
    ├── Client Components (interactive UI)
    └── Server Actions (mutations: game, auth, settings)
    ↓
Supabase
    ├── Auth (sessions, JWT in cookies)
    └── PostgreSQL (profiles, streaks, daily_actions, food_entries, transactions,
                    bug_reports, flare_days, store_redemptions)
         └── Row Level Security (users access own data; admin uses service role)
```

## Key Directories

```
src/
  app/
    (app)/          # Authenticated routes (dashboard, history, settings)
    actions/        # Server actions (auth, game, settings)
    login/          # Public login page
    auth/callback/  # OAuth/code exchange route
  components/
    dashboard/      # Action grid, stats, food log, characters, flare, chaos
    bugs/           # Bug report FAB + modal
    store/          # Store redemption grid
    food/           # Food history list
    transactions/   # Transaction list
    settings/       # Settings form + export
    layout/         # App shell, nav, theme
    pwa/            # Service worker registration, install prompt
  lib/
    characters/     # Character messages and daily picks
    export/         # Analysis package builder
    game/           # streak, reward, flare, chaos services
    store/          # Store item definitions
    supabase/       # client, server, admin, middleware helpers
    streak.ts       # Date + multiplier logic
    constants.ts    # Action rewards
    errors.ts       # User-friendly error messages
    features/       # Future system stubs (do not implement without review)
supabase/migrations/  # SQL schema + RLS
public/
  manifest.webmanifest
  icons/
```

## Data Flow: Complete Daily Action

1. User taps button → `ActionGrid` calls `completeDailyAction` server action.
2. Action checks auth, today's date, and duplicate completion.
3. `recordActivity` updates streak if first activity today.
4. Row inserted into `daily_actions`.
5. `grantReward` updates `profiles.dollarbucks_balance` and inserts `transactions` row.
6. `revalidatePath` refreshes dashboard and history.
7. Client shows floating reward animation and green completed button.

## Database Migrations

Run in Supabase SQL Editor (in order):

1. `supabase/migrations/20250529000000_initial_schema.sql`
2. `supabase/migrations/20250608000000_profile_settings.sql`
3. `supabase/migrations/20250608100000_jaydan_edition.sql`

All tables use **RLS**. Users can only read/write their own rows.

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase credentials
npm run dev                        # http://localhost:3000
npm run build && npm start         # production + PWA service worker
```

---

# Important Development Rule

Every future feature should answer:

> **"Does this reduce stress or increase stress?"**

If it increases stress, reconsider the feature.

If it makes users feel judged, reconsider the feature.

Bluey Quest exists to make self-care feel achievable.

---

# Maintenance Instructions

**Update this file (`PROJECT_CONTEXT.md`) whenever major features are added, renamed, or removed.**

When updating, revise:

* Current Systems section
* Future Roadmap (move items from planned → implemented)
* Technical Stack / architecture if structure changes
* Public Version Notes if terminology changes

Minor bug fixes and styling tweaks do not require updates unless they change user-visible behavior significantly.

---

# Quick Reference: Routes

| Route            | Purpose                    |
|------------------|----------------------------|
| `/`              | Dashboard (home)           |
| `/login`         | Sign in / sign up          |
| `/food-history`  | Food log history           |
| `/transactions`  | Dollarbucks transaction log|
| `/store`         | Dollarbucks Store          |
| `/settings`      | Profile, theme, export     |
| `/admin`         | Admin overview (no auth)   |
| `/admin/bugs`    | Bug report list            |

---

*Last updated: Jaydan Edition — private build for Jaydan.*

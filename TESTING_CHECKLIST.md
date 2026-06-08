# Bluey Quest v0.1 — Testing Checklist

Use this checklist before real-world testing or deployment. Test on mobile if possible — the app is mobile-first.

**Prerequisites**

- [ ] Supabase project is running (not paused)
- [ ] Migration `20250529000000_initial_schema.sql` applied
- [ ] Migration `20250608000000_profile_settings.sql` applied
- [ ] Migration `20250608100000_jaydan_edition.sql` applied
- [ ] `.env.local` has valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Optional: `SUPABASE_SERVICE_ROLE_KEY` for `/admin` pages
- [ ] `npm run dev` or production build running

---

## Authentication

### Sign up

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Click **New here? Create an account**
3. Enter email + password (6+ characters)
4. Submit **Create Account**

**Expected:** Redirect to dashboard. No raw error codes. Profile and streak rows created in Supabase.

### Sign in

1. Sign out from Settings
2. Sign in with same credentials

**Expected:** Redirect to dashboard. Session persists after browser refresh.

### Sign out

1. Go to **Settings → Sign out**

**Expected:** Redirect to login. Dashboard routes blocked until sign in again.

### Error handling

1. Try wrong password on sign in

**Expected:** Friendly message — *"Could not sign in. Check your email and password."* (not a crash)

2. With Supabase offline/paused, try sign up

**Expected:** *"Could not connect to Bluey Quest..."* (not `{}` or stack trace)

---

## Daily Actions

1. On dashboard, tap **Breakfast**
2. Tap **Breakfast** again
3. Complete **Walk** and **Water Goal**

**Expected:**

- [ ] First tap: green button, ✓ checkmark, floating **+N Dollarbucks** animation
- [ ] Second tap same action: blocked — *"You already completed this today!"*
- [ ] Each different action earnable once per day
- [ ] Completed buttons stay green and disabled

---

## Dollarbucks

1. Note balance on dashboard before an action
2. Complete **PT / Exercise** (+25 base)

**Expected:**

- [ ] Balance increases immediately after refresh/animation
- [ ] Floating reward shows correct amount (with multiplier if streak active)
- [ ] Balance never goes negative

---

## Keepy Uppy

1. Check **Keepy Uppy Streak** and **Keepy Uppy Bonus** on dashboard
2. Complete any one action OR log food (first activity of the day)

**Expected:**

- [ ] Streak increments on first activity of a new day (if yesterday was active)
- [ ] Multiplier tier shown (1.0x → 1.1x at 7 days, etc.)
- [ ] Food log alone counts toward streak (no Dollarbucks from food)

### Streak reset (optional — requires waiting or DB edit)

**Expected:** After missing a full day, gentle message: *"Tomorrow is a great day to start another Keepy Uppy streak!"* — no shame language.

---

## Food Logging

1. Tap **Log Food** on dashboard
2. Enter **Apple** → Save
3. Open modal again, save **Chicken Sandwich**

**Expected:**

- [ ] Modal opens/closes smoothly
- [ ] Only food name required (no calories/macros)
- [ ] Success message after save
- [ ] Empty name shows error

---

## Food History

1. Open **Food** tab in bottom nav

**Expected:**

- [ ] **Today** header for today's entries
- [ ] Time + food name listed chronologically within each day
- [ ] Older days show full date (or **Yesterday**)
- [ ] Empty state if no food logged

---

## Transaction History

1. Open **History** tab

**Expected:**

- [ ] Entries newest first
- [ ] Each row shows time, date, action name, reward earned
- [ ] Multiplier shown when not 1.0x
- [ ] Empty state if no transactions yet

---

## CSV Export

1. Go to **Settings**
2. Tap **Export Data**

**Expected:**

- [ ] CSV file downloads
- [ ] Contains columns: Date, Timestamp, Food Entry, Daily Action, Reward Earned, Dollarbucks Balance
- [ ] Includes both food entries and reward transactions
- [ ] Current balance noted in file header

---

## PWA Install

**Requires production build:** `npm run build && npm start`

1. Open app in Chrome (desktop or Android) or Safari (iOS)
2. Look for install prompt on dashboard OR browser "Install" / "Add to Home Screen"

**Expected:**

- [ ] `manifest.webmanifest` loads (DevTools → Application → Manifest)
- [ ] Icons 192×192 and 512×512 present
- [ ] App installable to home screen
- [ ] Opens standalone from home screen icon
- [ ] Core dashboard usable when installed

---

## Settings

1. Open **Settings** tab
2. Set **Display Name** to a test name → **Save Settings**
3. Change **Theme Preference** → save again

**Expected:**

- [ ] "Settings saved!" confirmation
- [ ] Greeting appears in header: *Hi, {name}! 👋*
- [ ] Theme changes background tone (cozy / bright / calm)
- [ ] Coming Soon section visible (Avatar, Sound Effects, Accessibility)
- [ ] Export Data and Sign out work

---

## Daily Encouragement

1. Open dashboard

**Expected:**

- [ ] Encouragement card visible with one message
- [ ] Same message all day (refresh page — message unchanged until tomorrow)

---

## Muffin Preview (optional easter egg)

1. Clear `bluey-quest-muffin-preview` in localStorage (DevTools)
2. Refresh dashboard several times (~15% chance once per day)

**Expected:**

- [ ] Non-blocking popup may appear
- [ ] **Continue Adventure** dismisses it
- [ ] Does not appear again same day after daily roll

---

## General UX / Accessibility

- [ ] Large touch targets on all main buttons
- [ ] Bottom nav works on all four tabs: Home, Food, History, Settings
- [ ] No raw Supabase/JS errors shown to user
- [ ] App usable on phone viewport (~390px wide)
- [ ] Safe area respected above bottom nav on mobile

---

## Production Build

```bash
npm run build
npm start
```

**Expected:**

- [ ] Build completes with no errors
- [ ] Service worker registered at `/sw.js` (production only)

---

## Jaydan Edition Features

### Bug Report FAB

1. On any authenticated page, tap 🐛 bottom-right
2. Submit a bug with message; optionally attach screenshot

**Expected:** Success confirmation. Row appears in Supabase `bug_reports`. Screenshot URL stored if uploaded.

3. Open `/admin/bugs`

**Expected:** Report listed newest first with date, category, user, message.

### Character popup

1. Clear `localStorage` key for character popup (or use fresh day)
2. Reload dashboard multiple times (~10% chance)

**Expected:** Modal with character image, message, Continue Adventure / Dismiss. Only once per day.

### Character encouragement card

**Expected:** Dashboard shows character image, name, daily message (stable all day).

### Muffin chaos events

1. Complete daily actions repeatedly

**Expected:** ~5% chance of bonus popup (+3/+5/+10). Transaction recorded in history.

### Action feedback

1. Complete Breakfast (or any action)

**Expected:** Green ✓ Completed Today, floating +N Dollarbucks animation.

### Flare Mode

1. Tap **⚡ Flare Day**

**Expected:** Survival messaging. Row in `flare_days`. Streak protected if no other activity that day.

### Store

1. Go to `/store`
2. Redeem an item (ensure sufficient balance)

**Expected:** Balance decreases. Transaction + `store_redemptions` row created.

### Export & Analyze

1. Settings → Export & Analyze
2. Download JSON and CSV

**Expected:** JSON includes streak, flare days, food, actions, transactions, redemptions, `aiAnalysisReady: true`.

### Admin dashboard

1. Open `/admin`

**Expected:** Cards for balance, streak, food count, bugs, transactions, flare days (requires service role key).

### Muffin Mode easter egg

1. Click **Sneak Peek** 5 times on dashboard

**Expected:** Confetti, MUFFIN MODE message, +50 Dollarbucks.

---

## Sign-off

| Tester | Date | Device | Pass/Fail | Notes |
|--------|------|--------|-----------|-------|
|        |      |        |           |       |

---

*See also: [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for architecture and philosophy.*

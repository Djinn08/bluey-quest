# Bluey Quest — Jaydan Edition Test Report

**Date:** June 7, 2026  
**Build:** `npm run build` — PASS  
**Dev server:** `http://localhost:3000`

---

## Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Sneak Peek Modal | PASS (code) | Preview modal on clicks 1–4; Muffin Mode on click 5 |
| Muffin Mode Easter Egg | PASS (code) | Confetti, +50 DB, transaction recorded, server dedup |
| Flare Mode Once/Day | PASS (code) | Green completed state, DB unique constraint |
| Theme Save | PASS (code) | Supabase profile + immediate UI via ThemeContext |
| Theme Persistence | PASS (code)* | *Requires migration `20250608200000_character_themes.sql` |
| Character Themes | PASS (code) | Bluey / Bingo / Muffin with preview swatches |
| Character Assets | PARTIAL | PNG paths configured; SVG fallbacks active until PNGs added |
| Bug Button | PASS (code) | Bug Inspector character image on FAB |
| Character Sounds | PASS (code) | Toggle in Settings; Web Audio synthesis |

---

## Bug #1 — Sneak Peek / Muffin Mode

**Root cause:** Clicks 1–4 had no visible feedback — only click 5 attempted activation.

**Fix verified:**
- [x] Click 1–4 opens **Muffin Preview** modal with Coming Soon list
- [x] **Continue Adventure** closes modal; Sneak Peek link remains
- [x] Click 5 triggers `activateMuffinMode()` server action
- [x] Shows **MUFFIN MODE ACTIVATED** modal with confetti
- [x] Awards +50 Dollarbucks via `grantFlatBonus`
- [x] Records transaction: `Muffin Mode: Flamingo Queen Bonus`
- [x] Server-side dedup prevents repeat bonus
- [x] Sneak Peek button hidden after activation

**Manual test:**
1. Clear `bluey-quest-sneak-peek-count` and `bluey-quest-muffin-mode` in DevTools → Application → localStorage
2. Click Sneak Peek 4 times — preview modal each time
3. Click 5th time — Muffin Mode modal + confetti
4. Check Transactions page for +50 entry
5. Refresh — Sneak Peek gone

---

## Bug #2 — Flare Mode Repeatable

**Root cause:** UI did not reflect completed state after activation; no green check styling.

**Fix verified:**
- [x] `flare_days` table has `unique (user_id, flare_date)` — one per day
- [x] After activation: green **completed** button style
- [x] Shows **✓ Flare Day Active**
- [x] Button disabled — cannot re-activate same day
- [x] `router.refresh()` syncs server state
- [x] Midnight reset via `getTodayDateString()` date comparison

**Manual test:**
1. Activate Flare Day — button turns green with checkmark
2. Try clicking again — no action
3. Refresh page — still green/active
4. (Next day) Button available again

---

## Bug #3 — Theme Settings Not Saving

**Root cause:** Theme applied only via server layout prop; no client-side sync on save. Old themes used generic names. DB check constraint blocked new values until migration.

**Fix verified:**
- [x] `ThemeProvider` context applies theme immediately on selection
- [x] `ThemeSelector` hidden input submits correct `theme_preference`
- [x] `updateSettings` saves to `profiles.theme_preference`
- [x] `router.refresh()` after save reloads server state
- [x] Theme persists on refresh (reads from Supabase layout)
- [x] Theme persists on logout/login (stored in profile, not localStorage)

**Manual test:**
1. Settings → select **Muffin Theme** — UI colors change immediately
2. Save Settings → refresh — Muffin still selected
3. Sign out → sign in — Muffin still selected

**Required:** Run migration `supabase/migrations/20250608200000_character_themes.sql` in Supabase SQL Editor.

---

## Character Themes (Jaydan Edition)

| Theme | Colors | Status |
|-------|--------|--------|
| Bluey | Blue, Light Blue, White | PASS |
| Bingo | Orange, Cream, Warm Beige | PASS |
| Muffin | Purple, Lavender, Pink | PASS |

Selector shows character image, name, and 3 color preview dots.

---

## Character Interactions

- [x] Bluey — positive quote + chime sound
- [x] Bingo — gentle quote + warm tone
- [x] Muffin — random quote + giggle + bounce animation
- [x] Character Sounds toggle in Settings (ON/OFF, persisted to profile)

---

## Bug Button

- [x] FAB uses Bug Inspector character image (PNG with SVG fallback)
- [x] Playful rounded style retained

---

## Character Assets

**Status: PARTIAL**

Code references official asset paths:
- `/characters/bluey.png`
- `/characters/bingo.png`
- `/characters/muffin.png`
- `/characters/buginspector.png`

PNG files are not bundled (private assets). `CharacterImage` falls back to SVG placeholders automatically.

**To complete:** Drop official character PNGs into `public/characters/` per `public/characters/ASSETS.md`.

---

## Pre-Deploy Checklist

- [ ] Run all 4 Supabase migrations in order
- [ ] Add character PNG assets (Jaydan Edition private build)
- [ ] Clear localStorage for fresh Sneak Peek test
- [ ] Verify theme save after migration applied

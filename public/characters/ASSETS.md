# Character Asset Registry

**Rule:** Files are served byte-for-byte. No image processing.

```bash
npm run assets   # install from public/characters/_incoming/ only
```

## Bluey

| File | Use |
|------|-----|
| `bluey-default.png` | Default companion, theme preview (from `bluey-family.png` source) |
| `bluey-heart.png` | Streak milestones, flare day, heart variant |
| `bluey-shock.png` | Surprise events, achievements |

## Bingo

| File | Use |
|------|-----|
| `bingo-default.png` | Default companion, theme preview |
| `bingo-happy.png` | Task complete |
| `bingo-balloon.png` | Celebrations, rewards |

## Muffin

| File | Source | Use |
|------|--------|-----|
| `muffin-default.png` | `MUFFIN.png` | Default companion, theme preview, muffin mode |
| `muffin-buginspector.png` | Muffin-Bluey-Colorful-…-thumb | Bug FAB / modal only |
| `flamingo-queen.png` | GLADYS-FIX | Flamingo Queen easter egg only |

## Group / Splash

| File | Use |
|------|-----|
| `bluey-family.png` | Splash screen, welcome screens |

Registry: `src/lib/characters/index.ts` → `CHARACTER_ASSETS`

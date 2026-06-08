# Character Asset Registry (Jaydan Edition v0.2)

All images use transparency, `object-contain`, and no placeholder frames.

## Bluey

| File | Use |
|------|-----|
| `bluey-default.png` | Default encouragement, interactions |
| `bluey-heart.png` | Flare Day, streak milestones |
| `bluey-shock.png` | Special states (reserved) |

## Bingo

| File | Use |
|------|-----|
| `bingo-default.png` | Default encouragement |
| `bingo-happy.png` | Daily task completed |
| `bingo-balloon.png` | Special states (reserved) |

## Muffin

| File | Use |
|------|-----|
| `muffin-default.webp` | Default encouragement (PNG fallback: `muffin-default.png`) |
| `muffin-buginspector.png` | Bug Inspector FAB, modal, success, Senior Inspector |
| `flamingo-queen.png` | Flamingo Queen unlocked state (Gladys) |
| `muffin-flamingo-ride.png` | Flamingo Queen celebration modal |

## App Icon

| File | Use |
|------|-----|
| `../icons/blueydollarbuck.png` | Source for all PWA icons (`npm run icons`) |

## Processing

```bash
npm run assets   # copy + transparency from Cursor assets folder
npm run icons    # regenerate icon sizes from Dollarbuck
```

Registry source of truth: `src/lib/characters/index.ts` → `CHARACTER_ASSETS`

import type { ThemePreference } from "@/lib/types/database";

export type CompanionId = "bluey" | "bingo" | "muffin";
export type CharacterId = CompanionId | "buginspector" | "flamingoQueen";

export interface CharacterMessage {
  character: CharacterId;
  name: string;
  message: string;
}

export interface CharacterDefinition {
  id: CompanionId;
  name: string;
  theme: ThemePreference;
  defaultImage: string;
  specialImages: {
    heart?: string;
    shock?: string;
    happy?: string;
    balloon?: string;
  };
  quotes: readonly string[];
}

/** Canonical asset paths — files served as-is from /public/characters */
export const CHARACTER_ASSETS = {
  bluey: {
    default: "/characters/bluey-default.png",
    heart: "/characters/bluey-heart.png",
    shock: "/characters/bluey-shock.png",
  },
  bingo: {
    default: "/characters/bingo-default.png",
    happy: "/characters/bingo-happy.png",
    balloon: "/characters/bingo-balloon.png",
  },
  muffin: {
    default: "/characters/muffin-default.png",
    buginspector: "/characters/muffin-buginspector.png",
    flamingoQueen: "/characters/flamingo-queen.png",
  },
  group: {
    family: "/characters/bluey-family.png",
  },
} as const;

export const CHARACTER_REGISTRY: Record<CompanionId, CharacterDefinition> = {
  bluey: {
    id: "bluey",
    name: "Bluey",
    theme: "bluey",
    defaultImage: CHARACTER_ASSETS.bluey.default,
    specialImages: {
      heart: CHARACTER_ASSETS.bluey.heart,
      shock: CHARACTER_ASSETS.bluey.shock,
    },
    quotes: [
      "You're doing great.",
      "One step at a time.",
      "Keep going.",
      "Progress is progress.",
    ],
  },
  bingo: {
    id: "bingo",
    name: "Bingo",
    theme: "bingo",
    defaultImage: CHARACTER_ASSETS.bingo.default,
    specialImages: {
      happy: CHARACTER_ASSETS.bingo.happy,
      balloon: CHARACTER_ASSETS.bingo.balloon,
    },
    quotes: [
      "Little things count.",
      "Every bit helps.",
      "Nice job today.",
      "You've got this.",
    ],
  },
  muffin: {
    id: "muffin",
    name: "Muffin",
    theme: "muffin",
    defaultImage: CHARACTER_ASSETS.muffin.default,
    specialImages: {},
    quotes: [
      "MORE CHAOS!",
      "I DEMAND CELEBRATION!",
      "YOU DID THE THING!",
      "AMAZING!",
    ],
  },
};

export const STREAK_MILESTONES = [7, 14, 30, 60, 100] as const;

export const COMPANION_GRADIENTS: Record<CompanionId, string> = {
  bluey: "from-sky-200 via-sky-100 to-white",
  bingo: "from-orange-200 via-amber-100 to-yellow-50",
  muffin: "from-purple-200 via-pink-100 to-fuchsia-50",
};

export const COMPANION_NAMES: Record<CompanionId, string> = {
  bluey: CHARACTER_REGISTRY.bluey.name,
  bingo: CHARACTER_REGISTRY.bingo.name,
  muffin: CHARACTER_REGISTRY.muffin.name,
};

export const BLUEY_QUOTES = CHARACTER_REGISTRY.bluey.quotes;
export const BINGO_QUOTES = CHARACTER_REGISTRY.bingo.quotes;
export const MUFFIN_QUOTES = CHARACTER_REGISTRY.muffin.quotes;

export const COMPANION_QUOTES: Record<CompanionId, readonly string[]> = {
  bluey: BLUEY_QUOTES,
  bingo: BINGO_QUOTES,
  muffin: MUFFIN_QUOTES,
};

export const FLARE_SUPPORT_QUOTES = [
  "Rest counts too.",
  "You're still showing up.",
  "Gentle mode is on.",
  "Be kind to yourself today.",
  "Some days surviving is the quest.",
] as const;

export const FLAMINGO_QUEEN_TITLE = "ALL HAIL THE FLAMINGO QUEEN";

export const CHARACTERS: Record<
  CharacterId,
  { name: string; image: string; imageFallback: string; color: string }
> = {
  bluey: {
    name: CHARACTER_REGISTRY.bluey.name,
    image: CHARACTER_ASSETS.bluey.default,
    imageFallback: CHARACTER_ASSETS.bluey.default,
    color: COMPANION_GRADIENTS.bluey,
  },
  bingo: {
    name: CHARACTER_REGISTRY.bingo.name,
    image: CHARACTER_ASSETS.bingo.default,
    imageFallback: CHARACTER_ASSETS.bingo.default,
    color: COMPANION_GRADIENTS.bingo,
  },
  muffin: {
    name: CHARACTER_REGISTRY.muffin.name,
    image: CHARACTER_ASSETS.muffin.default,
    imageFallback: CHARACTER_ASSETS.muffin.default,
    color: COMPANION_GRADIENTS.muffin,
  },
  buginspector: {
    name: "Bug Inspector Muffin",
    image: CHARACTER_ASSETS.muffin.buginspector,
    imageFallback: CHARACTER_ASSETS.muffin.buginspector,
    color: "from-violet-200 to-purple-400",
  },
  flamingoQueen: {
    name: "Flamingo Queen Muffin",
    image: CHARACTER_ASSETS.muffin.flamingoQueen,
    imageFallback: CHARACTER_ASSETS.muffin.flamingoQueen,
    color: "from-pink-200 to-purple-400",
  },
};

export const CHARACTER_ROLES = {
  bluey: ["Guide", "Encouragement", "Adventure", "Progress"],
  bingo: ["Comfort", "Flare Days", "Rest Days", "Kindness"],
  muffin: ["Chaos", "Sneak Peek", "Easter Eggs", "Rewards", "Bug Inspector"],
} as const;

export const BUG_INSPECTOR_HEADERS = [
  "Tell me what's broken!",
  "Muffin is investigating...",
  "This is UNACCEPTABLE!",
] as const;

export const BUG_REPORT_SUCCESS_RESPONSES = [
  "I SHALL INVESTIGATE.",
  "THIS CASE IS VERY SERIOUS.",
  "I HAVE WRITTEN THIS DOWN.",
  "I WILL REPORT THIS TO BLUEY.",
  "THIS IS UNACCEPTABLE.",
  "THE BUG HAS BEEN NOTED.",
] as const;

export const SENIOR_BUG_INSPECTOR_TITLE = "Senior Bug Inspector";
export const SENIOR_BUG_INSPECTOR_REPORTS_REQUIRED = 10;
export const SENIOR_BUG_INSPECTOR_BONUS = 25;
export const SENIOR_BUG_INSPECTOR_ACTION = "Senior Bug Inspector: Case Closed Bonus";

export const MUFFIN_REACTION_QUOTES = MUFFIN_QUOTES;
export const BLUEY_REACTION_QUOTES = BLUEY_QUOTES;
export const BINGO_REACTION_QUOTES = BINGO_QUOTES;

export const POPUP_MESSAGES: CharacterMessage[] = [
  { character: "muffin", name: "Muffin", message: "I DEMAND CELEBRATION!" },
  { character: "muffin", name: "Muffin", message: "MORE CHAOS!" },
  { character: "bluey", name: "Bluey", message: "You're doing great." },
  { character: "bluey", name: "Bluey", message: "Keep going." },
  { character: "bingo", name: "Bingo", message: "Little things count." },
  { character: "bingo", name: "Bingo", message: "You've got this." },
];

export const FLARE_MESSAGES = FLARE_SUPPORT_QUOTES;

export const APP_NAME = "Bluey Quest";

export type CompanionImageVariant = "default" | "heart" | "happy" | "shock" | "balloon";

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickRandomCompanion(): CompanionId {
  return pickRandom(["bluey", "bingo", "muffin"] as const);
}

export function pickQuoteForCompanion(companion: CompanionId): string {
  return pickRandom(CHARACTER_REGISTRY[companion].quotes);
}

export function isStreakMilestone(streakDays: number): boolean {
  return (STREAK_MILESTONES as readonly number[]).includes(streakDays);
}

export function getCompanionImage(
  companion: CompanionId,
  variant: CompanionImageVariant = "default",
): string {
  const def = CHARACTER_REGISTRY[companion];
  if (variant === "heart" && def.specialImages.heart) return def.specialImages.heart;
  if (variant === "shock" && def.specialImages.shock) return def.specialImages.shock;
  if (variant === "happy" && def.specialImages.happy) return def.specialImages.happy;
  if (variant === "balloon" && def.specialImages.balloon) return def.specialImages.balloon;
  return def.defaultImage;
}

export function pickDailyItem<T extends { character?: string; message: string }>(
  items: readonly T[],
  date: string,
): T {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length];
}

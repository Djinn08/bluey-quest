export type CharacterId = "muffin" | "bluey" | "bingo" | "buginspector" | "flamingoQueen";

export interface CharacterMessage {
  character: CharacterId;
  name: string;
  message: string;
}

export const CHARACTERS: Record<
  CharacterId,
  { name: string; image: string; imageFallback: string; color: string }
> = {
  muffin: {
    name: "Muffin",
    image: "/characters/muffin.png",
    imageFallback: "/characters/muffin.svg",
    color: "from-purple-200 to-pink-400",
  },
  bluey: {
    name: "Bluey",
    image: "/characters/bluey.png",
    imageFallback: "/characters/bluey.svg",
    color: "from-sky-200 to-sky-400",
  },
  bingo: {
    name: "Bingo",
    image: "/characters/bingo.png",
    imageFallback: "/characters/bingo.svg",
    color: "from-orange-200 to-amber-300",
  },
  buginspector: {
    name: "Bug Inspector Muffin",
    image: "/characters/muffin3.png",
    imageFallback: "/characters/muffin3.png",
    color: "from-violet-200 to-purple-400",
  },
  flamingoQueen: {
    name: "Flamingo Queen Muffin",
    image: "/characters/muffinFlamingoQueen.png",
    imageFallback: "/characters/muffinFlamingoQueen.png",
    color: "from-pink-200 to-purple-400",
  },
};

/** Character role assignments (Jaydan Edition) */
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

export const MUFFIN_REACTION_QUOTES = [
  "I was being special!",
  "MORE CHAOS!",
  "Again! Again!",
  "I'm the Flamingo Queen!",
] as const;

export const BLUEY_REACTION_QUOTES = [
  "You're doing brilliantly!",
  "That's the spirit — keep going!",
  "Every quest counts!",
  "Magic adventures await!",
] as const;

export const BINGO_REACTION_QUOTES = [
  "You're doing great.",
  "Little things count too.",
  "I'm proud of you.",
  "One step at a time.",
] as const;

export const POPUP_MESSAGES: CharacterMessage[] = [
  { character: "muffin", name: "Muffin", message: "I demand more Dollarbucks." },
  { character: "muffin", name: "Muffin", message: "I was being special." },
  { character: "muffin", name: "Muffin", message: "This app requires more chaos." },
  { character: "bluey", name: "Bluey", message: "Good job completing today's quests." },
  { character: "bluey", name: "Bluey", message: "Every adventure starts with one step." },
  { character: "bingo", name: "Bingo", message: "Little things count too." },
  { character: "bingo", name: "Bingo", message: "You're doing great." },
];

export const ENCOURAGEMENT_MESSAGES: CharacterMessage[] = [
  { character: "bluey", name: "Bluey", message: "Every adventure starts with one step." },
  { character: "bluey", name: "Bluey", message: "Good job showing up today." },
  { character: "bingo", name: "Bingo", message: "Little things count." },
  { character: "bingo", name: "Bingo", message: "You're doing great." },
  { character: "muffin", name: "Muffin", message: "MORE CHAOS." },
  { character: "muffin", name: "Muffin", message: "I approve of this snack energy." },
  { character: "buginspector", name: "Bug Inspector Muffin", message: "No bugs detected in your effort today." },
];

export const FLARE_MESSAGES = [
  "You still showed up.",
  "Rest is productive.",
  "Some days surviving is the quest.",
  "Today counts, even if it's quiet.",
  "Gentle mode is on — be kind to yourself.",
] as const;

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
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

export function pickDailyCharacterMessage(date: string): CharacterMessage {
  return pickDailyItem(ENCOURAGEMENT_MESSAGES, date);
}

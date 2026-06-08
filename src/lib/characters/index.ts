export type CharacterId = "muffin" | "bluey" | "bingo" | "buginspector";

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
    name: "Bug Inspector",
    image: "/characters/buginspector.png",
    imageFallback: "/characters/buginspector.svg",
    color: "from-violet-200 to-purple-400",
  },
};

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
  { character: "buginspector", name: "Bug Inspector", message: "No bugs detected in your effort today." },
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

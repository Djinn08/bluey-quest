export interface StoreItem {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  description: string;
}

export const STORE_ITEMS: StoreItem[] = [
  {
    id: "movie_night",
    name: "Movie Night",
    cost: 500,
    emoji: "🎬",
    description: "Cozy movie night — you earned it.",
  },
  {
    id: "takeout_night",
    name: "Takeout Night",
    cost: 1500,
    emoji: "🥡",
    description: "Takeout without guilt. Just joy.",
  },
  {
    id: "plushie_fund",
    name: "Plushie Fund",
    cost: 2500,
    emoji: "🧸",
    description: "Saving up for something soft and nice.",
  },
  {
    id: "new_game_fund",
    name: "New Game Fund",
    cost: 10000,
    emoji: "🎮",
    description: "A big quest reward for a big treat.",
  },
];

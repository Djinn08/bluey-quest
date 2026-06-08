import type { ThemePreference } from "@/lib/types/database";

export interface ThemeConfig {
  id: ThemePreference;
  name: string;
  emoji: string;
  characterImage: string;
  characterImageFallback: string;
  previewColors: [string, string, string];
}

export const THEMES: ThemeConfig[] = [
  {
    id: "bluey",
    name: "Bluey Theme",
    emoji: "🐶",
    characterImage: "/characters/bluey-default.png",
    characterImageFallback: "/characters/bluey-default.png",
    previewColors: ["#0284c7", "#7dd3fc", "#ffffff"],
  },
  {
    id: "bingo",
    name: "Bingo Theme",
    emoji: "🐶",
    characterImage: "/characters/bingo-default.png",
    characterImageFallback: "/characters/bingo-default.png",
    previewColors: ["#ea580c", "#fef3c7", "#f5f0e6"],
  },
  {
    id: "muffin",
    name: "Muffin Theme",
    emoji: "🐶",
    characterImage: "/characters/muffin-default.webp",
    characterImageFallback: "/characters/muffin-default.png",
    previewColors: ["#9333ea", "#e9d5ff", "#fbcfe8"],
  },
];

export const DEFAULT_THEME: ThemePreference = "bluey";

export function isValidTheme(value: string): value is ThemePreference {
  return THEMES.some((t) => t.id === value);
}

export function getThemeConfig(theme: ThemePreference): ThemeConfig {
  return THEMES.find((t) => t.id === theme) ?? THEMES[0];
}

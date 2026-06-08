import { CHARACTER_ASSETS } from "@/lib/characters";
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
    characterImage: CHARACTER_ASSETS.bluey.default,
    characterImageFallback: CHARACTER_ASSETS.bluey.default,
    previewColors: ["#0284c7", "#7dd3fc", "#ffffff"],
  },
  {
    id: "bingo",
    name: "Bingo Theme",
    emoji: "🐶",
    characterImage: CHARACTER_ASSETS.bingo.default,
    characterImageFallback: CHARACTER_ASSETS.bingo.default,
    previewColors: ["#ea580c", "#fef3c7", "#f5f0e6"],
  },
  {
    id: "muffin",
    name: "Muffin Theme",
    emoji: "🐶",
    characterImage: CHARACTER_ASSETS.muffin.default,
    characterImageFallback: CHARACTER_ASSETS.muffin.default,
    previewColors: ["#9333ea", "#e9d5ff", "#fbcfe8"],
  },
];

export const DEFAULT_THEME: ThemePreference = "bluey";

const LEGACY_THEME_MAP: Record<string, ThemePreference> = {
  cozy: "bluey",
  bright: "bluey",
  calm: "bingo",
};

export function isValidTheme(value: string): value is ThemePreference {
  return THEMES.some((t) => t.id === value);
}

export function normalizeTheme(value: string): ThemePreference {
  if (isValidTheme(value)) return value;
  return LEGACY_THEME_MAP[value] ?? DEFAULT_THEME;
}

export function getThemeConfig(theme: ThemePreference): ThemeConfig {
  return THEMES.find((t) => t.id === theme) ?? THEMES[0];
}

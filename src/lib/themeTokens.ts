import type { ThemePreference } from "@/lib/types/database";

/** Semantic CSS custom properties for a character theme */
export interface ThemeTokenSet {
  "--bg": string;
  "--bg-pattern": string;
  "--card": string;
  "--card-alt": string;
  "--primary": string;
  "--primary-light": string;
  "--text": string;
  "--text-muted": string;
  "--accent": string;
  "--header-bg": string;
  "--header-border": string;
  "--nav-bg": string;
  "--nav-active-bg": string;
  "--nav-text": string;
  "--nav-active-text": string;
  "--input-border": string;
  "--input-focus": string;
  "--card-ring": string;
  "--card-shadow": string;
  "--encouragement-from": string;
  "--encouragement-via": string;
  "--encouragement-to": string;
  "--encouragement-shadow": string;
  "--stats-from": string;
  "--stats-to": string;
  "--streak-accent": string;
  "--install-bg": string;
  "--install-ring": string;
  "--progress-track": string;
  "--progress-fill": string;
}

function patternSvg(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const BLUEY_PATTERN = patternSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88">
  <rect x="6" y="10" width="30" height="26" rx="13" fill="#1D9BF0" opacity="0.04"/>
  <rect x="48" y="34" width="26" height="22" rx="11" fill="#7CC7FF" opacity="0.04"/>
  <circle cx="22" cy="62" r="15" fill="#1D9BF0" opacity="0.035"/>
  <circle cx="68" cy="14" r="11" fill="#7CC7FF" opacity="0.03"/>
</svg>`);

const BINGO_PATTERN = patternSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88">
  <circle cx="22" cy="22" r="17" fill="#F97316" opacity="0.04"/>
  <circle cx="62" cy="48" r="14" fill="#FDBA74" opacity="0.04"/>
  <circle cx="38" cy="68" r="12" fill="#F97316" opacity="0.035"/>
  <circle cx="72" cy="18" r="9" fill="#FDBA74" opacity="0.03"/>
</svg>`);

const MUFFIN_PATTERN = patternSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88">
  <ellipse cx="26" cy="28" rx="20" ry="15" fill="#9333EA" opacity="0.04"/>
  <ellipse cx="58" cy="54" rx="16" ry="20" fill="#6B7280" opacity="0.04"/>
  <ellipse cx="70" cy="18" rx="12" ry="10" fill="#E879F9" opacity="0.035"/>
  <circle cx="14" cy="66" r="10" fill="#9333EA" opacity="0.03"/>
</svg>`);

export const BLUEY_THEME: ThemeTokenSet = {
  "--bg": "#E8F4FC",
  "--bg-pattern": BLUEY_PATTERN,
  "--card": "#F7FBFF",
  "--card-alt": "#E0F2FE",
  "--primary": "#1D9BF0",
  "--primary-light": "#7CC7FF",
  "--text": "#0C4A6E",
  "--text-muted": "#0369A1",
  "--accent": "#7CC7FF",
  "--header-bg": "rgba(247, 251, 255, 0.92)",
  "--header-border": "rgba(125, 199, 255, 0.45)",
  "--nav-bg": "rgba(247, 251, 255, 0.96)",
  "--nav-active-bg": "#E0F2FE",
  "--nav-text": "#0369A1",
  "--nav-active-text": "#0C4A6E",
  "--input-border": "#BAE6FD",
  "--input-focus": "#7CC7FF",
  "--card-ring": "rgba(186, 230, 253, 0.9)",
  "--card-shadow": "rgba(29, 155, 240, 0.12)",
  "--encouragement-from": "#BAE6FD",
  "--encouragement-via": "#E0F2FE",
  "--encouragement-to": "#FFFFFF",
  "--encouragement-shadow": "rgba(29, 155, 240, 0.18)",
  "--stats-from": "#E0F2FE",
  "--stats-to": "#FFFDF8",
  "--streak-accent": "#F97316",
  "--install-bg": "rgba(224, 242, 254, 0.95)",
  "--install-ring": "rgba(125, 199, 255, 0.6)",
  "--progress-track": "#E0F2FE",
  "--progress-fill": "#1D9BF0",
};

export const BINGO_THEME: ThemeTokenSet = {
  "--bg": "#FFF8F0",
  "--bg-pattern": BINGO_PATTERN,
  "--card": "#FFFBF5",
  "--card-alt": "#FEF3C7",
  "--primary": "#F97316",
  "--primary-light": "#FDBA74",
  "--text": "#7C2D12",
  "--text-muted": "#C2410C",
  "--accent": "#FDBA74",
  "--header-bg": "rgba(255, 251, 245, 0.92)",
  "--header-border": "rgba(253, 186, 116, 0.5)",
  "--nav-bg": "rgba(255, 251, 245, 0.96)",
  "--nav-active-bg": "#FEF3C7",
  "--nav-text": "#C2410C",
  "--nav-active-text": "#7C2D12",
  "--input-border": "#FED7AA",
  "--input-focus": "#FDBA74",
  "--card-ring": "rgba(254, 215, 170, 0.9)",
  "--card-shadow": "rgba(249, 115, 22, 0.12)",
  "--encouragement-from": "#FED7AA",
  "--encouragement-via": "#FEF3C7",
  "--encouragement-to": "#FFFBEB",
  "--encouragement-shadow": "rgba(249, 115, 22, 0.16)",
  "--stats-from": "#FEF3C7",
  "--stats-to": "#FFF7ED",
  "--streak-accent": "#EA580C",
  "--install-bg": "rgba(254, 243, 199, 0.95)",
  "--install-ring": "rgba(253, 186, 116, 0.6)",
  "--progress-track": "#FEF3C7",
  "--progress-fill": "#F97316",
};

export const MUFFIN_THEME: ThemeTokenSet = {
  "--bg": "#FAF5FF",
  "--bg-pattern": MUFFIN_PATTERN,
  "--card": "#FDFAFF",
  "--card-alt": "#F3E8FF",
  "--primary": "#9333EA",
  "--primary-light": "#E879F9",
  "--text": "#581C87",
  "--text-muted": "#7E22CE",
  "--accent": "#E879F9",
  "--header-bg": "rgba(253, 250, 255, 0.92)",
  "--header-border": "rgba(232, 121, 249, 0.4)",
  "--nav-bg": "rgba(253, 250, 255, 0.96)",
  "--nav-active-bg": "#F3E8FF",
  "--nav-text": "#7E22CE",
  "--nav-active-text": "#581C87",
  "--input-border": "#E9D5FF",
  "--input-focus": "#E879F9",
  "--card-ring": "rgba(233, 213, 255, 0.9)",
  "--card-shadow": "rgba(147, 51, 234, 0.12)",
  "--encouragement-from": "#E9D5FF",
  "--encouragement-via": "#F3E8FF",
  "--encouragement-to": "#FDF2F8",
  "--encouragement-shadow": "rgba(147, 51, 234, 0.18)",
  "--stats-from": "#F3E8FF",
  "--stats-to": "#FDF2F8",
  "--streak-accent": "#E879F9",
  "--install-bg": "rgba(243, 232, 255, 0.95)",
  "--install-ring": "rgba(232, 121, 249, 0.55)",
  "--progress-track": "#F3E8FF",
  "--progress-fill": "#9333EA",
};

export const THEME_TOKENS: Record<ThemePreference, ThemeTokenSet> = {
  bluey: BLUEY_THEME,
  bingo: BINGO_THEME,
  muffin: MUFFIN_THEME,
};

export function applyThemeTokens(theme: ThemePreference): void {
  if (typeof document === "undefined") return;

  const tokens = THEME_TOKENS[theme];
  const root = document.documentElement;

  root.setAttribute("data-theme", theme);

  for (const [key, value] of Object.entries(tokens)) {
    root.style.setProperty(key, value);
  }
}

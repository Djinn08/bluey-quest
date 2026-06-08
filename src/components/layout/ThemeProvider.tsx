"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_THEME } from "@/lib/themes";
import { applyThemeTokens } from "@/lib/themeTokens";
import type { ThemePreference } from "@/lib/types/database";

const THEME_STORAGE_KEY = "bluey-quest-theme";

interface ThemeContextValue {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  characterSoundsEnabled: boolean;
  setCharacterSoundsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  theme: ThemePreference;
  characterSoundsEnabled?: boolean;
  children: ReactNode;
}

export function ThemeProvider({
  theme: serverTheme,
  characterSoundsEnabled: serverSounds = true,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState(serverTheme);
  const [characterSoundsEnabled, setCharacterSoundsState] = useState(serverSounds);

  useEffect(() => {
    setThemeState(serverTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, serverTheme);
    } catch {
      /* private browsing */
    }
  }, [serverTheme]);

  useEffect(() => {
    setCharacterSoundsState(serverSounds);
  }, [serverSounds]);

  useEffect(() => {
    applyThemeTokens(serverTheme);
  }, [serverTheme]);

  useEffect(() => {
    applyThemeTokens(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    applyThemeTokens(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private browsing */
    }
  }, []);

  const setCharacterSoundsEnabled = useCallback((enabled: boolean) => {
    setCharacterSoundsState(enabled);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, characterSoundsEnabled, setCharacterSoundsEnabled }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Read cached theme for optimistic UI — server profile remains source of truth */
export function readCachedTheme(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const cached = localStorage.getItem(THEME_STORAGE_KEY);
    if (cached === "bluey" || cached === "bingo" || cached === "muffin") {
      return cached;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

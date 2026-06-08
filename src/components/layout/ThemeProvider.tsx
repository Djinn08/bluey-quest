"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ThemePreference } from "@/lib/types/database";

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
  }, [serverTheme]);

  useEffect(() => {
    setCharacterSoundsState(serverSounds);
  }, [serverSounds]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
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

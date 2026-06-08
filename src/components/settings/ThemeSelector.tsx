"use client";

import type { ThemePreference } from "@/lib/types/database";
import { THEMES } from "@/lib/themes";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { useTheme } from "@/components/layout/ThemeProvider";

interface ThemeSelectorProps {
  value: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { setTheme } = useTheme();

  function handleSelect(theme: ThemePreference) {
    onChange(theme);
    setTheme(theme);
  }

  return (
    <div className="space-y-2">
      <span className="text-theme-muted block text-sm font-medium">Theme Preference</span>
      <input type="hidden" name="theme_preference" value={value} />
      <div className="grid gap-3">
        {THEMES.map((theme) => {
          const selected = value === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelect(theme.id)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                selected
                  ? "border-[var(--primary)] bg-[var(--card-alt)] ring-2 ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]"
                  : "border-[var(--input-border)] bg-[var(--card)] hover:border-[var(--primary-light)]"
              }`}
              aria-pressed={selected}
            >
              <div className="relative h-14 w-14 shrink-0">
                <CharacterImage
                  src={theme.characterImage}
                  fallback={theme.characterImageFallback}
                  alt={theme.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain drop-shadow-sm"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-theme font-bold">
                  {theme.emoji} {theme.name}
                </p>
                <div className="mt-1.5 flex gap-1">
                  {theme.previewColors.map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              {selected && (
                <span className="shrink-0 text-lg font-bold text-emerald-600" aria-hidden>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

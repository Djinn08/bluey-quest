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
      <span className="block text-sm font-medium text-sky-800">Theme Preference</span>
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
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                  : "border-sky-200 bg-white hover:border-sky-300"
              }`}
              aria-pressed={selected}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white ring-2 ring-white/80">
                <CharacterImage
                  src={theme.characterImage}
                  fallback={theme.characterImageFallback}
                  alt={theme.name}
                  fill
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sky-900">
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

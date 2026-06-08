"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { exportAnalysisPackage } from "@/app/actions/export";
import { updateSettings, type SettingsResult } from "@/app/actions/settings";
import { signOut } from "@/app/actions/game";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/components/layout/ThemeProvider";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { DEFAULT_THEME } from "@/lib/themes";
import type { ThemePreference } from "@/lib/types/database";

const initial: SettingsResult = {};

interface SettingsFormProps {
  displayName: string | null;
  themePreference: ThemePreference;
  characterSoundsEnabled: boolean;
}

export function SettingsForm({
  displayName,
  themePreference,
  characterSoundsEnabled,
}: SettingsFormProps) {
  const router = useRouter();
  const { setTheme, setCharacterSoundsEnabled } = useTheme();
  const [state, formAction, pending] = useActionState(updateSettings, initial);
  const [exportPending, startExport] = useTransition();
  const [exportError, setExportError] = useState<string | null>(null);
  const [signOutPending, startSignOut] = useTransition();
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference>(
    themePreference ?? DEFAULT_THEME,
  );
  const [soundsOn, setSoundsOn] = useState(characterSoundsEnabled);

  useEffect(() => {
    setSelectedTheme(themePreference ?? DEFAULT_THEME);
    setTheme(themePreference ?? DEFAULT_THEME);
  }, [themePreference, setTheme]);

  useEffect(() => {
    setSoundsOn(characterSoundsEnabled);
    setCharacterSoundsEnabled(characterSoundsEnabled);
  }, [characterSoundsEnabled, setCharacterSoundsEnabled]);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  function handleExport(format: "json" | "csv") {
    setExportError(null);
    startExport(async () => {
      const result = await exportAnalysisPackage();
      if (!result.success) {
        setExportError(result.error);
        return;
      }
      const content = format === "json" ? result.json : result.csv;
      const mime = format === "json" ? "application/json" : "text/csv;charset=utf-8;";
      const ext = format === "json" ? "json" : "csv";
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename.replace(".json", `.${ext}`);
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <form action={formAction} className="space-y-4">
          <h2 className="text-lg font-bold text-sky-900">Your Profile</h2>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-sky-800">Display Name</span>
            <input
              name="display_name"
              type="text"
              defaultValue={displayName ?? ""}
              placeholder="What should we call you?"
              className="w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </label>

          <ThemeSelector value={selectedTheme} onChange={setSelectedTheme} />

          <input type="hidden" name="character_sounds_enabled" value={soundsOn ? "on" : "off"} />
          <label className="flex items-center justify-between rounded-2xl border-2 border-sky-200 px-4 py-3">
            <span className="text-sm font-medium text-sky-800">Character Sounds</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-600">{soundsOn ? "ON" : "OFF"}</span>
              <input
                type="checkbox"
                checked={soundsOn}
                onChange={(e) => {
                  setSoundsOn(e.target.checked);
                  setCharacterSoundsEnabled(e.target.checked);
                }}
                className="h-5 w-5 rounded accent-sky-500"
              />
            </div>
          </label>

          {state.error && (
            <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-900" role="alert">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
              Settings saved!
            </p>
          )}

          <Button type="submit" fullWidth disabled={pending}>
            {pending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-sky-900">Export &amp; Analyze</h2>
        <p className="mt-1 text-sm text-sky-700">
          Download your full quest data as a structured Analysis Package (JSON) or CSV.
          Ready for future AI insights.
        </p>
        {exportError && (
          <p className="mt-2 rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-900" role="alert">
            {exportError}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            fullWidth
            disabled={exportPending}
            onClick={() => handleExport("json")}
          >
            {exportPending ? "Preparing..." : "Analysis Package (JSON)"}
          </Button>
          <Button
            fullWidth
            disabled={exportPending}
            onClick={() => handleExport("csv")}
          >
            {exportPending ? "Preparing..." : "CSV Download"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-sky-900">Coming Soon</h2>
        <ul className="mt-2 space-y-2 text-sm text-sky-700">
          <li>🔒 Avatar</li>
          <li>🔒 Accessibility Options</li>
        </ul>
      </Card>

      <button
        type="button"
        className="mx-auto block min-h-12 px-4 text-sm font-medium text-sky-600 underline-offset-2 hover:underline disabled:opacity-50"
        disabled={signOutPending}
        onClick={() => startSignOut(() => signOut())}
      >
        {signOutPending ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}

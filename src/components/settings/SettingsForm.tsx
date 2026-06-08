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
  const [soundsOn, setSoundsOn] = useState(characterSoundsEnabled);

  // Sync from server only when saved preference changes (after refresh)
  useEffect(() => {
    setTheme(themePreference);
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
          <h2 className="text-theme text-lg font-bold">Your Profile</h2>

          <label className="block">
            <span className="text-theme-muted mb-1 block text-sm font-medium">Display Name</span>
            <input
              name="display_name"
              type="text"
              defaultValue={displayName ?? ""}
              placeholder="What should we call you?"
              className="themed-input w-full rounded-2xl px-4 py-3 text-lg"
            />
          </label>

          <ThemeSelector />

          <input type="hidden" name="character_sounds_enabled" value={soundsOn ? "on" : "off"} />
          <label className="flex items-center justify-between rounded-2xl border-2 border-[var(--input-border)] bg-[var(--card)] px-4 py-3">
            <span className="text-theme-muted text-sm font-medium">Character Sounds</span>
            <div className="flex items-center gap-2">
              <span className="text-theme-muted text-xs font-semibold">{soundsOn ? "ON" : "OFF"}</span>
              <input
                type="checkbox"
                checked={soundsOn}
                onChange={(e) => {
                  setSoundsOn(e.target.checked);
                  setCharacterSoundsEnabled(e.target.checked);
                }}
                className="h-5 w-5 rounded accent-[var(--primary)]"
              />
            </div>
          </label>

          {state.error && (
            <p className="bg-warning rounded-xl px-3 py-2 text-sm text-warning" role="alert">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="bg-success rounded-xl px-3 py-2 text-sm text-success" role="status">
              Settings saved!
            </p>
          )}

          <Button type="submit" fullWidth disabled={pending}>
            {pending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-theme text-lg font-bold">Export &amp; Analyze</h2>
        <p className="text-theme-muted mt-1 text-sm">
          Download your full quest data as a structured Analysis Package (JSON) or CSV.
          Ready for future AI insights.
        </p>
        {exportError && (
          <p className="bg-warning mt-2 rounded-xl px-3 py-2 text-sm text-warning" role="alert">
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
        <h2 className="text-theme text-lg font-bold">Coming Soon</h2>
        <ul className="text-theme-muted mt-2 space-y-2 text-sm">
          <li>🔒 Avatar</li>
          <li>🔒 Accessibility Options</li>
        </ul>
      </Card>

      <button
        type="button"
        className="text-theme-muted mx-auto block min-h-12 px-4 text-sm font-medium underline-offset-2 hover:underline disabled:opacity-50"
        disabled={signOutPending}
        onClick={() => startSignOut(() => signOut())}
      >
        {signOutPending ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}

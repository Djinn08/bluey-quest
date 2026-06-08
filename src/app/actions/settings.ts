"use server";

import { revalidatePath } from "next/cache";
import { ERRORS, friendlyDbError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { isValidTheme } from "@/lib/themes";
import type { ThemePreference } from "@/lib/types/database";

export type SettingsResult = { error?: string; success?: boolean };

export async function updateSettings(
  _prev: SettingsResult,
  formData: FormData,
): Promise<SettingsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: ERRORS.notSignedIn };
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const themeRaw = String(formData.get("theme_preference") ?? "bluey");
  const characterSounds = formData.get("character_sounds_enabled") === "on";

  if (!isValidTheme(themeRaw)) {
    return { error: ERRORS.settingsSave };
  }

  const theme = themeRaw as ThemePreference;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      theme_preference: theme,
      character_sounds_enabled: characterSounds,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Settings update error:", error.message);
    return { error: friendlyDbError("settings") };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

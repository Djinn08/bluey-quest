"use server";

import { revalidatePath } from "next/cache";
import { ERRORS, formatSettingsError } from "@/lib/errors";
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
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Settings save failed: invalid theme "${themeRaw}"`
          : ERRORS.settingsSave,
    };
  }

  const theme = themeRaw as ThemePreference;

  const payload = {
    display_name: displayName || null,
    theme_preference: theme,
    character_sounds_enabled: characterSounds,
  };

  let { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error?.message?.includes("character_sounds_enabled")) {
    console.warn("[Settings] Retrying without character_sounds_enabled column");
    const fallback = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        theme_preference: theme,
      })
      .eq("id", user.id)
      .select("id")
      .maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return { error: formatSettingsError(error) };
  }

  if (!data) {
    const message = `No profile row found for user ${user.id}`;
    console.error("[Settings save failed]", message);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Settings save failed: ${message}`
          : ERRORS.settingsSave,
    };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

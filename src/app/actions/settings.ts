"use server";

import { revalidatePath } from "next/cache";
import { ERRORS, formatSettingsError } from "@/lib/errors";
import { ensureUserProfile } from "@/lib/profile/ensure-profile";
import { createClient } from "@/lib/supabase/server";
import { isValidTheme, normalizeTheme } from "@/lib/themes";
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

  const theme = normalizeTheme(themeRaw);

  if (!isValidTheme(theme)) {
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Settings save failed: invalid theme "${themeRaw}"`
          : ERRORS.settingsSave,
    };
  }

  await ensureUserProfile(supabase);

  const updatePayload = {
    display_name: displayName || null,
    theme_preference: theme as ThemePreference,
    character_sounds_enabled: characterSounds,
  };

  let { data, error } = await supabase
    .from("profiles")
    .update(updatePayload)
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

  if (!error && !data) {
    const insertResult = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        display_name: displayName || null,
        theme_preference: theme,
        character_sounds_enabled: characterSounds,
      })
      .select("id")
      .maybeSingle();
    data = insertResult.data;
    error = insertResult.error;
  }

  if (error) {
    return { error: formatSettingsError(error) };
  }

  if (!data) {
    const message = `Profile save returned no row for user ${user.id}`;
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

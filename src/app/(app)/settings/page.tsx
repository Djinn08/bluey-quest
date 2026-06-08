import { SettingsForm } from "@/components/settings/SettingsForm";
import { DEFAULT_THEME, normalizeTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, theme_preference, character_sounds_enabled")
    .eq("id", user.id)
    .single();

  return (
    <SettingsForm
      displayName={profile?.display_name ?? null}
      themePreference={normalizeTheme(profile?.theme_preference ?? DEFAULT_THEME)}
      characterSoundsEnabled={profile?.character_sounds_enabled ?? true}
    />
  );
}

import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { BugReportFab } from "@/components/bugs/BugReportFab";
import { SneakPeekProvider } from "@/components/easter-egg/SneakPeekProvider";
import { ensureUserProfile } from "@/lib/profile/ensure-profile";
import { DEFAULT_THEME, normalizeTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureUserProfile(supabase);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, theme_preference, character_sounds_enabled")
    .eq("id", user.id)
    .single();

  const theme = normalizeTheme(profile?.theme_preference ?? DEFAULT_THEME);
  const greeting = profile?.display_name?.trim() || null;
  const characterSoundsEnabled = profile?.character_sounds_enabled ?? true;

  return (
    <ThemeProvider theme={theme} characterSoundsEnabled={characterSoundsEnabled}>
      <SneakPeekProvider>
        <AppShell greeting={greeting}>{children}</AppShell>
        <BugReportFab />
      </SneakPeekProvider>
    </ThemeProvider>
  );
}

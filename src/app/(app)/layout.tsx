import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { BugReportFab } from "@/components/bugs/BugReportFab";
import { DEFAULT_THEME } from "@/lib/themes";
import { createClient } from "@/lib/supabase/server";
import type { ThemePreference } from "@/lib/types/database";

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, theme_preference, character_sounds_enabled")
    .eq("id", user.id)
    .single();

  const theme = (profile?.theme_preference as ThemePreference) ?? DEFAULT_THEME;
  const greeting = profile?.display_name?.trim() || null;
  const characterSoundsEnabled = profile?.character_sounds_enabled ?? true;

  return (
    <ThemeProvider theme={theme} characterSoundsEnabled={characterSoundsEnabled}>
      <AppShell greeting={greeting}>{children}</AppShell>
      <BugReportFab />
    </ThemeProvider>
  );
}

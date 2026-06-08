import type { SupabaseClient } from "@supabase/supabase-js";

/** Ensures profiles + streaks rows exist for the signed-in user (id = auth.uid()). */
export async function ensureUserProfile(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.rpc("ensure_user_profile");
  if (error) {
    console.warn("[ensureUserProfile]", error.message);
  }
}

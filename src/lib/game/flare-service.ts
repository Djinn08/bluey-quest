import type { SupabaseClient } from "@supabase/supabase-js";
import { getTodayDateString } from "@/lib/streak";

export async function isFlareDayActive(
  supabase: SupabaseClient,
  userId: string,
  date = getTodayDateString(),
): Promise<boolean> {
  const { data } = await supabase
    .from("flare_days")
    .select("id")
    .eq("user_id", userId)
    .eq("flare_date", date)
    .maybeSingle();

  return !!data;
}

export async function activateFlareDay(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ alreadyActive: boolean; error?: string }> {
  const today = getTodayDateString();

  const { data: existing } = await supabase
    .from("flare_days")
    .select("id")
    .eq("user_id", userId)
    .eq("flare_date", today)
    .maybeSingle();

  if (existing) {
    return { alreadyActive: true };
  }

  const { error } = await supabase.from("flare_days").insert({
    user_id: userId,
    flare_date: today,
  });

  if (error) {
    return { alreadyActive: false, error: error.message };
  }

  return { alreadyActive: false };
}

export async function deactivateFlareDay(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ wasActive: boolean; error?: string }> {
  const today = getTodayDateString();

  const { data, error } = await supabase
    .from("flare_days")
    .delete()
    .eq("user_id", userId)
    .eq("flare_date", today)
    .select("id");

  if (error) {
    return { wasActive: false, error: error.message };
  }

  return { wasActive: (data?.length ?? 0) > 0 };
}

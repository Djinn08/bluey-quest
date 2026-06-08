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
): Promise<{ alreadyActive: boolean }> {
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

  await supabase.from("flare_days").insert({
    user_id: userId,
    flare_date: today,
  });

  return { alreadyActive: false };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { DailyEntry } from "@/lib/types/database";

/** All check-ins for a user — used by export and future mood trend features */
export async function listDailyEntries(
  supabase: SupabaseClient,
  userId: string,
): Promise<DailyEntry[]> {
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: true });

  if (error) {
    console.error("listDailyEntries error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getDailyEntryForDate(
  supabase: SupabaseClient,
  userId: string,
  entryDate: string,
): Promise<DailyEntry | null> {
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .maybeSingle();

  if (error) {
    console.error("getDailyEntryForDate error:", error.message);
    return null;
  }

  return data;
}

/** Upsert one check-in per day — updates today's row instead of creating duplicates */
export async function saveDailyMood(
  supabase: SupabaseClient,
  userId: string,
  entryDate: string,
  moodScore: number,
  moodNotes: string | null,
): Promise<{ data: DailyEntry | null; error: { message?: string; code?: string } | null }> {
  const { data, error } = await supabase
    .from("daily_entries")
    .upsert(
      {
        user_id: userId,
        entry_date: entryDate,
        mood_score: moodScore,
        mood_notes: moodNotes,
      },
      { onConflict: "user_id,entry_date" },
    )
    .select("*")
    .single();

  return { data, error };
}

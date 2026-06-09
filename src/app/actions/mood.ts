"use server";

import { revalidatePath } from "next/cache";
import { insertAnalyticsEvent } from "@/lib/analytics/insert-event";
import { ERRORS, formatMoodError } from "@/lib/errors";
import { saveDailyMood } from "@/lib/game/mood-service";
import { recordActivity } from "@/lib/game/streak-service";
import { getTodayDateString } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";

export type MoodResult = { success: true } | { success: false; error: string };

const MOOD_NOTES_MAX = 1000;

export async function saveMoodCheckIn(
  moodScore: number,
  moodNotes: string,
): Promise<MoodResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERRORS.notSignedIn };
    }

    if (!Number.isInteger(moodScore) || moodScore < 1 || moodScore > 10) {
      return { success: false, error: ERRORS.moodScoreInvalid };
    }

    const trimmedNotes = moodNotes.trim();
    if (trimmedNotes.length > MOOD_NOTES_MAX) {
      return { success: false, error: ERRORS.moodNotesTooLong };
    }

    const today = getTodayDateString();

    const { data: streakBefore } = await supabase
      .from("streaks")
      .select("last_activity_date")
      .eq("user_id", user.id)
      .single();

    if (streakBefore?.last_activity_date !== today) {
      await recordActivity(supabase, user.id);
    }

    const { error } = await saveDailyMood(
      supabase,
      user.id,
      today,
      moodScore,
      trimmedNotes || null,
    );

    if (error) {
      return { success: false, error: formatMoodError(error) };
    }

    void insertAnalyticsEvent(supabase, user.id, "mood_logged", { score: moodScore });

    if (trimmedNotes) {
      void insertAnalyticsEvent(supabase, user.id, "mood_note_added");
    }

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("saveMoodCheckIn error:", err);
    return { success: false, error: ERRORS.generic };
  }
}

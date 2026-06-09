"use server";

import { revalidatePath } from "next/cache";
import { insertAnalyticsEvent } from "@/lib/analytics/insert-event";
import { MOOD_CHECK_IN_LABEL, MOOD_CHECK_IN_REWARD } from "@/lib/constants";
import { ERRORS, formatMoodError } from "@/lib/errors";
import { hasCompletedCheckInToday } from "@/lib/features/mood-tracking";
import { getDailyEntryForDate, saveDailyMood } from "@/lib/game/mood-service";
import { grantReward } from "@/lib/game/reward-service";
import { recordActivity } from "@/lib/game/streak-service";
import { getStreakMultiplier } from "@/lib/streak";
import { getTodayDateString } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";

export type MoodResult =
  | { success: true; rewardEarned: number }
  | { success: false; error: string };

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
    const existing = await getDailyEntryForDate(supabase, user.id, today);
    const isFirstCheckInToday = !hasCompletedCheckInToday(existing?.mood_score);

    const { data: streakBefore } = await supabase
      .from("streaks")
      .select("current_streak_days, last_activity_date")
      .eq("user_id", user.id)
      .single();

    const alreadyActiveToday = streakBefore?.last_activity_date === today;
    const { multiplier } = alreadyActiveToday
      ? { multiplier: getStreakMultiplier(streakBefore?.current_streak_days ?? 0) }
      : await recordActivity(supabase, user.id);

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

    let rewardEarned = 0;
    if (isFirstCheckInToday) {
      const granted = await grantReward(
        supabase,
        user.id,
        MOOD_CHECK_IN_LABEL,
        MOOD_CHECK_IN_REWARD,
        multiplier,
      );
      rewardEarned = granted.rewardEarned;
    }

    void insertAnalyticsEvent(supabase, user.id, "mood_logged", { score: moodScore });

    if (trimmedNotes) {
      void insertAnalyticsEvent(supabase, user.id, "mood_note_added");
    }

    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true, rewardEarned };
  } catch (err) {
    console.error("saveMoodCheckIn error:", err);
    return { success: false, error: ERRORS.generic };
  }
}

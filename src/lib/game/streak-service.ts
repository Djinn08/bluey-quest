import type { SupabaseClient } from "@supabase/supabase-js";
import {
  computeStreakUpdate,
  getStreakMultiplier,
  getTodayDateString,
  streakExpiredWithoutActivityToday,
} from "@/lib/streak";
import { isFlareDayActive } from "@/lib/game/flare-service";

async function hasFlareBetweenDates(
  supabase: SupabaseClient,
  userId: string,
  fromDate: string,
  toDate: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("flare_days")
    .select("flare_date")
    .eq("user_id", userId)
    .gte("flare_date", fromDate)
    .lte("flare_date", toDate)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

export async function ensureStreakCurrent(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ streakDays: number; wasReset: boolean }> {
  const today = getTodayDateString();

  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak) {
    return { streakDays: 0, wasReset: false };
  }

  const flareToday = await isFlareDayActive(supabase, userId, today);

  if (flareToday && streak.current_streak_days > 0) {
    return { streakDays: streak.current_streak_days, wasReset: false };
  }

  if (
    streakExpiredWithoutActivityToday(streak.last_activity_date, today) &&
    streak.current_streak_days > 0
  ) {
    const last = streak.last_activity_date ?? today;
    const protectedByFlare = await hasFlareBetweenDates(
      supabase,
      userId,
      last,
      today,
    );

    if (protectedByFlare) {
      return { streakDays: streak.current_streak_days, wasReset: false };
    }

    await supabase
      .from("streaks")
      .update({ current_streak_days: 0 })
      .eq("user_id", userId);

    return { streakDays: 0, wasReset: true };
  }

  return { streakDays: streak.current_streak_days, wasReset: false };
}

export async function recordActivity(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ streakDays: number; multiplier: number }> {
  const today = getTodayDateString();

  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak) {
    throw new Error("Streak record not found");
  }

  const { newStreak } = computeStreakUpdate(
    streak.current_streak_days,
    streak.last_activity_date,
    today,
  );

  await supabase
    .from("streaks")
    .update({
      current_streak_days: newStreak,
      last_activity_date: today,
    })
    .eq("user_id", userId);

  const multiplier = getStreakMultiplier(newStreak);
  return { streakDays: newStreak, multiplier };
}

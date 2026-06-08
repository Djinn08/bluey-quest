"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ACTION_LABELS, ACTION_REWARDS } from "@/lib/constants";
import { rollChaosEvent } from "@/lib/game/chaos-events";
import { ERRORS, friendlyDbError } from "@/lib/errors";
import { grantFlatBonus, grantReward } from "@/lib/game/reward-service";
import { recordActivity } from "@/lib/game/streak-service";
import { getStreakMultiplier } from "@/lib/streak";
import { getTodayDateString } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";
import type { DailyActionType } from "@/lib/types/database";

export type ActionResult =
  | {
      success: true;
      rewardEarned: number;
      newBalance: number;
      chaosEvent?: { message: string; bonus: number };
    }
  | { success: false; error: string };

export async function completeDailyAction(
  actionType: DailyActionType,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERRORS.notSignedIn };
    }

    const today = getTodayDateString();

    const { data: existing } = await supabase
      .from("daily_actions")
      .select("id")
      .eq("user_id", user.id)
      .eq("action_type", actionType)
      .eq("action_date", today)
      .maybeSingle();

    if (existing) {
      return { success: false, error: ERRORS.actionAlreadyDone };
    }

    const baseReward = ACTION_REWARDS[actionType];
    const label = ACTION_LABELS[actionType];

    const { data: streakBefore } = await supabase
      .from("streaks")
      .select("current_streak_days, last_activity_date")
      .eq("user_id", user.id)
      .single();

    const alreadyActiveToday = streakBefore?.last_activity_date === today;
    const { multiplier } = alreadyActiveToday
      ? { multiplier: getStreakMultiplier(streakBefore?.current_streak_days ?? 0) }
      : await recordActivity(supabase, user.id);

    const { error: insertError } = await supabase.from("daily_actions").insert({
      user_id: user.id,
      action_type: actionType,
      action_date: today,
    });

    if (insertError) {
      console.error("Daily action insert error:", insertError.message);
      return { success: false, error: friendlyDbError("action") };
    }

    const { rewardEarned, newBalance } = await grantReward(
      supabase,
      user.id,
      label,
      baseReward,
      multiplier,
    );

    let chaosEvent: { message: string; bonus: number } | undefined;
    const chaos = rollChaosEvent();
    if (chaos) {
      await grantFlatBonus(supabase, user.id, `Chaos: ${chaos.message}`, chaos.bonus);
      chaosEvent = { message: chaos.message, bonus: chaos.bonus };
    }

    revalidatePath("/");
    revalidatePath("/transactions");

    return {
      success: true,
      rewardEarned,
      newBalance: chaosEvent ? newBalance + chaosEvent.bonus : newBalance,
      chaosEvent,
    };
  } catch (err) {
    console.error("completeDailyAction error:", err);
    return { success: false, error: ERRORS.generic };
  }
}

export async function logFood(foodName: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: ERRORS.notSignedIn };
    }

    const trimmed = foodName.trim();
    if (!trimmed) {
      return { success: false, error: ERRORS.foodEmpty };
    }

    const today = getTodayDateString();

    const { data: streakBefore } = await supabase
      .from("streaks")
      .select("current_streak_days, last_activity_date")
      .eq("user_id", user.id)
      .single();

    const alreadyActiveToday = streakBefore?.last_activity_date === today;
    if (!alreadyActiveToday) {
      await recordActivity(supabase, user.id);
    }

    const { error } = await supabase.from("food_entries").insert({
      user_id: user.id,
      food_name: trimmed,
      entry_date: today,
    });

    if (error) {
      console.error("Food entry insert error:", error.message);
      return { success: false, error: friendlyDbError("food") };
    }

    revalidatePath("/");
    revalidatePath("/food-history");

    return { success: true, rewardEarned: 0, newBalance: 0 };
  } catch (err) {
    console.error("logFood error:", err);
    return { success: false, error: ERRORS.generic };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

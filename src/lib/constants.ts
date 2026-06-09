import type { DailyActionType } from "@/lib/types/database";

export const ACTION_REWARDS: Record<DailyActionType, number> = {
  breakfast: 5,
  lunch: 5,
  dinner: 5,
  snack: 2,
  water_goal: 10,
  walk: 10,
  pt_exercise: 25,
};

export const ACTION_LABELS: Record<DailyActionType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  water_goal: "Water Goal",
  walk: "Walk",
  pt_exercise: "PT / Exercise",
};

export const DAILY_ACTION_TYPES = Object.keys(ACTION_REWARDS) as DailyActionType[];

export const MOOD_CHECK_IN_REWARD = 10;
export const MOOD_CHECK_IN_LABEL = "Daily Check-In";

export const STREAK_RESET_MESSAGE =
  "Tomorrow is a great day to start another Keepy Uppy streak!";

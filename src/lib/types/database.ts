export type DailyActionType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "water_goal"
  | "walk"
  | "pt_exercise";

export interface Profile {
  id: string;
  dollarbucks_balance: number;
  display_name: string | null;
  theme_preference: ThemePreference;
  character_sounds_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type ThemePreference = "bluey" | "bingo" | "muffin";

export interface Streak {
  id: string;
  user_id: string;
  current_streak_days: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface DailyAction {
  id: string;
  user_id: string;
  action_type: DailyActionType;
  action_date: string;
  completed_at: string;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  food_name: string;
  logged_at: string;
  entry_date: string;
}

/** One journal check-in per user per day — mood_notes is the optional notes field */
export interface DailyEntry {
  id: string;
  user_id: string;
  /** Calendar date for this check-in (maps to DB entry_date) */
  entry_date: string;
  mood_score: number | null;
  mood_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  action: string;
  base_reward: number;
  multiplier: number;
  reward_earned: number;
  created_at: string;
}

export type BugCategory = "bug" | "suggestion" | "complaint" | "feature_request";

export interface BugReport {
  id: string;
  user_id: string;
  category: BugCategory;
  message: string;
  screenshot_url: string | null;
  created_at: string;
}

export interface FlareDay {
  id: string;
  user_id: string;
  flare_date: string;
  created_at: string;
}

export interface StoreRedemption {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  cost: number;
  created_at: string;
}

export interface DashboardStats {
  balance: number;
  streakDays: number;
  multiplier: number;
  streakWasReset: boolean;
}

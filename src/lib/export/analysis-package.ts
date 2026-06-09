import type { SupabaseClient } from "@supabase/supabase-js";
import { getTodayDateString } from "@/lib/streak";

export interface AnalysisPackage {
  version: "1.0";
  exportedAt: string;
  userId: string;
  profile: {
    dollarbucksBalance: number;
    displayName: string | null;
  };
  streak: {
    currentDays: number;
    lastActivityDate: string | null;
  };
  flareDays: { date: string; createdAt: string }[];
  foodEntries: {
    date: string;
    timestamp: string;
    foodName: string;
  }[];
  dailyActions: {
    date: string;
    actionType: string;
    completedAt: string;
  }[];
  transactions: {
    timestamp: string;
    action: string;
    baseReward: number;
    multiplier: number;
    rewardEarned: number;
  }[];
  storeRedemptions: {
    timestamp: string;
    itemName: string;
    cost: number;
  }[];
  dailyEntries: {
    date: string;
    moodScore: number | null;
    moodNotes: string | null;
    updatedAt: string;
  }[];
  /** Reserved for future AI analysis endpoint */
  aiAnalysisReady: boolean;
}

export async function buildAnalysisPackage(
  supabase: SupabaseClient,
  userId: string,
): Promise<AnalysisPackage> {
  const [
    { data: profile },
    { data: streak },
    { data: food },
    { data: actions },
    { data: transactions },
    { data: flareDays },
    { data: redemptions },
    { data: dailyEntries },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("dollarbucks_balance, display_name")
      .eq("id", userId)
      .single(),
    supabase.from("streaks").select("current_streak_days, last_activity_date").eq("user_id", userId).single(),
    supabase.from("food_entries").select("*").eq("user_id", userId).order("logged_at", { ascending: true }),
    supabase.from("daily_actions").select("*").eq("user_id", userId).order("completed_at", { ascending: true }),
    supabase.from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("flare_days").select("*").eq("user_id", userId).order("flare_date", { ascending: true }),
    supabase.from("store_redemptions").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase.from("daily_entries").select("*").eq("user_id", userId).order("entry_date", { ascending: true }),
  ]);

  return {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    userId,
    profile: {
      dollarbucksBalance: profile?.dollarbucks_balance ?? 0,
      displayName: profile?.display_name ?? null,
    },
    streak: {
      currentDays: streak?.current_streak_days ?? 0,
      lastActivityDate: streak?.last_activity_date ?? null,
    },
    flareDays: (flareDays ?? []).map((f) => ({
      date: f.flare_date,
      createdAt: f.created_at,
    })),
    foodEntries: (food ?? []).map((f) => ({
      date: f.entry_date,
      timestamp: f.logged_at,
      foodName: f.food_name,
    })),
    dailyActions: (actions ?? []).map((a) => ({
      date: a.action_date,
      actionType: a.action_type,
      completedAt: a.completed_at,
    })),
    transactions: (transactions ?? []).map((t) => ({
      timestamp: t.created_at,
      action: t.action,
      baseReward: t.base_reward,
      multiplier: Number(t.multiplier),
      rewardEarned: t.reward_earned,
    })),
    storeRedemptions: (redemptions ?? []).map((r) => ({
      timestamp: r.created_at,
      itemName: r.item_name,
      cost: r.cost,
    })),
    dailyEntries: (dailyEntries ?? []).map((e) => ({
      date: e.entry_date,
      moodScore: e.mood_score,
      moodNotes: e.mood_notes,
      updatedAt: e.updated_at,
    })),
    aiAnalysisReady: true,
  };
}

export function analysisPackageToCsv(pkg: AnalysisPackage): string {
  const header =
    "Date,Timestamp,Food Entry,Daily Action,Reward Earned,Dollarbucks Balance";
  let running = 0;
  const rows: string[] = [];

  type Row = { sort: number; date: string; ts: string; food: string; action: string; reward: number };
  const merged: Row[] = [];

  for (const f of pkg.foodEntries) {
    merged.push({
      sort: new Date(f.timestamp).getTime(),
      date: f.date,
      ts: f.timestamp,
      food: f.foodName,
      action: "",
      reward: 0,
    });
  }
  for (const t of pkg.transactions) {
    merged.push({
      sort: new Date(t.timestamp).getTime(),
      date: t.timestamp.slice(0, 10),
      ts: t.timestamp,
      food: "",
      action: t.action,
      reward: t.rewardEarned,
    });
  }
  merged.sort((a, b) => a.sort - b.sort);

  for (const row of merged) {
    running += row.reward;
    rows.push(
      [
        row.date,
        row.ts,
        `"${row.food.replace(/"/g, '""')}"`,
        `"${row.action.replace(/"/g, '""')}"`,
        row.reward,
        running,
      ].join(","),
    );
  }

  return [
    `# Current Balance: ${pkg.profile.dollarbucksBalance}`,
    `# Streak Days: ${pkg.streak.currentDays}`,
    `# Flare Days: ${pkg.flareDays.length}`,
    header,
    ...rows,
  ].join("\n");
}

export function getTodayExportFilename(): string {
  return `bluey-quest-analysis-${getTodayDateString()}.json`;
}

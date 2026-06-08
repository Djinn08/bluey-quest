import { ActionGrid } from "@/components/dashboard/ActionGrid";
import { CharacterEncouragementCard } from "@/components/dashboard/CharacterEncouragementCard";
import { CharacterPopup } from "@/components/dashboard/CharacterPopup";
import { FlareModeButton } from "@/components/dashboard/FlareModeButton";
import { LogFoodSection } from "@/components/dashboard/LogFoodSection";
import { StatsBanner } from "@/components/dashboard/StatsBanner";
import { StreakMessage } from "@/components/dashboard/StreakMessage";
import { SneakPeekButton } from "@/components/easter-egg/SneakPeekProvider";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { pickRandom, FLARE_MESSAGES } from "@/lib/characters";
import { isFlareDayActive } from "@/lib/game/flare-service";
import { ensureStreakCurrent } from "@/lib/game/streak-service";
import { getStreakMultiplier } from "@/lib/streak";
import { getTodayDateString } from "@/lib/streak";
import { createClient } from "@/lib/supabase/server";
import type { DailyActionType } from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = getTodayDateString();
  const flareActive = await isFlareDayActive(supabase, user.id, today);
  const { wasReset } = await ensureStreakCurrent(supabase, user.id);

  const [{ data: profile }, { data: streak }, { data: actions }] = await Promise.all([
    supabase.from("profiles").select("dollarbucks_balance").eq("id", user.id).single(),
    supabase.from("streaks").select("current_streak_days").eq("user_id", user.id).single(),
    supabase
      .from("daily_actions")
      .select("action_type")
      .eq("user_id", user.id)
      .eq("action_date", today),
  ]);

  const streakDays = streak?.current_streak_days ?? 0;
  const multiplier = getStreakMultiplier(streakDays);
  const completedToday = (actions ?? []).map(
    (a) => a.action_type as DailyActionType,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <StatsBanner
        balance={profile?.dollarbucks_balance ?? 0}
        streakDays={streakDays}
        multiplier={multiplier}
      />

      <CharacterEncouragementCard
        flareActive={flareActive}
        streakDays={streakDays}
        hasCompletedToday={completedToday.length > 0}
      />

      <SneakPeekButton />

      {flareActive && (
        <div className="rounded-2xl bg-violet-100 px-4 py-3 text-center text-sm font-semibold text-violet-900">
          ⚡ Flare Day — {pickRandom(FLARE_MESSAGES)}
        </div>
      )}

      <StreakMessage show={wasReset && !flareActive} />

      <FlareModeButton isActive={flareActive} />

      <InstallPrompt />

      <section>
        <h2 className="text-theme mb-3 text-lg font-bold">Daily Actions</h2>
        <p className="text-theme-muted mb-3 text-sm">
          Tap when you complete a habit — consistency counts more than doing everything!
        </p>
        <ActionGrid completedToday={completedToday} />
      </section>

      <section>
        <h2 className="text-theme mb-3 text-lg font-bold">Food Log</h2>
        <LogFoodSection />
      </section>

      <CharacterPopup />
    </div>
  );
}

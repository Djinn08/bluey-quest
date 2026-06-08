"use server";

import { grantFlatBonus } from "@/lib/game/reward-service";
import { ERRORS } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

const MUFFIN_MODE_BONUS = 50;
const MUFFIN_MODE_ACTION = "Muffin Mode: Flamingo Queen Bonus";

export type EasterEggResult =
  | { success: true; bonus: number; newBalance: number }
  | { success: false; error: string };

export async function activateMuffinMode(): Promise<EasterEggResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  const { data: existing } = await supabase
    .from("transactions")
    .select("id")
    .eq("user_id", user.id)
    .eq("action", MUFFIN_MODE_ACTION)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "Muffin Mode already activated!" };
  }

  const { rewardEarned, newBalance } = await grantFlatBonus(
    supabase,
    user.id,
    MUFFIN_MODE_ACTION,
    MUFFIN_MODE_BONUS,
  );

  return { success: true, bonus: rewardEarned, newBalance };
}

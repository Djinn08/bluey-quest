import type { SupabaseClient } from "@supabase/supabase-js";
import { applyMultiplier } from "@/lib/streak";

export async function grantReward(
  supabase: SupabaseClient,
  userId: string,
  actionLabel: string,
  baseReward: number,
  multiplier: number,
): Promise<{ rewardEarned: number; newBalance: number }> {
  const rewardEarned = applyMultiplier(baseReward, multiplier);

  const { data: profile } = await supabase
    .from("profiles")
    .select("dollarbucks_balance")
    .eq("id", userId)
    .single();

  const currentBalance = profile?.dollarbucks_balance ?? 0;
  const newBalance = currentBalance + rewardEarned;

  await supabase
    .from("profiles")
    .update({ dollarbucks_balance: newBalance })
    .eq("id", userId);

  await supabase.from("transactions").insert({
    user_id: userId,
    action: actionLabel,
    base_reward: baseReward,
    multiplier,
    reward_earned: rewardEarned,
  });

  return { rewardEarned, newBalance };
}

export async function grantFlatBonus(
  supabase: SupabaseClient,
  userId: string,
  actionLabel: string,
  amount: number,
): Promise<{ rewardEarned: number; newBalance: number }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("dollarbucks_balance")
    .eq("id", userId)
    .single();

  const currentBalance = profile?.dollarbucks_balance ?? 0;
  const newBalance = currentBalance + amount;

  await supabase
    .from("profiles")
    .update({ dollarbucks_balance: newBalance })
    .eq("id", userId);

  await supabase.from("transactions").insert({
    user_id: userId,
    action: actionLabel,
    base_reward: amount,
    multiplier: 1,
    reward_earned: amount,
  });

  return { rewardEarned: amount, newBalance };
}

export async function deductForPurchase(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
  itemName: string,
  cost: number,
): Promise<{ success: true; newBalance: number } | { success: false; error: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("dollarbucks_balance")
    .eq("id", userId)
    .single();

  const balance = profile?.dollarbucks_balance ?? 0;
  if (balance < cost) {
    return { success: false, error: "Not enough Dollarbucks yet — keep questing!" };
  }

  const newBalance = balance - cost;

  await supabase
    .from("profiles")
    .update({ dollarbucks_balance: newBalance })
    .eq("id", userId);

  await supabase.from("store_redemptions").insert({
    user_id: userId,
    item_id: itemId,
    item_name: itemName,
    cost,
  });

  await supabase.from("transactions").insert({
    user_id: userId,
    action: `Store: ${itemName}`,
    base_reward: -cost,
    multiplier: 1,
    reward_earned: -cost,
  });

  return { success: true, newBalance };
}

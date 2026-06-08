"use server";

import { revalidatePath } from "next/cache";
import { deductForPurchase } from "@/lib/game/reward-service";
import { STORE_ITEMS } from "@/lib/store/items";
import { ERRORS } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export type RedeemResult =
  | { success: true; newBalance: number; itemName: string }
  | { success: false; error: string };

export async function redeemStoreItem(itemId: string): Promise<RedeemResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  const item = STORE_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, error: ERRORS.generic };
  }

  const result = await deductForPurchase(
    supabase,
    user.id,
    item.id,
    item.name,
    item.cost,
  );

  if (!result.success) {
    return result;
  }

  revalidatePath("/");
  revalidatePath("/store");
  revalidatePath("/transactions");

  return { success: true, newBalance: result.newBalance, itemName: item.name };
}

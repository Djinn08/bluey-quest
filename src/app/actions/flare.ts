"use server";

import { revalidatePath } from "next/cache";
import { pickRandom, FLARE_MESSAGES } from "@/lib/characters";
import { activateFlareDay } from "@/lib/game/flare-service";
import { ERRORS } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export type FlareResult =
  | { success: true; alreadyActive: boolean; message: string }
  | { success: false; error: string };

export async function activateFlareMode(): Promise<FlareResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  const { alreadyActive } = await activateFlareDay(supabase, user.id);

  revalidatePath("/");

  return {
    success: true,
    alreadyActive,
    message: pickRandom(FLARE_MESSAGES),
  };
}

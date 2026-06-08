"use server";

import { revalidatePath } from "next/cache";
import { pickRandom, FLARE_MESSAGES } from "@/lib/characters";
import { activateFlareDay, deactivateFlareDay } from "@/lib/game/flare-service";
import { ERRORS, formatFlareError } from "@/lib/errors";
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

  const { alreadyActive, error } = await activateFlareDay(supabase, user.id);

  if (error) {
    return { success: false, error: formatFlareError({ message: error }) };
  }

  revalidatePath("/");

  return {
    success: true,
    alreadyActive,
    message: pickRandom(FLARE_MESSAGES),
  };
}

export async function deactivateFlareMode(): Promise<FlareResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  const { error } = await deactivateFlareDay(supabase, user.id);

  if (error) {
    return { success: false, error: formatFlareError({ message: error }, "deactivate") };
  }

  revalidatePath("/");

  return {
    success: true,
    alreadyActive: false,
    message: "Glad you're feeling better!",
  };
}

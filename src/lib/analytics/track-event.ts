import { createClient } from "@/lib/supabase/client";
import { insertAnalyticsEvent } from "./insert-event";

/**
 * Client-safe analytics helper. Attaches the signed-in user and never throws.
 *
 * @example
 * await trackEvent("mood_logged", { score: 8 });
 */
export async function trackEvent(
  eventName: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await insertAnalyticsEvent(supabase, user.id, eventName, metadata);
  } catch (err) {
    console.error("[analytics]", eventName, err);
  }
}

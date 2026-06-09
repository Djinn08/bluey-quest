import type { SupabaseClient } from "@supabase/supabase-js";

/** Fire-and-forget analytics insert — never throws */
export async function insertAnalyticsEvent(
  supabase: SupabaseClient,
  userId: string,
  eventName: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    const { error } = await supabase.from("analytics_events").insert({
      user_id: userId,
      event_name: eventName,
      metadata: metadata ?? {},
    });

    if (error) {
      console.error("[analytics]", eventName, error.message);
    }
  } catch (err) {
    console.error("[analytics]", eventName, err);
  }
}

import { FoodHistoryList } from "@/components/food/FoodHistoryList";
import { createClient } from "@/lib/supabase/server";
import type { FoodEntry } from "@/lib/types/database";

export default async function FoodHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: entries } = await supabase
    .from("food_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <p className="text-theme-muted text-sm">
        A simple record of what you ate — no numbers, no judgment.
      </p>
      <FoodHistoryList entries={(entries ?? []) as FoodEntry[]} />
    </div>
  );
}

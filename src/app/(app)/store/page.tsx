import { StoreGrid } from "@/components/store/StoreGrid";
import { createClient } from "@/lib/supabase/server";

export default async function StorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("dollarbucks_balance")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-4">
      <p className="text-sm text-sky-700">
        Spend Dollarbucks on real-life treats — you earned every one.
      </p>
      <StoreGrid balance={profile?.dollarbucks_balance ?? 0} />
    </div>
  );
}

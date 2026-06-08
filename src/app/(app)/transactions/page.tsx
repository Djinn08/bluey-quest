import { TransactionList } from "@/components/transactions/TransactionList";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types/database";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4">
      <p className="text-theme-muted text-sm">Your Dollarbucks wins — newest first.</p>
      <TransactionList transactions={(transactions ?? []) as Transaction[]} />
    </div>
  );
}

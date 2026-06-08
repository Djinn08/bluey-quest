import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = createAdminClient();

  if (!admin) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <Card>
          <p className="text-sky-800">
            Add <code className="rounded bg-sky-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
            <code className="rounded bg-sky-100 px-1">.env.local</code> to enable the admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  const [
    { count: foodCount },
    { count: bugCount },
    { count: flareCount },
    { data: profiles },
    { data: transactions },
  ] = await Promise.all([
    admin.from("food_entries").select("*", { count: "exact", head: true }),
    admin.from("bug_reports").select("*", { count: "exact", head: true }),
    admin.from("flare_days").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("dollarbucks_balance"),
    admin
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalBalance = profiles?.reduce((s, p) => s + (p.dollarbucks_balance ?? 0), 0) ?? 0;

  const { data: streaks } = await admin.from("streaks").select("current_streak_days");
  const maxStreak = streaks?.reduce((m, s) => Math.max(m, s.current_streak_days ?? 0), 0) ?? 0;

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-sky-900">Admin</h1>
        <Link href="/admin/bugs" className="text-sm font-semibold text-sky-600 hover:underline">
          Bug Reports →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-sky-600">Dollarbucks</p>
          <p className="text-2xl font-bold text-sky-900">{totalBalance}</p>
        </Card>
        <Card>
          <p className="text-xs text-sky-600">Best Streak</p>
          <p className="text-2xl font-bold text-orange-600">{maxStreak} days</p>
        </Card>
        <Card>
          <p className="text-xs text-sky-600">Food Entries</p>
          <p className="text-2xl font-bold text-sky-900">{foodCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs text-sky-600">Bug Reports</p>
          <p className="text-2xl font-bold text-violet-600">{bugCount ?? 0}</p>
        </Card>
        <Card className="col-span-2">
          <p className="text-xs text-sky-600">Flare Days Logged</p>
          <p className="text-2xl font-bold text-violet-700">{flareCount ?? 0}</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-2 font-bold text-sky-900">Recent Transactions</h2>
        <ul className="space-y-2">
          {(transactions ?? []).map((tx) => (
            <li key={tx.id}>
              <Card className="py-3 text-sm">
                <span className="font-semibold text-sky-900">{tx.action}</span>{" "}
                <span className={tx.reward_earned >= 0 ? "text-orange-600" : "text-violet-600"}>
                  {tx.reward_earned >= 0 ? "+" : ""}
                  {tx.reward_earned}
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Link href="/" className="block text-center text-sm text-sky-600 hover:underline">
        ← Back to app
      </Link>
    </div>
  );
}

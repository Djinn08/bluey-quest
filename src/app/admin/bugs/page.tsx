import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { CHARACTERS } from "@/lib/characters";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BugReport } from "@/lib/types/database";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug",
  suggestion: "Suggestion",
  complaint: "Complaint",
  feature_request: "Feature Request",
};

const bugInspector = CHARACTERS.buginspector;

export default async function AdminBugsPage() {
  const admin = createAdminClient();

  if (!admin) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <Card>
          <p className="text-sky-800">Configure SUPABASE_SERVICE_ROLE_KEY for admin access.</p>
        </Card>
      </div>
    );
  }

  const { data: reports } = await admin
    .from("bug_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const list = (reports ?? []) as BugReport[];

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <Card className="bg-gradient-to-r from-violet-100 to-purple-100">
        <div className="flex items-center gap-4">
          <CharacterImage
            src={bugInspector.image}
            fallback={bugInspector.imageFallback}
            alt="Bug Inspector Muffin"
            width={80}
            height={80}
            className="object-contain"
          />
          <div>
            <h1 className="text-xl font-extrabold text-violet-900">🐶 Bug Inspector Muffin</h1>
            <p className="text-sm font-medium text-violet-700">Muffin is investigating...</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-sky-900">Reports ({list.length})</h2>
        <Link href="/admin" className="text-sm font-semibold text-sky-600 hover:underline">
          ← Admin
        </Link>
      </div>

      {list.length === 0 ? (
        <Card>
          <p className="text-center text-sky-700">No reports yet. The case files are empty.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {list.map((report) => (
            <li key={report.id}>
              <Card>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">
                    {CATEGORY_LABELS[report.category] ?? report.category}
                  </span>
                  <time className="text-xs text-sky-500">
                    {new Date(report.created_at).toLocaleString()}
                  </time>
                </div>
                <p className="mt-2 text-xs text-sky-500">User: {report.user_id.slice(0, 8)}…</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-sky-900">{report.message}</p>
                {report.screenshot_url && (
                  <a
                    href={report.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-sky-600 hover:underline"
                  >
                    View screenshot
                  </a>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

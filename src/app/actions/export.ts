"use server";

import {
  analysisPackageToCsv,
  buildAnalysisPackage,
  getTodayExportFilename,
} from "@/lib/export/analysis-package";
import { ERRORS, friendlyDbError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export type ExportResult =
  | {
      success: true;
      json: string;
      csv: string;
      filename: string;
    }
  | { success: false; error: string };

export async function exportAnalysisPackage(): Promise<ExportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  try {
    const pkg = await buildAnalysisPackage(supabase, user.id);
    const json = JSON.stringify(pkg, null, 2);
    const csv = analysisPackageToCsv(pkg);

    return {
      success: true,
      json,
      csv,
      filename: getTodayExportFilename(),
    };
  } catch (err) {
    console.error("Export error:", err);
    return { success: false, error: friendlyDbError("export") };
  }
}

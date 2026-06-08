"use server";

import { grantFlatBonus } from "@/lib/game/reward-service";
import {
  pickRandom,
  BUG_REPORT_SUCCESS_RESPONSES,
  SENIOR_BUG_INSPECTOR_ACTION,
  SENIOR_BUG_INSPECTOR_BONUS,
  SENIOR_BUG_INSPECTOR_REPORTS_REQUIRED,
  SENIOR_BUG_INSPECTOR_TITLE,
} from "@/lib/characters";
import { ERRORS } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { BugCategory } from "@/lib/types/database";

export type BugResult =
  | {
      success: true;
      response: string;
      totalReports: number;
      seniorInspectorUnlocked?: { bonus: number; title: string };
    }
  | { success: false; error: string };

const VALID_CATEGORIES: BugCategory[] = [
  "bug",
  "suggestion",
  "complaint",
  "feature_request",
];

export async function submitBugReport(formData: FormData): Promise<BugResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: ERRORS.notSignedIn };
  }

  const category = String(formData.get("category") ?? "") as BugCategory;
  const message = String(formData.get("message") ?? "").trim();
  const screenshot = formData.get("screenshot") as File | null;

  if (!VALID_CATEGORIES.includes(category)) {
    return { success: false, error: "Please pick a category." };
  }
  if (!message) {
    return { success: false, error: "Please write a message." };
  }

  let screenshotUrl: string | null = null;

  if (screenshot && screenshot.size > 0) {
    const ext = screenshot.name.split(".").pop() ?? "png";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("bug-screenshots")
      .upload(path, screenshot, { upsert: false });

    if (uploadError) {
      console.error("Screenshot upload error:", uploadError.message);
    } else {
      const { data: urlData } = supabase.storage
        .from("bug-screenshots")
        .getPublicUrl(path);
      screenshotUrl = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from("bug_reports").insert({
    user_id: user.id,
    category,
    message,
    screenshot_url: screenshotUrl,
  });

  if (error) {
    console.error("Bug report insert error:", error.message);
    return { success: false, error: "Could not send your report. Please try again." };
  }

  const { count } = await supabase
    .from("bug_reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const totalReports = count ?? 0;
  const response = pickRandom(BUG_REPORT_SUCCESS_RESPONSES);

  let seniorInspectorUnlocked: { bonus: number; title: string } | undefined;

  if (totalReports >= SENIOR_BUG_INSPECTOR_REPORTS_REQUIRED) {
    const { data: existingBonus } = await supabase
      .from("transactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("action", SENIOR_BUG_INSPECTOR_ACTION)
      .maybeSingle();

    if (!existingBonus) {
      await grantFlatBonus(
        supabase,
        user.id,
        SENIOR_BUG_INSPECTOR_ACTION,
        SENIOR_BUG_INSPECTOR_BONUS,
      );
      seniorInspectorUnlocked = {
        bonus: SENIOR_BUG_INSPECTOR_BONUS,
        title: SENIOR_BUG_INSPECTOR_TITLE,
      };
    }
  }

  return { success: true, response, totalReports, seniorInspectorUnlocked };
}

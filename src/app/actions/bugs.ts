"use server";

import { ERRORS } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { BugCategory } from "@/lib/types/database";

export type BugResult = { error?: string; success?: boolean };

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
    return { error: ERRORS.notSignedIn };
  }

  const category = String(formData.get("category") ?? "") as BugCategory;
  const message = String(formData.get("message") ?? "").trim();
  const screenshot = formData.get("screenshot") as File | null;

  if (!VALID_CATEGORIES.includes(category)) {
    return { error: "Please pick a category." };
  }
  if (!message) {
    return { error: "Please write a message." };
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
    return { error: "Could not send your report. Please try again." };
  }

  return { success: true };
}

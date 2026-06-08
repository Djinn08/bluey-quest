/** User-friendly error messages — never expose raw crashes in production */

export const ERRORS = {
  notSignedIn: "Please sign in to continue.",
  actionSave: "Could not save your action. Please try again.",
  foodSave: "Could not save food entry. Please try again.",
  foodEmpty: "Please enter a food name.",
  actionAlreadyDone: "You already completed this today!",
  flareSave: "Could not activate Flare Day. Please try again.",
  flareEnd: "Could not end Flare Day. Please try again.",
  settingsSave: "Could not save settings. Please try again.",
  exportFailed: "Could not export your data. Please try again.",
  connection:
    "Could not connect to Bluey Quest. Please check your connection and try again.",
  signIn: "Could not sign in. Check your email and password.",
  signUpRequired: "Email and password are required.",
  signUpPassword: "Password should be at least 6 characters.",
  signUpConfirmEmail:
    "Account created! Please check your email to confirm your account.",
  generic: "Something went wrong. Please try again.",
} as const;

const isDev = process.env.NODE_ENV === "development";

export function friendlyAuthError(error: {
  message?: string;
  status?: number;
}): string {
  if (error.status === 521 || error.status === 503 || error.status === 0) {
    return ERRORS.connection;
  }
  if (error.message && error.message !== "{}" && !error.message.startsWith("{")) {
    return error.message;
  }
  return ERRORS.generic;
}

export function friendlyDbError(context: "action" | "food" | "settings" | "export"): string {
  switch (context) {
    case "action":
      return ERRORS.actionSave;
    case "food":
      return ERRORS.foodSave;
    case "settings":
      return ERRORS.settingsSave;
    case "export":
      return ERRORS.exportFailed;
    default:
      return ERRORS.generic;
  }
}

/** Settings-specific: log full error server-side; expose detail in development */
export function formatSettingsError(error: {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}): string {
  const parts = [error.message, error.code, error.details, error.hint].filter(Boolean);
  const detail = parts.join(" — ");

  console.error("[Settings save failed]", detail);

  if (isDev && detail) {
    return `Settings save failed: ${detail}`;
  }

  if (error.code === "42501") {
    return isDev
      ? `Settings save failed: RLS policy blocked profile save. Run migration 20250609000000_profiles_rls_insert.sql — ${detail}`
      : "Settings could not be saved. Database permissions may need updating.";
  }

  if (error.code === "23514") {
    return isDev
      ? `Settings save failed: theme constraint still allows cozy/bright/calm only. Run supabase/RUN_THIS_IN_SQL_EDITOR.sql in Supabase SQL Editor — ${detail}`
      : "Theme could not be saved. Run supabase/RUN_THIS_IN_SQL_EDITOR.sql in your Supabase dashboard.";
  }

  if (error.message?.includes("character_sounds_enabled")) {
    return isDev
      ? `Settings save failed: missing character_sounds_enabled column. Run migration 20250608200000_character_themes.sql — ${detail}`
      : "Settings could not be saved. Database migration may be required.";
  }

  return ERRORS.settingsSave;
}

/** Flare Day — log server-side; expose detail in development */
export function formatFlareError(
  error: { message?: string; code?: string },
  context: "activate" | "deactivate" = "activate",
): string {
  const detail = [error.message, error.code].filter(Boolean).join(" — ");
  console.error("[Flare Day failed]", context, detail);

  if (isDev && detail) {
    return `Flare Day failed: ${detail}`;
  }

  if (error.code === "42501") {
    return isDev
      ? `Flare Day failed: missing RLS policy. Run supabase migrations for flare_days — ${detail}`
      : context === "deactivate" ? ERRORS.flareEnd : ERRORS.flareSave;
  }

  return context === "deactivate" ? ERRORS.flareEnd : ERRORS.flareSave;
}

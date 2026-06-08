/** User-friendly error messages — never expose raw crashes */

export const ERRORS = {
  notSignedIn: "Please sign in to continue.",
  actionSave: "Could not save your action. Please try again.",
  foodSave: "Could not save food entry. Please try again.",
  foodEmpty: "Please enter a food name.",
  actionAlreadyDone: "You already completed this today!",
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

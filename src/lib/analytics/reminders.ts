import { trackEvent } from "./track-event";

export type ReminderType =
  | "water"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "medication"
  | "exercise";

/** Call when a companion reminder is displayed to the user. */
export function trackReminderShown(type: ReminderType): void {
  void trackEvent("reminder_shown", { type });
}

/** Call when the user taps or acts on a companion reminder. */
export function trackReminderClicked(type: ReminderType): void {
  void trackEvent("reminder_clicked", { type });
}

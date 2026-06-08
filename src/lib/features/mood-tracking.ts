/** @future Mood Tracking — optional daily mood check-ins */

export type MoodLevel = "great" | "good" | "okay" | "low" | "rough";

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodLevel;
  loggedAt: string;
}

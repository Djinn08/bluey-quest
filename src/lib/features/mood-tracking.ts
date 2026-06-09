/** Daily mood check-in — one journal entry per user per day (1 = worst, 10 = best) */

export const MOOD_NOTES_MAX = 1000;

const NOTES_COUNTER_NORMAL_MAX = 200;
const NOTES_COUNTER_WARNING_MAX = 500;

function getLocalDateString(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Status line beneath the Daily Check-In section title */
export function formatCheckInStatus(
  updatedAt: string | null,
  hasCheckInToday: boolean,
): string {
  if (!hasCheckInToday || !updatedAt) {
    return "No check-in yet today";
  }

  const updated = new Date(updatedAt);
  const now = new Date();
  const updatedDay = getLocalDateString(updated);
  const today = getLocalDateString(now);
  const time = formatTime(updated);

  if (updatedDay === today) {
    return `Last updated today at ${time}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (updatedDay === getLocalDateString(yesterday)) {
    return `Last updated yesterday at ${time}`;
  }

  return `Last updated on ${updated.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${time}`;
}

/** Character counter color tiers for optional notes */
export function getNotesCounterClass(length: number): string {
  if (length > NOTES_COUNTER_WARNING_MAX) {
    return "text-[var(--primary)] font-semibold";
  }
  if (length >= NOTES_COUNTER_NORMAL_MAX) {
    return "text-warning font-medium";
  }
  return "text-theme-muted";
}

export function hasCompletedCheckInToday(
  moodScore: number | null | undefined,
): boolean {
  return moodScore != null;
}

export function getMoodFaceForScore(score: number): string {
  return MOOD_FACE_OPTIONS.find((o) => o.score === score)?.face ?? "🙂";
}

export const MOOD_FACE_OPTIONS = [
  { score: 1, face: "😫" },
  { score: 2, face: "😞" },
  { score: 3, face: "😕" },
  { score: 4, face: "😐" },
  { score: 5, face: "🙂" },
  { score: 6, face: "😊" },
  { score: 7, face: "😄" },
  { score: 8, face: "😁" },
  { score: 9, face: "🤩" },
  { score: 10, face: "🥳" },
] as const;

export type MoodScore = (typeof MOOD_FACE_OPTIONS)[number]["score"];

export interface MoodEntry {
  id: string;
  userId: string;
  entryDate: string;
  moodScore: number | null;
  moodNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

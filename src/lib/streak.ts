/** Keepy Uppy Bonus multiplier tiers by streak length */
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 100) return 2.0;
  if (streakDays >= 60) return 1.75;
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.25;
  if (streakDays >= 7) return 1.1;
  return 1.0;
}

export function formatMultiplier(multiplier: number): string {
  return `${multiplier.toFixed(1)}x`;
}

export function applyMultiplier(baseReward: number, multiplier: number): number {
  return Math.round(baseReward * multiplier);
}

/**
 * Updates streak based on last activity date and today.
 * Returns new streak count and whether the streak was reset due to missed days.
 */
export function computeStreakUpdate(
  currentStreak: number,
  lastActivityDate: string | null,
  today: string,
): { newStreak: number; wasReset: boolean } {
  if (!lastActivityDate) {
    return { newStreak: 1, wasReset: false };
  }

  if (lastActivityDate === today) {
    return { newStreak: currentStreak, wasReset: false };
  }

  const last = parseDateOnly(lastActivityDate);
  const now = parseDateOnly(today);
  const diffDays = daysBetween(last, now);

  if (diffDays === 1) {
    return { newStreak: Math.max(currentStreak, 0) + 1, wasReset: false };
  }

  // Missed one or more days — fresh streak starting today
  return { newStreak: 1, wasReset: currentStreak > 0 };
}

/** If user had no activity yesterday, streak should be 0 until they act today */
export function streakExpiredWithoutActivityToday(
  lastActivityDate: string | null,
  today: string,
): boolean {
  if (!lastActivityDate) return false;

  const last = parseDateOnly(lastActivityDate);
  const now = parseDateOnly(today);
  const diffDays = daysBetween(last, now);

  return diffDays > 1;
}

export function getTodayDateString(timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone ?? undefined,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseDateOnly(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

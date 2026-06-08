import { STREAK_RESET_MESSAGE } from "@/lib/constants";

interface StreakMessageProps {
  show: boolean;
}

export function StreakMessage({ show }: StreakMessageProps) {
  if (!show) return null;

  return (
    <div
      className="animate-fade-in rounded-2xl bg-orange-50 px-4 py-3 text-center text-orange-900 ring-1 ring-orange-200"
      role="status"
    >
      <p className="font-medium">{STREAK_RESET_MESSAGE}</p>
    </div>
  );
}

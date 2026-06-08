import { Card } from "@/components/ui/Card";
import { formatMultiplier } from "@/lib/streak";

interface StatsBannerProps {
  balance: number;
  streakDays: number;
  multiplier: number;
}

export function StatsBanner({ balance, streakDays, multiplier }: StatsBannerProps) {
  return (
    <Card className="bg-theme-stats">
      <div className="space-y-4">
        <div>
          <p className="text-theme-muted text-sm font-medium">Current Dollarbucks</p>
          <p className="text-theme text-4xl font-extrabold tracking-tight">
            {balance.toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-theme-muted text-sm font-medium">Keepy Uppy Streak</p>
            <p className="text-2xl font-bold" style={{ color: "var(--streak-accent)" }}>
              {streakDays} {streakDays === 1 ? "Day" : "Days"}
            </p>
          </div>
          <div>
            <p className="text-theme-muted text-sm font-medium">Keepy Uppy Bonus</p>
            <p className="text-theme text-2xl font-bold">{formatMultiplier(multiplier)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

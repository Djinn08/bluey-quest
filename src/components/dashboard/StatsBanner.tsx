import { Card } from "@/components/ui/Card";
import { formatMultiplier } from "@/lib/streak";

interface StatsBannerProps {
  balance: number;
  streakDays: number;
  multiplier: number;
}

export function StatsBanner({ balance, streakDays, multiplier }: StatsBannerProps) {
  return (
    <Card className="bg-gradient-to-br from-sky-50 to-orange-50">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-sky-700">Current Dollarbucks</p>
          <p className="text-4xl font-extrabold tracking-tight text-sky-900">
            {balance.toLocaleString()}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-sky-700">Keepy Uppy Streak</p>
            <p className="text-2xl font-bold text-orange-600">
              {streakDays} {streakDays === 1 ? "Day" : "Days"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-sky-700">Keepy Uppy Bonus</p>
            <p className="text-2xl font-bold text-sky-600">
              {formatMultiplier(multiplier)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

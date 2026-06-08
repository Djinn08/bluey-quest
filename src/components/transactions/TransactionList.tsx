import { Card } from "@/components/ui/Card";
import { formatShortDate, formatTime } from "@/lib/format";
import type { Transaction } from "@/lib/types/database";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <p className="text-center text-sky-700">
          Complete a daily action to earn your first Dollarbucks!
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => {
        const multiplier = Number(tx.multiplier);
        return (
          <li key={tx.id}>
            <Card className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-sky-600">
                    {formatTime(tx.created_at)}
                  </p>
                  <p className="text-xs text-sky-500">{formatShortDate(tx.created_at)}</p>
                  <p className="mt-1 text-lg font-bold text-sky-900">{tx.action}</p>
                  {multiplier !== 1 && (
                    <p className="text-xs text-orange-600">
                      {multiplier.toFixed(1)}x Keepy Uppy bonus applied
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-orange-600">
                    +{tx.reward_earned}
                  </p>
                  <p className="text-xs text-sky-500">
                    base {tx.base_reward}
                    {multiplier !== 1 && ` × ${multiplier.toFixed(1)}`}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

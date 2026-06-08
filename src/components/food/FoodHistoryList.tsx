"use client";

import { Card } from "@/components/ui/Card";
import { formatDateLabel, formatTime } from "@/lib/format";
import type { FoodEntry } from "@/lib/types/database";

interface FoodHistoryListProps {
  entries: FoodEntry[];
}

function groupByDate(entries: FoodEntry[]): Map<string, FoodEntry[]> {
  const map = new Map<string, FoodEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.entry_date) ?? [];
    list.push(entry);
    map.set(entry.entry_date, list);
  }
  for (const [, list] of map) {
    list.sort(
      (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime(),
    );
  }
  return map;
}

export function FoodHistoryList({ entries }: FoodHistoryListProps) {
  const grouped = groupByDate(entries);
  const sortedDates = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  if (entries.length === 0) {
    return (
      <Card>
        <p className="text-center text-sky-700">
          No food logged yet. Tap Log Food on the home screen to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => {
        const dayEntries = grouped.get(date)!;
        return (
          <Card key={date}>
            <h3 className="mb-4 text-lg font-bold text-sky-900">
              {formatDateLabel(date)}
            </h3>
            <ul className="space-y-4">
              {dayEntries.map((entry) => (
                <li key={entry.id} className="border-b border-sky-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-sky-600">
                    {formatTime(entry.logged_at)}
                  </p>
                  <p className="mt-0.5 text-base font-medium text-sky-900">
                    {entry.food_name}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { redeemStoreItem } from "@/app/actions/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STORE_ITEMS } from "@/lib/store/items";

interface StoreGridProps {
  balance: number;
}

export function StoreGrid({ balance }: StoreGridProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleRedeem(itemId: string) {
    setActiveId(itemId);
    setMessage(null);
    startTransition(async () => {
      const result = await redeemStoreItem(itemId);
      setActiveId(null);
      if (result.success) {
        setMessage(`Redeemed ${result.itemName}! Enjoy! 🎉`);
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-orange-50 to-sky-50">
        <p className="text-sm text-sky-700">Your balance</p>
        <p className="text-3xl font-extrabold text-sky-900">{balance.toLocaleString()} Dollarbucks</p>
      </Card>

      {message && (
        <p className="rounded-xl bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-900" role="status">
          {message}
        </p>
      )}

      <div className="space-y-3">
        {STORE_ITEMS.map((item) => {
          const canAfford = balance >= item.cost;
          const loading = pending && activeId === item.id;
          return (
            <Card key={item.id} className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden>{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sky-900">{item.name}</p>
                <p className="text-sm text-sky-700">{item.description}</p>
                <p className="mt-1 font-semibold text-orange-600">{item.cost.toLocaleString()} DB</p>
              </div>
              <Button
                size="md"
                variant={canAfford ? "secondary" : "accent"}
                disabled={!canAfford || pending}
                onClick={() => handleRedeem(item.id)}
              >
                {loading ? "..." : canAfford ? "Redeem" : "Save up"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

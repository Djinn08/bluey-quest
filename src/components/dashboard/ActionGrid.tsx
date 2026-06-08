"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { completeDailyAction } from "@/app/actions/game";
import { Button } from "@/components/ui/Button";
import { FloatingReward } from "@/components/ui/FloatingReward";
import { Modal } from "@/components/ui/Modal";
import {
  ACTION_LABELS,
  ACTION_REWARDS,
  DAILY_ACTION_TYPES,
} from "@/lib/constants";
import type { DailyActionType } from "@/lib/types/database";

interface ActionGridProps {
  completedToday: DailyActionType[];
}

export function ActionGrid({ completedToday }: ActionGridProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeType, setActiveType] = useState<DailyActionType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [floatingReward, setFloatingReward] = useState<number | null>(null);
  const [justCompleted, setJustCompleted] = useState<DailyActionType | null>(null);
  const [chaosModal, setChaosModal] = useState<{ message: string; bonus: number } | null>(null);
  const [localCompleted, setLocalCompleted] = useState<Set<DailyActionType>>(
    () => new Set(completedToday),
  );

  const completedSet = new Set([...completedToday, ...localCompleted]);
  const clearFloating = useCallback(() => setFloatingReward(null), []);

  function handleComplete(actionType: DailyActionType) {
    if (completedSet.has(actionType) || pending) return;

    setActiveType(actionType);
    setErrorMsg(null);

    startTransition(async () => {
      const result = await completeDailyAction(actionType);
      setActiveType(null);

      if (result.success) {
        setLocalCompleted((prev) => new Set(prev).add(actionType));
        setJustCompleted(actionType);
        setFloatingReward(result.rewardEarned);
        if (result.chaosEvent) {
          setChaosModal(result.chaosEvent);
        }
        setTimeout(() => setJustCompleted(null), 600);
        router.refresh();
      } else {
        setErrorMsg(result.error);
        setTimeout(() => setErrorMsg(null), 3500);
      }
    });
  }

  return (
    <div className="space-y-3">
      {floatingReward !== null && (
        <FloatingReward amount={floatingReward} onDone={clearFloating} />
      )}

      {errorMsg && (
        <p className="animate-fade-in rounded-xl bg-orange-50 px-4 py-2 text-center text-sm font-medium text-orange-900" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {DAILY_ACTION_TYPES.map((type) => {
          const done = completedSet.has(type);
          const loading = pending && activeType === type;
          const pop = justCompleted === type;

          return (
            <Button
              key={type}
              variant={done ? "completed" : "primary"}
              fullWidth
              disabled={done || pending}
              onClick={() => handleComplete(type)}
              aria-label={`${ACTION_LABELS[type]}${done ? ", completed today" : ""}`}
              className={`flex-col gap-0.5 py-3 ${pop ? "animate-complete-pop" : done ? "animate-fade-in" : ""}`}
            >
              {loading ? (
                "..."
              ) : done ? (
                <>
                  <span className="text-xl" aria-hidden>✓</span>
                  <span className="text-sm font-bold">{ACTION_LABELS[type]}</span>
                  <span className="text-xs opacity-90">Completed Today</span>
                </>
              ) : (
                <>
                  <span>{ACTION_LABELS[type]}</span>
                  <span className="text-sm opacity-90">+{ACTION_REWARDS[type]}</span>
                </>
              )}
            </Button>
          );
        })}
      </div>

      <Modal open={!!chaosModal} onClose={() => setChaosModal(null)} title="Muffin Chaos Event!">
        {chaosModal && (
          <div className="space-y-4 text-center">
            <p className="text-4xl" aria-hidden>🐾</p>
            <p className="text-lg font-bold text-orange-700">{chaosModal.message}</p>
            <p className="text-2xl font-extrabold text-sky-900">+{chaosModal.bonus} Bonus Dollarbucks</p>
            <Button fullWidth onClick={() => setChaosModal(null)}>
              Yay!
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

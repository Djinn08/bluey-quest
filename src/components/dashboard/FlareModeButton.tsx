"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { activateFlareMode, deactivateFlareMode } from "@/app/actions/flare";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface FlareModeButtonProps {
  isActive: boolean;
}

export function FlareModeButton({ isActive }: FlareModeButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [localActive, setLocalActive] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const flareActive = localActive ?? isActive;

  useEffect(() => {
    setLocalActive(null);
  }, [isActive]);

  function handleActivate() {
    if (flareActive || pending) return;

    setErrorMsg(null);
    startTransition(async () => {
      const result = await activateFlareMode();
      if (result.success) {
        setLocalActive(true);
        router.refresh();
      } else {
        setErrorMsg(result.error);
        setTimeout(() => setErrorMsg(null), 3500);
      }
    });
  }

  function handleDeactivate() {
    if (!flareActive || pending) return;

    setErrorMsg(null);
    startTransition(async () => {
      const result = await deactivateFlareMode();
      if (result.success) {
        setLocalActive(false);
        router.refresh();
      } else {
        setErrorMsg(result.error);
        setTimeout(() => setErrorMsg(null), 3500);
      }
    });
  }

  return (
    <Card className={flareActive ? "border-2 border-emerald-300 bg-emerald-50/80" : ""}>
      <div className="space-y-2">
        <p className="text-theme-muted text-sm font-medium">
          {flareActive
            ? "Today's goal is survival, not perfection."
            : "Having a rough day? Flare Day protects your streak and lowers expectations."}
        </p>

        {flareActive ? (
          <div className="flex items-stretch gap-2">
            <Button
              variant="completed"
              disabled
              className="min-h-16 flex-1 flex-col gap-0.5 py-3"
              aria-label="Flare Day active for today"
            >
              <span className="text-xl" aria-hidden>
                ✓
              </span>
              <span className="text-sm font-bold">Flare Day</span>
              <span className="text-xs opacity-90">Completed Today</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={pending}
              onClick={handleDeactivate}
              className="min-h-16 shrink-0 px-4"
              aria-label="End Flare Day — feeling better"
            >
              {pending ? "..." : "All Better!"}
            </Button>
          </div>
        ) : (
          <Button variant="secondary" fullWidth disabled={pending} onClick={handleActivate}>
            {pending ? "Activating..." : "⚡ Flare Day"}
          </Button>
        )}

        {errorMsg && (
          <p className="text-warning text-center text-sm" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </Card>
  );
}

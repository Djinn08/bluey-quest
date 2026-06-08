"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { activateFlareMode } from "@/app/actions/flare";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface FlareModeButtonProps {
  isActive: boolean;
}

export function FlareModeButton({ isActive }: FlareModeButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [localActive, setLocalActive] = useState(isActive);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLocalActive(isActive);
  }, [isActive]);

  function handleActivate() {
    if (localActive || pending) return;

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

  return (
    <Card className={localActive ? "border-2 border-emerald-300 bg-emerald-50/80" : ""}>
      <div className="space-y-2">
        <p className="text-theme-muted text-sm font-medium">
          {localActive
            ? "Today's goal is survival, not perfection."
            : "Having a rough day? Flare Day protects your streak and lowers expectations."}
        </p>

        {localActive ? (
          <Button variant="completed" fullWidth disabled className="flex-col gap-0.5 py-3">
            <span className="text-xl" aria-hidden>
              ✓
            </span>
            <span className="text-sm font-bold">Flare Day</span>
            <span className="text-xs opacity-90">✓ Flare Day Active</span>
          </Button>
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

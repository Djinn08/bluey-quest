"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/lib/characters";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || dismissed || !deferred) return null;

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    setDeferred(null);
    setDismissed(true);
  }

  return (
    <div className="themed-install rounded-2xl px-4 py-3">
      <p className="text-theme text-sm font-medium">
        Install {APP_NAME} on your home screen — look for the Dollarbuck icon!
      </p>
      <div className="mt-2 flex gap-2">
        <Button size="md" onClick={handleInstall}>
          Install
        </Button>
        <button
          type="button"
          className="text-theme-muted min-h-12 rounded-2xl px-4 text-sm font-medium hover:bg-[var(--card-alt)]"
          onClick={() => setDismissed(true)}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

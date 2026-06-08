"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { activateMuffinMode } from "@/app/actions/easter-egg";
import { Button } from "@/components/ui/Button";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";

const STORAGE_KEY = "bluey-quest-sneak-peek-count";
const ACTIVATED_KEY = "bluey-quest-muffin-mode";
const MUFFIN_CLICKS_REQUIRED = 5;

type ModalMode = "preview" | "muffin" | null;

export function SneakPeekButton() {
  const router = useRouter();
  const [clicks, setClicks] = useState(0);
  const [muffinActivated, setMuffinActivated] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [confetti, setConfetti] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setClicks(Number(localStorage.getItem(STORAGE_KEY) ?? 0));
    setMuffinActivated(!!localStorage.getItem(ACTIVATED_KEY));
  }, []);

  function closeModal() {
    setModalMode(null);
    setConfetti(false);
  }

  function handleClick() {
    if (muffinActivated || pending) return;

    const next = clicks + 1;
    setClicks(next);
    localStorage.setItem(STORAGE_KEY, String(next));

    if (next >= MUFFIN_CLICKS_REQUIRED) {
      startTransition(async () => {
        const result = await activateMuffinMode();
        if (result.success) {
          localStorage.setItem(ACTIVATED_KEY, "1");
          setMuffinActivated(true);
          setBonus(result.bonus);
          setConfetti(true);
          setModalMode("muffin");
          router.refresh();
        } else if (result.error?.includes("already")) {
          localStorage.setItem(ACTIVATED_KEY, "1");
          setMuffinActivated(true);
        } else {
          setModalMode("preview");
        }
      });
    } else {
      setModalMode("preview");
    }
  }

  if (muffinActivated) return null;

  return (
    <>
      {confetti && <ConfettiBurst />}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="mx-auto block text-xs font-medium text-sky-500/80 underline-offset-2 hover:text-sky-700 hover:underline disabled:opacity-50"
      >
        👀 Sneak Peek
      </button>

      {modalMode === "preview" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-sky-950/50 p-4">
          <div
            className="animate-bounce-in max-w-sm rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-2xl font-extrabold text-purple-700">🐶 Muffin Preview</p>
            <p className="mt-3 text-center text-sm font-medium text-purple-900">
              Muffin has reviewed the app and determined it requires more chaos.
            </p>
            <div className="mt-4 rounded-2xl bg-white/70 p-4">
              <p className="text-sm font-bold text-purple-800">Coming Soon:</p>
              <ul className="mt-2 space-y-1 text-sm text-purple-900">
                <li>• Flare Shields</li>
                <li>• Dollarbucks Store</li>
                <li>• Achievements</li>
                <li>• Daily Quests</li>
              </ul>
            </div>
            <Button className="mt-4" fullWidth onClick={closeModal}>
              Continue Adventure
            </Button>
          </div>
        </div>
      )}

      {modalMode === "muffin" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-sky-950/50 p-4">
          <div
            className="animate-bounce-in max-w-sm rounded-3xl bg-gradient-to-br from-orange-100 to-pink-100 p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-3xl font-extrabold text-orange-600">🐶 MUFFIN MODE ACTIVATED</p>
            <p className="mt-3 text-lg font-bold text-sky-900">I AM THE FLAMINGO QUEEN.</p>
            {bonus > 0 && (
              <p className="mt-2 text-xl font-extrabold text-orange-500">+{bonus} Dollarbucks</p>
            )}
            <Button className="mt-4" fullWidth onClick={closeModal}>
              Magnificent
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

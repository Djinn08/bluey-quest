"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { activateMuffinMode } from "@/app/actions/easter-egg";
import { Button } from "@/components/ui/Button";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { CharacterImage } from "@/components/ui/CharacterImage";
import { CHARACTER_ASSETS, FLAMINGO_QUEEN_TITLE } from "@/lib/characters";

const STORAGE_KEY = "bluey-quest-sneak-peek-count";
const ACTIVATED_KEY = "bluey-quest-muffin-mode";
const MUFFIN_CLICKS_REQUIRED = 5;
const isDev = process.env.NODE_ENV === "development";

type ModalMode = "preview" | "muffin" | null;

interface SneakPeekContextValue {
  registerTap: () => void;
  tapCount: number;
  flamingoModeActive: boolean;
  modalOpen: boolean;
}

const SneakPeekContext = createContext<SneakPeekContextValue | null>(null);

function debugLog(...args: unknown[]) {
  if (isDev) console.log("[SneakPeek]", ...args);
}

export function SneakPeekProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [flamingoModeActive, setFlamingoModeActive] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [confetti, setConfetti] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const storedClicks = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    const activated = !!localStorage.getItem(ACTIVATED_KEY);
    setClicks(storedClicks);
    setFlamingoModeActive(activated);
    setHydrated(true);
    debugLog("hydrated", { tapCount: storedClicks, flamingoModeActive: activated });
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setConfetti(false);
    debugLog("modal closed");
  }, []);

  const registerTap = useCallback(() => {
    if (!hydrated) {
      debugLog("tap ignored — not hydrated yet");
      return;
    }
    if (flamingoModeActive) {
      debugLog("tap ignored — flamingo mode already active");
      return;
    }
    if (pending) {
      debugLog("tap ignored", { pending });
      return;
    }

    const next = clicks + 1;
    setClicks(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    debugLog("tap count", next);

    if (next >= MUFFIN_CLICKS_REQUIRED) {
      debugLog("threshold reached — activating Flamingo Queen");
      startTransition(async () => {
        const result = await activateMuffinMode();
        if (result.success) {
          localStorage.setItem(ACTIVATED_KEY, "1");
          setFlamingoModeActive(true);
          setBonus(result.bonus);
          setConfetti(true);
          setModalMode("muffin");
          debugLog("modal open", "muffin", { bonus: result.bonus });
          router.refresh();
        } else if (result.error?.includes("already")) {
          localStorage.setItem(ACTIVATED_KEY, "1");
          setFlamingoModeActive(true);
          debugLog("flamingo mode already active on server");
        } else {
          setModalMode("preview");
          debugLog("modal open", "preview", { activationError: result.error });
        }
      });
    } else {
      setModalMode("preview");
      debugLog("modal open", "preview");
    }
  }, [hydrated, flamingoModeActive, pending, clicks, router]);

  const modalOpen = modalMode !== null;

  return (
    <SneakPeekContext.Provider
      value={{ registerTap, tapCount: clicks, flamingoModeActive, modalOpen }}
    >
      {children}
      {confetti && <ConfettiBurst />}

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
            <p className="mt-2 text-center text-xs font-semibold text-purple-600">
              Sneak Peek {clicks}/{MUFFIN_CLICKS_REQUIRED}
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-purple-950/60 p-4">
          <div
            className="animate-flamingo-glow animate-bounce-in max-w-sm rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-200 p-6 text-center shadow-2xl ring-4 ring-pink-300/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-52">
              <CharacterImage
                src={CHARACTER_ASSETS.muffin.flamingoQueen}
                fallback={CHARACTER_ASSETS.muffin.flamingoQueen}
                alt="Flamingo Queen Muffin"
                width={208}
                height={208}
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-2xl font-extrabold text-purple-800">{FLAMINGO_QUEEN_TITLE}</p>
            <p className="mt-2 text-base font-bold text-pink-700">Long live the ruler of chaos.</p>
            <p className="mt-2 text-lg font-bold text-sky-900">I AM THE FLAMINGO QUEEN.</p>
            {bonus > 0 && (
              <p className="mt-2 text-xl font-extrabold text-orange-500">+{bonus} Dollarbucks</p>
            )}
            <Button className="mt-4" fullWidth onClick={closeModal}>
              Magnificent
            </Button>
          </div>
        </div>
      )}
    </SneakPeekContext.Provider>
  );
}

export function useSneakPeek(): SneakPeekContextValue {
  const ctx = useContext(SneakPeekContext);
  if (!ctx) {
    throw new Error("useSneakPeek must be used within SneakPeekProvider");
  }
  return ctx;
}

/** Sneak peek trigger — hidden once Flamingo Queen is unlocked (tap companion to replay) */
export function SneakPeekButton() {
  const { registerTap, tapCount, flamingoModeActive } = useSneakPeek();

  if (flamingoModeActive) return null;

  return (
    <button
      type="button"
      onClick={registerTap}
      className="text-[var(--primary)] mx-auto block min-h-10 rounded-full px-4 text-sm font-semibold underline-offset-2 transition hover:bg-[var(--card-alt)] hover:underline"
    >
      👀 Sneak Peek ({tapCount}/5)
    </button>
  );
}
